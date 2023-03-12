import { Project_State_Type } from "./Project/Project.Reducer";
import { Category_State_Type } from "./Category/Category.Reducer";
import { Template_State_Type } from "./Template/Template.Reducer";
import { User_State_Type } from "./User/User.Reducer";

import { combineReducers } from "redux";

import { User_Reducer } from "./User/User.Reducer";
import { Project_Reducer } from "./Project/Project.Reducer";
import { Category_Reducer } from "./Category/Category.Reducer";
import { Template_Reducer } from "./Template/Template.Reducer";

export interface State_Type {
  Project: Project_State_Type;
  Category: Category_State_Type;
  Template: Template_State_Type;
  User: User_State_Type;
}
export const Root_Reducer = combineReducers({
  User: User_Reducer,
  Project: Project_Reducer,
  Category: Category_Reducer,
  Template: Template_Reducer,
});
