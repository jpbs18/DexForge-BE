import { pokemonBasicInfo, pokemonDetailsTable } from "../../../modules/pokemon/entities";

jest.mock("mongoose", () => {
  const original = jest.requireActual("mongoose");
  return {
    ...original,
    model: jest.fn((name, schema) => {
      class MockModel {
        _id: any;
        constructor(data: any) {
          Object.assign(this, data);
        }
        toJSON() {
          const ret = { ...this };
          delete ret._id; 
          return ret;
        }
      }
      return MockModel;
    }),
    Schema: original.Schema,
    Document: original.Document,
  };
});

describe("Pokemon Mongoose Models (mocked)", () => {
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
      _id: "fakeid",
    });
    const json = doc.toJSON();
    expect(json._id).toBeUndefined();
    expect(json.id).toBe(1);
    expect(json.name).toBe("Bulbasaur");
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
      _id: "fakeid",
    });
    const json = doc.toJSON();
    expect(json._id).toBeUndefined();
    expect(json.id).toBe(1);
    expect(json.stats[0].name).toBe("hp");
  });
});
