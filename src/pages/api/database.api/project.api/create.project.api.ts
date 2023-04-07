import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { Project, Project_Type } from "@/DB/models/Project.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = req.body;
    connectMongoose();
    const new_Project = new Project({
      name: data.name,
      description: data.description,
      manager_Id: data.manager_Id,
    });

    const projects = await Project.find({
      name: new_Project.name,
      manager_Id: new_Project.manager_Id,
    });

    if (projects.length) {
      const date = new Date();

      new_Project["name"] =
        new_Project["name"] +
        `[${
          date.toLocaleDateString() + " " + date.toTimeString().split(" ")[0]
        }]`;
    }
    await new_Project.save();
    res.status(201).json({
      Project: new_Project,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
