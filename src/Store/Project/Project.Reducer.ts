import { Project_Action_Type } from "./Project.Types";

import { Project_Type } from "@/DB/models/Project.Model";
import { Action_Type } from "../Action_Creator";

export interface Project_State_Type {
  Selected_Project: Project_Type | null;
  Project_Data: Project_Type[];
}

const INITIAL_STATE: Project_State_Type = {
  Selected_Project: null,
  Project_Data: [],
};

export const Project_Reducer = (State = INITIAL_STATE, Action: any) => {
  const { type, payload } = Action;

  switch (type) {
    case Project_Action_Type.Set_Project_Data:
      const New_State = {
        ...State,

        Project_Data: payload,
      };
      return New_State;

    case Project_Action_Type.Select_Project:
      return { ...State, Selected_Project: payload };

    case Project_Action_Type.Delete_Project:
      const New_Data = State.Project_Data.filter(
        (project) => project._id !== payload._id
      );
      if (State.Selected_Project?._id === payload._id) {
        State.Selected_Project = null;
      }

      return { ...State, Project_Data: New_Data };
    case Project_Action_Type.Add_Project:
      const New_State_Data = State.Project_Data;
      New_State_Data.push(payload);

      return { ...State, Project_Data: New_State_Data };
    case Project_Action_Type.Update_Project:
      const New_Updated_Data = State.Project_Data.map((project) =>
        project._id === payload._id
          ? { ...project, name: payload.name }
          : project
      );

      if (State.Selected_Project?._id === payload._id) {
        State.Selected_Project = payload;
      }

      return { ...State, Project_Data: New_Updated_Data };
    default:
      return State;
  }
};
