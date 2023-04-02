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
import { Read_User_By_ID } from "@/Services/User.Services";

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
  const [Assigned_to, Set_Assigned_To] = useState("");

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

  const [selectedInputBox, SetSelectInputBox] = useState<string>("subject");

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
                variant="dark"
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
              {"Assigned To "}
            </h1>
            <h1 className="tw-text-xl tw-flex-grow hover:tw-bg-gray-200 tw-p-2">
              {Selected_Task?.worker_Id}
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
              {"Created On "}
            </h1>
            <h1 className="tw-text-xl tw-flex-grow hover:tw-bg-gray-200 tw-p-2">
              {Selected_Task &&
                Selected_Task.created_At.toString().slice(0, 10)}
            </h1>
          </div>
          <div className="tw-flex tw-items-center  tw-shadow-inner">
            <h1 className="tw-text-2xl tw-w-56 hover:tw-bg-gray-200 tw-p-2">
              {"Modified On "}
            </h1>
            <h1 className="tw-text-xl tw-flex-grow hover:tw-bg-gray-200 tw-p-2">
              {Selected_Task &&
                Selected_Task.updated_At.toString().slice(0, 10)}
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
