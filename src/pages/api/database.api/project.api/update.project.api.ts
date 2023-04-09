import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { Project } from "@/DB/models/Project.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fields = ["name", "description"];
    const data = req.body;
    connectMongoose();
    const Project_Data = await Project.findOne({ _id: data._id });

    fields.forEach((field) => {
      Project_Data[field] = data[field];
    });

    Project_Data["updated_At"] = new Date();

    Project_Data.save();
    res.status(200).json({
      Project: Project_Data,
    });
  } catch (err) {
    res.status(400).json(err);
  }
}
