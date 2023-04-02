import axios from "axios";
import { Project_Type } from "@/DB/models/Project.Model";
import { User_Type } from "@/DB/models/User.Model";
import { Types } from "mongoose";

export const Fetch_All_Projects = async (Current_User: User_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/project.api/read_all.project.api",
      {
        _id: Current_User._id,
      }
    );

    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Projects };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Delete_Project = async (project: Project_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/project.api/delete.project.api",
      {
        _id: project._id,
      }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Project };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Update_Project = async (project: Project_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/project.api/update.project.api",
      {
        ...project,
      }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Project };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Create_Project = async (data: Project_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/project.api/create.project.api",
      { ...data }
    );
    if (response.status === 201) {
      return { Status: "Success", Response_Data: response.data.Project };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Fetch_All_Projects_with_ids = async (ids: Types.ObjectId[]) => {
  try {
    const response = await axios.post(
      "/api/database.api/project.api/read.project.api",
      {
        ids: ids,
      }
    );

    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Projects };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Fetch_All_Projects_Admin = async (Current_User: User_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/project.api/read_All.projects.admin.api",
      { Current_User }
    );

    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Projects };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};
