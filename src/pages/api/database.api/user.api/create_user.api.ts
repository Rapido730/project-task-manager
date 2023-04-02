import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { User, User_Type } from "@/DB/models/User.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = req.body;
    connectMongoose();
    const old_User = await User.findOne({
      email: data.email,
    });
    if (!old_User) {
      const new_User = new User({
        name: data.name,
        email: data.email,
        role:"developer"
      });
      await new_User.save();
      res.status(201).json({
        user: new_User,
      });
    }
    res.status(201).json({
      user: old_User,
    });
  } catch (err) {
    res.status(400).json(err);
  }
}
