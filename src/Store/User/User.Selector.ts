import { State_Type } from "../Root_Reducer";

export {};

export const Select_Current_User = (State: State_Type) =>
  State.User.Current_User;

export const Select_User_Data = (State: State_Type) => {
  const Users = State.User.User_Data;
  const filterted_User = Users.filter(
    (user) => user._id !== State.User.Current_User?._id
  );
  return filterted_User;
};
