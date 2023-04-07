import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  ReactComponentElement,
} from "react";
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
import { animated, useTransition } from "@react-spring/web";

import Notification_Toast from "./notification_toast.component";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { Task_Action_Type } from "@/Store/Task/Task.Types";
import { Update_Task } from "@/Services/Task.Services";
import { Task_Status } from "./project_preview.component";
import { Read_User_By_ID } from "@/Services/User.Services";
import { JsxElement } from "typescript";

interface Props {
  setModalFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  Template_Preview: boolean;
  Component: JsxElement;
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

function Left_Sidebar({
  setModalFormVisible,
  Component,
  Template_Preview,
}: Props) {
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
  const transition = useTransition(Template_Preview, {
    from: { opacity: 1, width: 700 },
    enter: { opacity: 1, width: 1600 },
    leave: { opacity: 1, width: 700 },
  });

  const [Current_Theme, Set_Theme] = useState("Light");

  if (!Template_Preview) {
    return null;
  }

  return (
    <Fragment>
      {transition((style, item) =>
        item ? (
          <animated.div
            style={{ ...style, position: "fixed" }}
            className="tw-absolute tw-top-0 tw-right-0 tw-justify-end tw-flex tw-h-full tw-w-full md:tw-w-6/12"
          ></animated.div>
        ) : (
          ""
        )
      )}
    </Fragment>
  );
}

export default Left_Sidebar;
