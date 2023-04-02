import { Fetch_All_Projects_with_ids } from "@/Services/Project.Services";
import { Types } from "mongoose";
import { State_Type } from "../Root_Reducer";

export const Select_All_Project = (State: State_Type) => {
  const Tasks = State.Task.Task_Data;

  const Projects = Tasks.reduce((list, task) => {
    if (!list.includes(task.project_Id)) {
      list.push(task.project_Id);
    }
    return list;
  }, [] as Types.ObjectId[]);

  return Projects;
};
