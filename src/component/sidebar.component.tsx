import React, { useState, useEffect, useRef, Fragment } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import dynamic from "next/dynamic";
import {
  Button,
  CloseButton,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { Types } from "mongoose";
// import { QuillEditor } from "./Quill_Editor.Component";
import { useDispatch, useSelector } from "react-redux";
import { State_Type } from "@/Store/Root_Reducer";
import Create_Action from "@/Store/Action_Creator";

import Notification_Toast from "./notification_toast.component";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { Task_Action_Type } from "@/Store/Task/Task.Types";
import { Update_Task } from "@/Services/Task.Services";
import { Task_Status } from "./project_preview.component";

interface Props {
  setModalFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  Template_Preview: boolean;
}

export interface Form_Type {
  id?: Types.ObjectId;
  name: string;
  subject: string;
}

const INITIAL_FORM_VALUE = {
  name: "",
  subject: "",
};

function Sidebar_Preview({ setModalFormVisible, Template_Preview }: Props) {
  const Dispatch = useDispatch();
  const [Form_Field, set_Form_Field] = useState<Form_Type>(INITIAL_FORM_VALUE);

  const [Body, Set_Body] = useState("");

  const subjectRef = useRef();

  const { Selected_Task } = useSelector((State: State_Type) => State.Task);

  const [Notification_Toast_Show, Set_Notification_Toast_Show] =
    useState(false);

  const [Notification_Data, Set_Notification_Data] = useState<{
    Heading: String;
    Body: String;
  }>({ Heading: "", Body: "" });

  //   console.log({ Selected_Template, Form_Field });
  console.log("render modal");

  const [Email_Sent_Status, Set_Email_Sent_Status] = useState("Not_Sent");

  //   useEffect(() => {
  //     if (Selected_Template) {
  //       set_Form_Field((state) => ({
  //         ...state,
  //         name: Selected_Template.name,

  //         subject: Selected_Template.subject,
  //       }));
  //       Set_Body(Selected_Template.body);
  //     }
  //   }, [Selected_Template]);

  const cancelButtonHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setModalFormVisible(false);
  };

  const templateFieldChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    set_Form_Field({ ...Form_Field, [name]: value });
  };

  const Select_Predefined_template = (template: {
    name: string;
    subject: string;
    body: string;
  }) => {
    set_Form_Field({
      ...Form_Field,
      subject: template.subject,
    });
    Set_Body(template.body);
  };
  console.log({ Form_Field });

  //   const FormSubmitHandler = async (
  //     event: React.ChangeEvent<HTMLFormElement>
  //   ) => {
  //     event.preventDefault();
  //     if (Selected_Template) {
  //       try {
  //         const data: Email_Template_Type = {
  //           name: Form_Field.name,
  //           body: Body,
  //           subject: Form_Field.subject,
  //           _id: Selected_Template._id,
  //           author_Id: Selected_Template.author_Id,
  //           project_Id: Selected_Template.project_Id,
  //           category_Id: Selected_Template.category_Id,
  //         };
  //         const { Status, Response_Data } = await Update_Template(data);
  //         console.log({ Status, Response_Data });
  //         if (Status === "Success") {
  //           Dispatch(
  //             Create_Action(Template_Action_Type.Update_Template, Response_Data)
  //           );

  //           setModalFormVisible(false);
  //         } else if (Status == "Database_Error") {
  //           Set_Notification_Data({
  //             Heading: "Error while updating data",
  //             Body: "Template data is not updated try again!",
  //           });
  //           Set_Notification_Toast_Show(true);
  //         } else {
  //           console.log("Aaya");
  //           Set_Notification_Data({
  //             Heading: "Error in network",
  //             Body: " try again!",
  //           });
  //           Set_Notification_Toast_Show(true);
  //         }
  //       } catch (err) {}
  //     } else if (Selected_Category && Selected_Category._id) {
  //       try {
  //         const data: Email_Template_Type = {
  //           name: Form_Field.name,
  //           body: Body,
  //           subject: Form_Field.subject,
  //           author_Id: Selected_Category.author_Id,
  //           project_Id: Selected_Category.project_Id,
  //           category_Id: Selected_Category._id,
  //         };
  //         const { Status, Response_Data } = await Create_Template(data);
  //         console.log({ Status, Response_Data });
  //         if (Status === "Success") {
  //           Dispatch(
  //             Create_Action(Template_Action_Type.Add_Template, Response_Data)
  //           );

  //           setModalFormVisible(false);
  //         } else if (Status == "Database_Error") {
  //           Set_Notification_Data({
  //             Heading: "Error while creating data",
  //             Body: "Template data is not created try again!",
  //           });
  //           Set_Notification_Toast_Show(true);
  //         } else {
  //           Set_Notification_Data({
  //             Heading: "Error in network",
  //             Body: " try again!",
  //           });
  //           Set_Notification_Toast_Show(true);
  //         }
  //       } catch (err) {
  //         Set_Notification_Data({
  //           Heading: "Error in app",
  //           Body: " try again!",
  //         });
  //         Set_Notification_Toast_Show(true);
  //       }
  //     }
  //   };

  const [selectedInputBox, SetSelectInputBox] = useState<string>("subject");

  const onSelectHandler = (event: any, name: string) => {
    console.log(name);
    SetSelectInputBox(name);
  };

  const ChangeBodyHandler = (content: string) => {
    Set_Body(content);
    console.log(content);
    // Set_Body(content);
  };

  // console.log(Form_Field.body);

  const updateTaskStatus = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    status: string
  ) => {
    if (Selected_Task) {
      const updatedTask = { ...Selected_Task, status: status };
      const { Status, Response_Data } = await Update_Task(updatedTask);
      console.log({ Status, Response_Data });
      if (Status === "Success") {
        Dispatch(Create_Action(Task_Action_Type.Update_Task, updatedTask));
      } else if (Status == "Database_Error") {
        Set_Notification_Data({
          Heading: "Error while updating data",
          Body: "Template data is not updated try again!",
        });
        Set_Notification_Toast_Show(true);
      } else {
        console.log("Aaya");
        Set_Notification_Data({
          Heading: "Error in network",
          Body: " try again!",
        });
        Set_Notification_Toast_Show(true);
      }
    }
  };

  const InsertTemplateHandler = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    text: string
  ) => {
    event.preventDefault();
    if (selectedInputBox === "body") {
      // console.log(Form_Field["body"]);
      console.log("text");
      let new_value = Body;

      if (new_value === "<p><br></p>") {
        new_value = text;
      } else {
        new_value =
          new_value.slice(0, new_value.length - 4) +
          text +
          new_value.slice(new_value.length - 4);
      }
      console.log(new_value);
      // set_Form_Field({ ...Form_Field, [selectedInputBox]: new_value });
      Set_Body(new_value);
    } else {
      const new_value = Form_Field["subject"] + text;
      set_Form_Field({ ...Form_Field, [selectedInputBox]: new_value });
    }

    console.log({ Form_Field });
  };

  const [Current_Theme, Set_Theme] = useState("Light");

  return (
    <Fragment>
      <div
        className={
          " tw-shadow-xl tw-rounded-md tw-space-y-4 md:tw-w-full tw-h-screen tw-flex tw-flex-col tw-border-2 tw-border-black tw-space-y-2 " +
          (Current_Theme === "Dark" ? " tw-bg-gray-800" : " tw-bg-white")
        }
      >
        <div className="tw-border-b-2  tw-pt-2 tw-bg-gray-900 tw-flex tw-px-2">
          <CloseButton
            onClick={() => setModalFormVisible(false)}
            className={
              "tw-ml-2 tw-invert" + (Current_Theme === "Dark" ? "" : "")
            }
          />
          <h1
            className={
              "tw-text-3xl tw-text-center tw-w-full tw-text-white " +
              (Current_Theme === "Dark" ? "" : "")
            }
          >
            {Selected_Task?.name || "Create template"}
          </h1>
        </div>
        <div className="tw-mx-2">
          {/* <div className="tw-flex tw-items-center">
            <h1 className="tw-text-2xl">{Selected_Task?.name}</h1>
          </div> */}
          <div className="tw-flex tw-items-center  tw-shadow-inner">
            <h1 className="tw-text-2xl tw-w-56 hover:tw-bg-gray-200 tw-p-2">
              {"Status  "}
            </h1>
            <h1 className="tw-text-xl tw-flex-grow hover:tw-bg-gray-200 tw-p-2">
              <DropdownButton
                id="dropdown-basic-button"
                title={<span>{Selected_Task?.status}</span>}
              >
                <Dropdown.Item
                  onClick={(event) => updateTaskStatus(event, Task_Status.ToDo)}
                >
                  {Task_Status.ToDo}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(event) =>
                    updateTaskStatus(event, Task_Status.InProgress)
                  }
                >
                  {Task_Status.InProgress}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(event) =>
                    updateTaskStatus(event, Task_Status.Completed)
                  }
                >
                  {Task_Status.Completed}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(event) =>
                    updateTaskStatus(event, Task_Status.InReview)
                  }
                >
                  {Task_Status.InReview}
                </Dropdown.Item>
              </DropdownButton>
            </h1>
          </div>
          <div className="tw-flex tw-items-center  tw-shadow-inner">
            <h1 className="tw-text-2xl tw-w-56 hover:tw-bg-gray-200 tw-p-2">
              {"Description "}
            </h1>
            <h1 className="tw-text-xl tw-flex-grow hover:tw-bg-gray-200 tw-p-2">
              {Selected_Task?.description}
            </h1>
          </div>
          <div className="tw-flex tw-items-center  tw-shadow-inner">
            <h1 className="tw-text-2xl tw-w-56 hover:tw-bg-gray-200 tw-p-2">
              {"Created At "}
            </h1>
            <h1 className="tw-text-xl tw-flex-grow hover:tw-bg-gray-200 tw-p-2">
              {Selected_Task?.created_At}
            </h1>
          </div>
          <div className="tw-flex tw-items-center  tw-shadow-inner">
            <h1 className="tw-text-2xl tw-w-56 hover:tw-bg-gray-200 tw-p-2">
              {"Modified At "}
            </h1>
            <h1 className="tw-text-xl tw-flex-grow hover:tw-bg-gray-200 tw-p-2">
              {Selected_Task?.updated_At}
            </h1>
          </div>
        </div>
      </div>

      {Notification_Toast_Show && (
        <div className="">
          <div className=" tw-absolute tw-top-0 tw-right-0 z-50">
            <Notification_Toast
              Data={Notification_Data}
              Set_Notification_Toast_Show={Set_Notification_Toast_Show}
              Notification_Toast_Show={Notification_Toast_Show}
            ></Notification_Toast>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Sidebar_Preview;
