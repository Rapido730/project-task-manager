import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { Task } from "@/DB/models/Task.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fields = ["name", "description", "status", "worker_Id"];
    const data = req.body;
    connectMongoose();
    const task = await Task.findOne({ _id: data._id });

    fields.forEach((field) => {
      task[field] = data[field];
    });

    task["updated_At"] = new Date();
    task.save();

    res.status(200).json({
      Task: task,
    });
  } catch (err) {
    res.status(400).json(err);
  }
}
