import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { pokemonBasicInfo, pokemonDetailsTable } from "../../../modules/pokemon/entities";


describe("Pokemon Mongoose Models", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("pokemonBasicInfo model should exist", () => {
    expect(pokemonBasicInfo).toBeDefined();
  });

  test("pokemonDetailsTable model should exist", () => {
    expect(pokemonDetailsTable).toBeDefined();
  });

  test("pokemonBasicInfo toJSON should remove _id", () => {
    const doc = new pokemonBasicInfo({
      id: 1,
      name: "Bulbasaur",
      image: "bulbasaur.png",
      types: ["grass", "poison"],
    });
    const json = doc.toJSON();
    expect(json._id).toBeUndefined();
    expect(json.id).toBe(1);
  });

  test("pokemonDetailsTable toJSON should remove _id", () => {
    const doc = new pokemonDetailsTable({
      id: 1,
      name: "Bulbasaur",
      image: "bulbasaur.png",
      genders: ["male", "female"],
      abilities: ["overgrow"],
      weaknesses: ["fire", "psychic"],
      evolutions: ["Ivysaur"],
      category: "Seed Pokémon",
      weight: 69,
      height: 7,
      stats: [{ name: "hp", base_stat: 45 }],
      types: ["grass", "poison"],
    });
    const json = doc.toJSON();
    expect(json._id).toBeUndefined();
    expect(json.id).toBe(1);
    expect(json.stats[0].name).toBe("hp");
  });
});
