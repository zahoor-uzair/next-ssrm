import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOlympicWinner extends Document {
  athlete: string;
  age: number;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

const olympicWinnerSchema: Schema<IOlympicWinner> = new Schema({
  athlete: String,
  age: Number,
  country: String,
  year: Number,
  date: String,
  sport: String,
  gold: Number,
  silver: Number,
  bronze: Number,
  total: Number,
});

const OlympicWinner: Model<IOlympicWinner> =
  mongoose.models.OlympicWinner ||
  mongoose.model<IOlympicWinner>("OlympicWinner", olympicWinnerSchema);

export default OlympicWinner;
