import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { Task } from "@/DB/models/Task.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = req.body;
    connectMongoose();
    const task = await Task.findOneAndDelete({ _id: data._id });

    res.status(200).json({
      Task: task,
    });
  } catch (err) {
    res.status(400).json(err);
  }
}
