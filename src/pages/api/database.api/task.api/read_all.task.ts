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
    // console.log("yes");
    const data = req.body;
    const current_Project = await Project.findOne({ _id: data._id });
    await current_Project.populate({
      path: "tasks",
    });
    res.status(200).json({
      Tasks: current_Project.tasks,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
