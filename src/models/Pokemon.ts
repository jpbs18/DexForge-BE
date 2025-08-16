import mongoose, { Document, Schema } from "mongoose";

const DreamWorldSchema = new Schema(
  {
    front_default: { type: String, default: null },
    front_female: { type: String, default: null },
  },
  { _id: false }
);

const OfficialArtworkSchema = new Schema(
  {
    front_default: { type: String, default: null },
  },
  { _id: false }
);

const OtherSpritesSchema = new Schema(
  {
    dream_world: { type: DreamWorldSchema, default: undefined },
    "official-artwork": { type: OfficialArtworkSchema, default: undefined },
  },
  { _id: false }
);

const SpritesSchema = new Schema(
  {
    back_default: { type: String, default: null },
    back_female: { type: String, default: null },
    back_shiny: { type: String, default: null },
    back_shiny_female: { type: String, default: null },
    front_default: { type: String, default: null },
    front_female: { type: String, default: null },
    front_shiny: { type: String, default: null },
    front_shiny_female: { type: String, default: null },
    other: { type: OtherSpritesSchema, default: undefined },
    versions: { type: Schema.Types.Mixed, default: undefined },
  },
  { _id: false }
);

const AbilitySchema = new Schema(
  {
    ability: {
      name: String,
      url: String,
    },
    is_hidden: Boolean,
    slot: Number,
  },
  { _id: false }
);

const FormSchema = new Schema(
  {
    name: String,
    url: String,
  },
  { _id: false }
);

const GameIndexSchema = new Schema(
  {
    game_index: Number,
    version: {
      name: String,
      url: String,
    },
  },
  { _id: false }
);

const VersionDetailForHeldItemSchema = new Schema(
  {
    rarity: Number,
    version: {
      name: String,
      url: String,
    },
  },
  { _id: false }
);

const HeldItemSchema = new Schema(
  {
    item: {
      name: String,
      url: String,
    },
    version_details: [VersionDetailForHeldItemSchema],
  },
  { _id: false }
);

const MoveLearnMethodSchema = new Schema(
  {
    name: String,
    url: String,
  },
  { _id: false }
);

const VersionGroupSchema = new Schema(
  {
    name: String,
    url: String,
  },
  { _id: false }
);

const VersionGroupDetailSchema = new Schema(
  {
    level_learned_at: Number,
    move_learn_method: MoveLearnMethodSchema,
    version_group: VersionGroupSchema,
  },
  { _id: false }
);

const MoveSchema = new Schema(
  {
    move: {
      name: String,
      url: String,
    },
    version_group_details: [VersionGroupDetailSchema],
  },
  { _id: false }
);

const PastTypeTypeSchema = new Schema(
  {
    slot: Number,
    type: {
      name: String,
      url: String,
    },
  },
  { _id: false }
);

const PastTypeSchema = new Schema(
  {
    generation: {
      name: String,
      url: String,
    },
    types: [PastTypeTypeSchema],
  },
  { _id: false }
);

const SpeciesSchema = new Schema(
  {
    name: String,
    url: String,
  },
  { _id: false }
);

const StatStatSchema = new Schema(
  {
    name: String,
    url: String,
  },
  { _id: false }
);

const StatSchema = new Schema(
  {
    base_stat: Number,
    effort: Number,
    stat: StatStatSchema,
  },
  { _id: false }
);

const EvolutionsSchema = new Schema(
  {
    species: { type: String, required: true },
  },
  { _id: false }
);

const TypeTypeSchema = new Schema(
  {
    name: String,
    url: String,
  },
  { _id: false }
);

const TypeSchema = new Schema(
  {
    slot: Number,
    type: TypeTypeSchema,
  },
  { _id: false }
);

export interface PokemonDocument extends Document {
  abilities: {
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }[];
  base_experience: number;
  forms: { name: string; url: string }[];
  game_indices: {
    game_index: number;
    version: { name: string; url: string };
  }[];
  height: number;
  held_items: {
    item: { name: string; url: string };
    version_details: {
      rarity: number;
      version: { name: string; url: string };
    }[];
  }[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: {
    move: { name: string; url: string };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: { name: string; url: string };
      version_group: { name: string; url: string };
    }[];
  }[];
  name: string;
  order: number;
  past_types: {
    generation: { name: string; url: string };
    types: {
      slot: number;
      type: { name: string; url: string };
    }[];
  }[];
  species: { name: string; url: string };
  sprites: typeof SpritesSchema extends Schema<any> ? any : any;
  stats: {
    base_stat: number;
    effort: number;
    stat: { name: string; url: string };
  }[];
  types: {
    slot: number;
    type: { name: string; url: string };
  }[];
  weight: number;
}

export interface PokemonDetailsDocument extends Document {
  name: string;
  genders: string[];
  weaknesses: string[];
  evolutions: { species: string }[];
  category: string;
}

const PokemonSchema = new Schema(
  {
    abilities: [AbilitySchema],
    base_experience: Number,
    forms: [FormSchema],
    game_indices: [GameIndexSchema],
    height: Number,
    held_items: [HeldItemSchema],
    id: { type: Number, required: true, unique: true },
    is_default: Boolean,
    location_area_encounters: String,
    moves: [MoveSchema],
    name: { type: String, required: true },
    order: Number,
    past_types: [PastTypeSchema],
    species: SpeciesSchema,
    sprites: SpritesSchema,
    stats: [StatSchema],
    types: [TypeSchema],
    weight: Number,
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

const PokemonDetailsSchema = new Schema(
  {
    name: { type: String, required: true },
    genders: { type: [String], required: true },
    weaknesses: { type: [String], required: true },
    evolutions: { type: [EvolutionsSchema], required: true },
    category: { type: String, required: true },
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

export const pokemonTable = mongoose.model<PokemonDocument>(
  "Pokemon",
  PokemonSchema
);
export const pokemonDetailsTable = mongoose.model<PokemonDetailsDocument>(
  "Pokemon_Details",
  PokemonDetailsSchema
);
