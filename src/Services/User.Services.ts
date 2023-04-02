import axios from "axios";
import { User_Type, User } from "@/DB/models/User.Model";

import { Session } from "next-auth";

export const Get_User_Document = async (data: Session) => {
  const response = await axios.post(
    "http://localhost:3000/api/database.api/user.api/create_user.api",
    {
      email: data?.user?.email,
      name: data?.user?.name,
    }
  );

  if (response.status === 201) {
    return { Status: "Success", Response_Data: response.data.user };
  } else {
    return { Status: "Error", Response_Data: null };
  }
};

export const Update_User = async (user: User_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/user.api/update.user.api",
      {
        ...user,
      }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.User };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};

export const Create_User = async (data: User_Type) => {
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

export const Read_Users = async (user: User_Type) => {
  try {
    const response = await axios.post(
      "/api/database.api/user.api/read_all_user.admin.api",
      {
        ...user,
      }
    );
    if (response.status === 200) {
      return { Status: "Success", Response_Data: response.data.Users };
    } else {
      return { Status: "Database_Error", Response_Data: response };
    }
  } catch {
    return { Status: "Server_Error", Response_Data: {} };
  }
};
