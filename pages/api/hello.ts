import dbConnect from "@/api-data/dbConnection";
import OlympicWinner from "@/api-data/model/olympicWinner";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
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
};

type APIResponse = {
  olympicData: Data[];
  dataLength: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  try {
    console.log(req.query);
    const startRow = parseInt(req.query.startRow as string, 10);
    const endRow = parseInt(req.query.endRow as string, 10);
    const filters = buildFilters(req.query);
    const sorting = buildSorting(req.query);

    await dbConnect();
    const totalRowCount = await OlympicWinner.countDocuments(filters);
    const rowData = await OlympicWinner.find(filters)
      .sort(sorting)
      .skip(startRow)
      .limit(endRow - startRow);

    res.status(200).json({ olympicData: rowData, dataLength: totalRowCount });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

function buildFilters(query: any) {
  const { athlete, country, sport, year, date } = query;
  const filters: Record<string, any> = {};
  if (athlete) {
    filters.athlete = { $regex: `^${athlete}`, $options: "i" };
  }

  if (country) {
    filters.country = { $regex: `^${country}`, $options: "i" };
  }
  if (sport) {
    filters.sport = { $regex: `^${sport}`, $options: "i" };
  }
  if (year) {
    filters.year = parseInt(year as string, 10);
  }
  if (date) {
    filters.date = { $regex: `^${date}`, $options: "i" };
  }
  return filters;
}

function buildSorting(query: any) {
  const { sort, order } = query;
  // Build your sorting based on sortModel
  const sorting: any = {};
  sorting[sort] = order === "asc" ? 1 : -1;

  return sorting;
}
