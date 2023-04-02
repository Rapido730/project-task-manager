import mongoose, { model, models, Schema, Types } from "mongoose";

const User_Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: "employee",
  },
  created_At: {
    type: Date,
    default: new Date(),
  },
  updated_At: {
    type: Date,
    default: new Date(),
  },
});

User_Schema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "manager_Id",
});

User_Schema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "worker_Id",
});

export type User_Type = {
  name: string;
  created_At: Date;
  role: string;
  updated_At: Date;
  email: string;
  _id?: Types.ObjectId | undefined;
};

export const User = models.User || model("User", User_Schema);

// export EmailTemplate;
