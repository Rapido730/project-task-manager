import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { Project } from "@/DB/models/Project.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    connectMongoose();
    // console.log("read project")
    const data = req.body;
    console.log("reading projects", data);
    const Project_Data = await Project.find({
      _id: {
        $in: data.ids,
      }, 
    });
    console.log({ Project_Data });
    res.status(200).json({
      Projects: Project_Data,
    });
  } catch (err) {
    res.status(400).json(err);
  }
}
