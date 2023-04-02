import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { User_Type, User } from "@/DB/models/User.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = req.body;
    connectMongoose();
    const user = await User.findOne({ _id: data.User_Id });

    res.status(200).json({
      User: user,
    });
  } catch (err) {
    res.status(400).json(err);
  }
}
