import { Project_Type } from "@/DB/models/Project.Model";
import { Task_Type } from "@/DB/models/Task.Model";
import { User_Type } from "@/DB/models/User.Model";

export interface Action_Type {
  type: String;
  payload:
    | undefined
    | Project_Type
    | Project_Type[]
    | Task_Type
    | Task_Type[]
    | null;
}

export type Payload =
  | undefined
  | Project_Type
  | Project_Type[]
  | Task_Type
  | Task_Type[]
  | User_Type
  | null;

const Create_Action = (type: String, payload: Payload) => {
  return { type, payload };
};
export default Create_Action;
