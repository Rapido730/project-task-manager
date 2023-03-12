import { Project_Type } from "DB/models/Project.Model";
import { Email_Template_Type } from "DB/models/Template.Model";
import { Template_Category_Type } from "DB/models/Category.Model";
import { User_Type } from "DB/models/User.Model";

export interface Action_Type {
  type: String;
  payload:
    | undefined
    | Project_Type
    | Project_Type[]
    | Template_Category_Type
    | Template_Category_Type[]
    | Email_Template_Type
    | Email_Template_Type[]
    | null;
}

export type Payload =
  | undefined
  | Project_Type
  | Project_Type[]
  | Template_Category_Type
  | Template_Category_Type[]
  | Email_Template_Type
  | Email_Template_Type[]
  | User_Type
  | null;

const Create_Action = (type: String, payload: Payload) => {
  return { type, payload };
};
export default Create_Action;
