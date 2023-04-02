import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { User_Type, User } from "@/DB/models/User.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    connectMongoose();
    const users = await User.find();

    res.status(200).json({
      Users: users,
    });
  } catch (err) {
    res.status(400).json(err);
  }
}
