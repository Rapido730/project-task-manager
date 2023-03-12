import { Project_State_Type } from "./Project/Project.Reducer";
import { Task_State_Type } from "./Task/Task.Reducer";
import { User_State_Type } from "./User/User.Reducer";

import { combineReducers } from "redux";

import { User_Reducer } from "./User/User.Reducer";
import { Project_Reducer } from "./Project/Project.Reducer";
import { Task_Reducer } from "./Task/Task.Reducer";

export interface State_Type {
  Project: Project_State_Type;
  Task: Task_State_Type;
  User: User_State_Type;
}
export const Root_Reducer = combineReducers({
  User: User_Reducer,
  Project: Project_Reducer,
  Task: Task_Reducer,
});
