import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { pokemonDetailsTable, pokemonBasicInfo } from "./models/Pokemon";

dotenv.config();

const BATCH_SIZE = 20; // Number of concurrent requests

async function rebuildAllEvolutions() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Connected to MongoDB");

    // Map name -> id from pokemon_basicinfo
    const basics = await pokemonBasicInfo.find({}, { name: 1, id: 1 }).lean();
    const nameToIdMap: Record<string, number> = {};
    basics.forEach(p => (nameToIdMap[p.name.toLowerCase()] = p.id));

    const details = await pokemonDetailsTable.find();

    for (let i = 0; i < details.length; i += BATCH_SIZE) {
      const batch = details.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async p => {
          try {
            // Fetch species data
            const speciesRes = await fetch(
              `https://pokeapi.co/api/v2/pokemon-species/${p.name.toLowerCase()}`
            );
            const speciesData = await speciesRes.json();
            const chainUrl = speciesData.evolution_chain.url;

            // Fetch evolution chain
            const chainRes = await fetch(chainUrl);
            const chainData = await chainRes.json();

            // Parse evolution chain recursively
            const evoNames: string[] = [];
            function traverse(chain: any) {
              evoNames.push(chain.species.name);
              chain.evolves_to.forEach((next: any) => traverse(next));
            }
            traverse(chainData.chain);

            // Convert names to official artwork URLs
            const newEvolutions = evoNames
              .map(name => {
                const id = nameToIdMap[name.toLowerCase()];
                if (!id) return null;
                return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
              })
              .filter(Boolean) as string[];

            // Update document
            p.evolutions = newEvolutions;
            await p.save();
            console.log(`✅ Updated evolutions for ${p.name}`);
          } catch (err) {
            console.warn(`⚠️ Failed to update evolutions for ${p.name}:`, err);
          }
        })
      );
    }

    console.log("🎉 All Pokémon evolutions rebuilt as URL arrays!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error rebuilding evolutions:", err);
  }
}

rebuildAllEvolutions();
