import { connectMongoose } from "@/DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { Task } from "@/DB/models/Task.Model";
import { User } from "@/DB/models/User.Model";
export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    connectMongoose();
    const data = req.body;
    const current_User = await User.findOne({ ...data });
    console.log(current_User);
    console.log("read")
    await current_User.populate({
      path: "tasks",
    });
    console.log({current_User})
    res.status(200).json({
      Tasks: current_User.tasks,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
