import mongoose, { Document, Schema } from "mongoose";

const StatSchema = new Schema(
  {
    base_stat: Number,
    name: String,
  },
  { _id: false }
);

export interface PokemonDocument extends Document {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const PokemonSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    types: { type: [String], required: true },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret: any) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

export interface PokemonDetailsDocument extends Document {
  id: number;
  name: string;
  genders: string[];
  abilities: string[];
  image: string;
  types: string[];
  weight: number;
  height: number;
  weaknesses: string[];
  evolutions: string[];
  category: string;
  stats: { name: string; base_stat: number }[];
}

const PokemonDetailsSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    genders: { type: [String], required: true },
    abilities: { type: [String], required: true },
    weaknesses: { type: [String], required: true },
    evolutions: { type: [String], required: true },
    category: { type: String, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    stats: { type: [StatSchema], required: true },
    types: { type: [String], required: true },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret: any) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

export const pokemonBasicInfo = mongoose.model<PokemonDocument>(
  "Pokemon_BasicInfo",
  PokemonSchema
);
export const pokemonDetailsTable = mongoose.model<PokemonDetailsDocument>(
  "Pokemon_Details",
  PokemonDetailsSchema
);
