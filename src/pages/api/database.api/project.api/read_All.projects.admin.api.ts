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
    const projects = await Project.find({});
    console.log("aa gye yaha", { projects });
    res.status(200).json({
      Projects: projects,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
