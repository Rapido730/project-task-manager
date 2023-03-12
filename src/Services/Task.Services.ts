import { Project_Type } from "@/DB/models/Project.Model";
import { Task, Task_Type } from "@/DB/models/Task.Model";
import axios from "axios";
import { Types } from "mongoose";

export const Task_Delete = async (Data: Task_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/task.api/delete.task.api",
      { ...Data }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Task };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Update_Task = async (Data: Task_Type) => {
  try {
    const response = await axios.post(
      "api/database.api/task.api/update.task.api",
      {
        ...Data,
      }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Task };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Create_Task = async (Data: Task_Type) => {
  try {
    const response = await axios.post(
      "api/database.api/task.api/create.task.api",
      { ...Data }
    );

    if (response.status === 201) {
      return { Status: "Success", Response_Data: response.data.Task };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Fetch_All_Task = async (project: Project_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/task.api/read_all.task",
      {
        ...project,
      }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Tasks };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};
