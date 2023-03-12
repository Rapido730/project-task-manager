// pages/api/test.ts
import { connectMongoose } from "DB/Connect_MongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import { Project } from "DB/models/Project.Model";

const uri: string = process.env.MONGODB_URI || "";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  try {
    connectMongoose();
    console.log("yes");
    const testObject = new Project({
      name: "test2",
    });
    await testObject.save();

    res.status(201).json({
      testObject,
    });

    // Erase test data after use
    // connection.db.dropCollection(testModel.collection.collectionName);
  } catch (err) {
    res.status(400).json(err);
  }
}
