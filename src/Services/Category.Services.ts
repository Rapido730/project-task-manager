import { Template_Category_Type } from "DB/models/Category.Model";
import axios from "axios";
import { Project_Type } from "DB/models/Project.Model";

export const Update_Category = async (Category: Template_Category_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/category.api/update.category.api",
      {
        ...Category,
      }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Category };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Create_Category = async (Category: Template_Category_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/category.api/create.category.api",
      {
        ...Category,
      }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Category };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Delete_Category = async (Category: Template_Category_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/category.api/delete.category.api",
      {
        ...Category,
      }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Category };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Fetch_All_Category = async (project: Project_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/category.api/read_all.category.api",
      {
        ...project,
      }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Categories };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};
