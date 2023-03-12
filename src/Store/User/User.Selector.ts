import { State_Type } from "../Root_Reducer";

export {};

export const Select_Current_User = (State: State_Type) =>
  State.User.Current_User;
