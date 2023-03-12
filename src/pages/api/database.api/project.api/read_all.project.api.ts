import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { Project } from "@/DB/models/Project.Model";
import { User } from "@/DB/models/User.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    connectMongoose();
    const data = req.body;
    const current_User = await User.findOne({ ...data });
    await current_User.populate({
      path: "projects",
    });
    res.status(200).json({
      Projects: current_User.projects,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
