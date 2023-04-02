import { User_Action_Type } from "./User.Types";

// import { Template_User_Type } from "DB/models/template_Categories.model";
import { User_Type } from "@/DB/models/User.Model";
import { Action_Type } from "../Action_Creator";
import { Select_User_Data } from "./User.Selector";

export interface User_State_Type {
  Current_User: User_Type | null;
  User_Data: User_Type[];
  Selected_User: User_Type | null;
}

const INITIAL_STATE: User_State_Type = {
  Current_User: null,
  User_Data: [],
  Selected_User: null,
};

export const User_Reducer = (State = INITIAL_STATE, Action: any) => {
  const { type, payload } = Action;

  switch (type) {
    case User_Action_Type.Set_Current_User:
      return { ...State, Current_User: payload };
    case User_Action_Type.Set_User_Data:
      const newState: User_Type[] = payload;

      return { ...State, User_Data: newState };
    case User_Action_Type.Update_User:
      const Updated_User_List = State.User_Data.map((user) =>
        user._id === payload._id ? payload : user
      );
      let User_Selected = State.Selected_User;
      if (State.Selected_User && State.Selected_User._id === payload._id) {
        User_Selected = payload;
      }

      return {
        ...State,
        User_Data: Updated_User_List,
        Selected_User: User_Selected,
      };

    case User_Action_Type.Select_User:
      return { ...State, Selected_User: payload };
    default:
      return State;
  }
};
