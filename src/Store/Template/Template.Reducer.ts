import { Template_Action_Type } from "./Template.Types";

import { Email_Template_Type } from "DB/models/Template.Model";

export interface Template_State_Type {
  Selected_Template: Email_Template_Type | null;
  Template_Data: Email_Template_Type[];
}

const INITIAL_STATE: Template_State_Type = {
  Selected_Template: null,
  Template_Data: [],
};

export const Template_Reducer = (State = INITIAL_STATE, Action: any) => {
  const { type, payload } = Action;

  switch (type) {
    case Template_Action_Type.Set_Template_Data:
      const New_State = {
        ...State,
        Selected_Template: payload.length > 0 ? payload[0] : null,
        Template_Data: payload,
      };
      return New_State;

    case Template_Action_Type.Select_Template:
      if (State.Selected_Template === payload) {
        return State;
      }

      return { ...State, Selected_Template: payload };

    case Template_Action_Type.Delete_Template:
      const New_Data = State.Template_Data.filter(
        (project) => project._id !== payload._id
      );

      if (State.Selected_Template?._id === payload._id) {
        State.Selected_Template = null;
      }

      return { ...State, Template_Data: New_Data };
    case Template_Action_Type.Update_Template:
      const New_Updated_Data = State.Template_Data.map((project) =>
        project._id === payload._id ? payload : project
      );

      if (State.Selected_Template?._id === payload._id) {
        State.Selected_Template = payload;
      }

      return { ...State, Template_Data: New_Updated_Data };
    case Template_Action_Type.Add_Template:
      const New_State_Data = State.Template_Data;
      if (State.Selected_Template === null) {
        State.Selected_Template = payload;
      }
      New_State_Data.push(payload);

      return { ...State, Template_Data: New_State_Data };

    default:
      return State;
  }
};
