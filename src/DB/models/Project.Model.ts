import mongoose, { model, models, Schema, Types } from "mongoose";

const ProjectSchema = new Schema({
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
  manager_Id: {
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

ProjectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "project_Id",
});

export type Project_Type = {
  name: string;
  description: string;
  created_At?: Date;
  updated_At?: Date;
  manager_Id: Types.ObjectId;
  _id?: Types.ObjectId | undefined;
};

export const Project = models.Project || model("Project", ProjectSchema);

// export EmailTemplate;
