import { Category_Action_Type } from "./Category.Types";

import { Template_Category_Type } from "DB/models/Category.Model";
import { Action_Type } from "../Action_Creator";
import { Project } from "DB/models/Project.Model";

export interface Category_State_Type {
  Selected_Category: Template_Category_Type | null;
  Category_Data: Template_Category_Type[];
}

const INITIAL_STATE: Category_State_Type = {
  Selected_Category: null,
  Category_Data: [],
};

export const Category_Reducer = (State = INITIAL_STATE, Action: any) => {
  const { type, payload } = Action;

  switch (type) {
    case Category_Action_Type.Set_Category_Data:
      const New_State = {
        ...State,
        Selected_Category: payload.length > 0 ? payload[0] : null,
        Category_Data: payload,
      };
      return New_State;

    case Category_Action_Type.Select_Category:
      return { ...State, Selected_Category: payload };

    case Category_Action_Type.Delete_Category:
      const New_Data = State.Category_Data.filter(
        (project) => project._id !== payload._id
      );

      if (State.Selected_Category?._id === payload._id) {
        State.Selected_Category = New_Data.length ? New_Data[0] : null;
      }

      return { ...State, Category_Data: New_Data };
    case Category_Action_Type.Add_Category:
      const New_State_Data = State.Category_Data;

      if (State.Selected_Category === null) {
        State.Selected_Category = payload;
      }

      New_State_Data.push(payload);

      return { ...State, Category_Data: New_State_Data };
    case Category_Action_Type.Update_Category:
      const New_Updated_Data = State.Category_Data.map((category) =>
        category._id === payload._id
          ? { ...category, name: payload.name }
          : category
      );

      if (State.Selected_Category?._id === payload._id) {
        State.Selected_Category = payload;
      }

      return { ...State, Category_Data: New_Updated_Data };
    default:
      return State;
  }
};
