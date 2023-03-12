import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { Task, Task_Type } from "@/DB/models/Task.Model";
import { Types } from "mongoose";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = req.body;
    connectMongoose();
    // console.log("create Task",data)
    const new_task = new Task({
      name: data.name,
      description: data.description,
      manager_Id: data.manager_Id,
      project_Id: data.project_Id,
      worker_Id: data.worker_Id,
    });

    const tasks = await Task.find({
      name: new_task.name,
      project_Id: data.project_Id,
    });

    if (tasks.length) {
      const date = new Date();

      new_task["name"] =
        new_task["name"] +
        `[${
          date.toLocaleDateString() + " - " + date.toTimeString().split(" ")[0]
        }]`;
    }

    await new_task.save();
    res.status(201).json({
      Task: new_task,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
