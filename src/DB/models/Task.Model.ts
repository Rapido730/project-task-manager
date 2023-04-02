import mongoose, { model, models, Schema, Types } from "mongoose";

const Task_Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    default: "ToDo",
  },
  manager_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  project_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  worker_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
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

export type Task_Type = {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  status: string;
  manager_Id: Types.ObjectId;
  project_Id: Types.ObjectId;
  worker_Id: Types.ObjectId;
  created_At: Date;
  updated_At: Date;
};

export const Task = models.Task || model("Task", Task_Schema);

// export EmailTemplate;
