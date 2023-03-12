import mongoose, { model, models, Schema, Types } from "mongoose";
export enum Task_Status {
  ToDo = "ToDo",
  ReworkRequired = "ReworkRequired",
  InReview = "InReview",
  InProgress = "InProgress",
  Completed = "Completed",
}

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
    type: Task_Status,
    required: true,
    default: Task_Status.ToDo,
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
  body: string;
  name: string;
  subject: string;
  created_At?: Date;
  updated_At?: Date;
  author_Id: Types.ObjectId;
  project_Id: Types.ObjectId;
  category_Id: Types.ObjectId;
  _id?: Types.ObjectId | undefined;
};

export const Task = models.Task || model("Task", Task_Schema);

// export EmailTemplate;
