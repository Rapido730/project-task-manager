import { Task_Action_Type } from "./Task.Types";

import { Task_Type } from "@/DB/models/Task.Model";

export interface Task_State_Type {
  Selected_Task: Task_Type | null;
  Task_Data: Task_Type[];
}

const INITIAL_STATE: Task_State_Type = {
  Selected_Task: null,
  Task_Data: [],
};

export const Task_Reducer = (State = INITIAL_STATE, Action: any) => {
  const { type, payload } = Action;

  switch (type) {
    case Task_Action_Type.Set_Task_Data:
      const New_State = {
        ...State,
        Selected_Task: payload.length > 0 ? payload[0] : null,
        Task_Data: payload,
      };
      return New_State;

    case Task_Action_Type.Select_Task:
      if (State.Selected_Task === payload) {
        return State;
      }

      return { ...State, Selected_Task: payload };

    case Task_Action_Type.Delete_Task:
      const New_Data = State.Task_Data.filter(
        (project) => project._id !== payload._id
      );

      if (State.Selected_Task?._id === payload._id) {
        State.Selected_Task = null;
      }

      return { ...State, Task_Data: New_Data };
    case Task_Action_Type.Update_Task:
      const New_Updated_Data = State.Task_Data.map((project) =>
        project._id === payload._id ? payload : project
      );

      if (State.Selected_Task?._id === payload._id) {
        State.Selected_Task = payload;
      }

      return { ...State, Task_Data: New_Updated_Data };
    case Task_Action_Type.Add_Task:
      const New_State_Data = State.Task_Data;
      if (State.Selected_Task === null) {
        State.Selected_Task = payload;
      }
      New_State_Data.push(payload);

      return { ...State, Task_Data: New_State_Data };

    default:
      return State;
  }
};
