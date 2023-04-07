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
import Image from "next/image";
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
import SaveICon from "../assests/Save.svg";
import EditICon from "../assests/Edit.svg";
import CancelIcon from "../assests/Cancel.svg";
import { Task_Type } from "@/DB/models/Task.Model";

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

  const { Selected_Task } = useSelector((State: State_Type) => State.Task);
  const { Task_Data } = useSelector((State: State_Type) => State.Task);
  const { User_Data } = useSelector((State: State_Type) => State.User);

  //   console.log({ Selected_Template, Form_Field });
  console.log("render modal");
  const [Name_Error_Notification, Set_Name_Error_Notification] = useState({
    IsOpen: false,
    text: "",
  });
  const [Worker_Error_Notification, Set_Worker_Error_Notification] = useState({
    IsOpen: false,
    text: "",
  });

  const cancelButtonHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setModalFormVisible(false);
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
        // Set_Notification_Data({
        //   Heading: "Error while updating data",
        //   Body: "Template data is not updated try again!",
        // });
        // Set_Notification_Toast_Show(true);
      } else {
        // console.log("Aaya");
        // Set_Notification_Data({
        //   Heading: "Error in network",
        //   Body: " try again!",
        // });
        // Set_Notification_Toast_Show(true);
      }
    }
  };

  const [Edit_Field, Set_Edit_Field] = useState({
    Assign_data: "",
    Is_Assign_Edit: false,
    Task_name: "",
    Is_Name_Edit: false,
  });

  const transition = useTransition(Template_Preview, {
    from: { opacity: 1, width: 700 },
    enter: { opacity: 1, width: 1600 },
    leave: { opacity: 0, width: 700 },
  });

  const FormSubmitHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (Selected_Task && Selected_Task._id) {
      try {
        const data: Task_Type = {
          ...Selected_Task,
          worker_Id: Edit_Field.Assign_data,
          name: Edit_Field.Task_name,
        };
        console.log({ data });
        const res = Task_Data.filter(
          (task) => task._id !== Selected_Task._id
        ).reduce((res, task) => {
          if (task.name === data.name) {
            return res || true;
          }
          return res || false;
        }, false);

        if (res) {
          Set_Name_Error_Notification({
            IsOpen: true,
            text: "Task name already exists!",
          });
          setTimeout(() => {
            Set_Name_Error_Notification({
              IsOpen: false,
              text: "",
            });
          }, 3000);
          return;
        }

        const res1 = User_Data.reduce((res, user) => {
          if (user.email === data.worker_Id && user.role === "developer") {
            return res || true;
          }

          return res || false;
        }, false);

        if (!res1) {
          Set_Worker_Error_Notification({
            IsOpen: true,
            text: "Entered user is not a developer",
          });
          setTimeout(() => {
            Set_Worker_Error_Notification({
              IsOpen: false,
              text: "",
            });
          }, 3000);
          return;
        }
        console.log("Ruko")
        const { Status, Response_Data } = await Update_Task(data);
        console.log({ Status, Response_Data });
        if (Status === "Success" && Response_Data) {
          Dispatch(Create_Action(Task_Action_Type.Update_Task, Response_Data));
          Set_Edit_Field({
            ...Edit_Field,
            Is_Assign_Edit: false,
            Is_Name_Edit: false,
          });
        } else if (Status == "Database_Error") {
        } else if (Status === "Worker not found!") {
          Set_Worker_Error_Notification({
            IsOpen: true,
            text: "developer name doesn't exists!",
          });
          setTimeout(() => {
            Set_Worker_Error_Notification({
              IsOpen: false,
              text: "",
            });
          }, 3000);
          return;
        } else {
          Set_Worker_Error_Notification({
            IsOpen: true,
            text: "developer name doesn't exists!",
          });
          setTimeout(() => {
            Set_Worker_Error_Notification({
              IsOpen: false,
              text: "",
            });
          }, 3000);

          return;
        }
      } catch (err) {
        // Set_Notification_Data({
        //   Heading: "Error in app",
        //   Body: " try again!",
        // });
        // Set_Notification_Toast_Show(true);
      }
    }
    // console.log(response);
  };

  console.log({ Edit_Field });
  const [Current_Theme, Set_Theme] = useState("Light");

  const OnEditFieldChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const { name, value } = event.target;
    if (name === "Assign") {
      Set_Edit_Field({
        ...Edit_Field,
        Assign_data: value,
      });
    }
    if (name === "name") {
      Set_Edit_Field({
        ...Edit_Field,
        Task_name: value,
      });
    }
  };

  useEffect(() => {
    if (Selected_Task) {
      Set_Edit_Field({
        ...Edit_Field,
        Assign_data: Selected_Task?.worker_Id,
        Task_name: Selected_Task.name,
        Is_Name_Edit: false,
        Is_Assign_Edit: false,
      });
    }
  }, [Selected_Task]);

  // if (!Template_Preview) {
  //   return null;
  // }

  return (
    <Fragment>
      {transition((style, item) =>
        item ? (
          <animated.div
            style={{ ...style, position: "fixed" }}
            className="tw-absolute tw-backdrop tw-top-0 tw-right-0 tw-justify-end tw-flex tw-h-full tw-max-w-[400px] sm:tw-max-w-full tw-w-full md:tw-w-6/12"
          >
            <div
              onClick={() => {
                setModalFormVisible(false);
              }}
              className="tw-w-6/12 tw-backdrop-blur-sm"
            ></div>
            <div className="tw-h-full tw-w-full md:tw-w-6/12">
              <div
                className={
                  " tw-shadow-xl tw-rounded-md tw-space-y-4 md:tw-w-full tw-h-screen tw-flex tw-flex-col tw-border-2 tw-border-black tw-space-y-2 " +
                  (Current_Theme === "Dark"
                    ? " tw-bg-gray-800"
                    : " tw-bg-white")
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
                    {Selected_Task?.name}
                  </h1>
                </div>
                <div className="tw-mx-2">
                  <div className="tw-flex tw-items-center  tw-shadow-inner">
                    <h1 className="tw-text-2xl tw-w-56 hover:tw-bg-gray-200 tw-p-2">
                      {"Name "}
                    </h1>
                    {!Edit_Field.Is_Name_Edit ? (
                      <h1
                        className="tw-text-xl tw-flex-grow hover:tw-bg-gray-200 tw-p-2"
                        onClick={() => {
                          Set_Edit_Field({
                            ...Edit_Field,
                            Is_Name_Edit: true,
                          });
                        }}
                      >
                        {Selected_Task?.name}
                      </h1>
                    ) : (
                      <form className="tw-flex-grow tw-flex tw-space-x-6 tw-pt-2">
                        <div className="tw-w-8/12 tw-flex tw-flex-col ">
                          <input
                            name="name"
                            className=""
                            value={Edit_Field.Task_name}
                            onChange={OnEditFieldChangeHandler}
                          />

                          <Form.Text className="text-muted">
                            <span className="tw-mx-2 tw-text-red-500">
                              {Name_Error_Notification.text}
                            </span>
                          </Form.Text>
                        </div>
                      </form>
                    )}
                  </div>
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
                          onClick={(event) =>
                            updateTaskStatus(event, Task_Status.ToDo)
                          }
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
                    {!Edit_Field.Is_Assign_Edit ? (
                      <h1
                        className="tw-text-xl tw-flex-grow hover:tw-bg-gray-200 tw-p-2"
                        onClick={() => {
                          Set_Edit_Field({
                            ...Edit_Field,
                            Is_Assign_Edit: true,
                          });
                        }}
                      >
                        {Selected_Task?.worker_Id}
                      </h1>
                    ) : (
                      <form className="tw-flex-grow tw-flex tw-space-x-6 tw-pt-2">
                        <div className="tw-w-8/12 tw-flex tw-flex-col ">
                          <input
                            name="Assign"
                            className=""
                            value={Edit_Field.Assign_data}
                            onChange={OnEditFieldChangeHandler}
                          />

                          {Worker_Error_Notification.IsOpen && (
                            <Form.Text className="text-muted">
                              <span className="tw-mx-2 tw-text-red-500">
                                {Worker_Error_Notification.text}
                              </span>
                            </Form.Text>
                          )}
                        </div>
                      </form>
                    )}
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
                <Button
                  variant="dark"
                  className="tw-w-2/12 tw-mx-4"
                  onClick={FormSubmitHandler}
                >
                  Save
                </Button>
              </div>
            </div>
          </animated.div>
        ) : (
          ""
        )
      )}
    </Fragment>
  );
}

export default Sidebar_Preview;
