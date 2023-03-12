import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { Project } from "@/DB/models/Project.Model";
import { Task } from "@/DB/models/Task.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = req.body;
    connectMongoose();

    await Task.deleteMany({ project_Id: data._id });
    const Project_Data = await Project.findOneAndDelete({ _id: data._id });

    res.status(200).json({
      Project: Project_Data,
    });
  } catch (err) {
    res.status(400).json(err);
  }
}
