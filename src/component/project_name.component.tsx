import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { State_Type } from "@/Store/Root_Reducer";
import EditICon from "../assests/Edit.svg";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import SaveICon from "../assests/Save.svg";
import { Project_Type } from "@/DB/models/Project.Model";
import { Update_Project } from "@/Services/Project.Services";
import { Project_Action_Type } from "@/Store/Project/Project.Types";
import { useDispatch } from "react-redux";
import Create_Action from "@/Store/Action_Creator";

const Project_Name = () => {
  const Dispatch = useDispatch();
  const { Selected_Project, Project_Data } = useSelector(
    (State: State_Type) => State.Project
  );
  const { Current_User } = useSelector((State: State_Type) => State.User);

  const [Is_Edit, Set_Edit] = useState(false);
  const [Form_Field, Set_Form_Field] = useState(
    Selected_Project?.name || "Project"
  );
  const [Name_Error_Notification, Set_Name_Error_Notification] = useState({
    IsOpen: false,
    text: "",
  });

  useEffect(() => {
    if (Selected_Project) {
      Set_Form_Field(Selected_Project?.name);
    }
  }, [Selected_Project]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;

    Set_Form_Field(value);
  };

  const FormSubmitHandler = async (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (Selected_Project && Selected_Project._id) {
      try {
        const data: Project_Type = {
          ...Selected_Project,
          name: Form_Field,
        };
        // console.log({ data });

        const res = Project_Data.filter(
          (project) => project._id !== Selected_Project._id
        ).reduce((res, project) => {
          if (project.name === data.name) {
            return res || true;
          }
          return res || false;
        }, false);

        if (res) {
          Set_Name_Error_Notification({
            IsOpen: true,
            text: "Project name already exists!",
          });
          setTimeout(() => {
            Set_Name_Error_Notification({
              IsOpen: false,
              text: "",
            });
          }, 3000);
          return;
        }

        const { Status, Response_Data } = await Update_Project(data);
        console.log({ Status, Response_Data });
        if (Status === "Success" && Response_Data) {
          Dispatch(
            Create_Action(Project_Action_Type.Update_Project, Response_Data)
          );
          Set_Edit(false);
        } else if (Status == "Database_Error") {
          Set_Name_Error_Notification({
            IsOpen: true,
            text: "Error in Server!",
          });
          setTimeout(() => {
            Set_Name_Error_Notification({
              IsOpen: false,
              text: "",
            });
          }, 3000);
        } else if (Status === "Worker not found!") {
          return;
        } else {
          return;
        }
      } catch (err) {}
    }
    // console.log(response);
  };

  return (
    <div className="tw-mx-auto tw-w-fit tw-rounded-md tw-flex tw-my-1 tw-bg-gradient-to-tl tw-from-gray-900 tw-via-slate-700 tw-to-gray-900 tw-px-2 tw-text-white">
      {!Is_Edit ? (
        <div className="tw-flex tw-space-x-4">
          <h1 className="tw-text-3xl">{Selected_Project?.name}</h1>
          {Current_User?.role !== "developer" && (
            <Image
              height={25}
              className="tw-invert clickable growable tw-mt-1"
              src={EditICon}
              onClick={() => {
                Set_Edit(true);
              }}
              alt="edit"
            ></Image>
          )}
        </div>
      ) : (
        <div className="tw-mt-1">
          <Form className=" tw-flex tw-space-x-4">
            <Form.Group
              className="mb-3 tw-flex tw-flex-col  "
              controlId="exampleForm.ControlInput1"
            >
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={Form_Field}
                onChange={onChangeHandler}
              />
              {Name_Error_Notification.IsOpen && (
                <Form.Text className="text-muted">
                  <span className="tw-mx-2 tw-text-red-500">
                    {Name_Error_Notification.text}
                  </span>
                </Form.Text>
              )}
            </Form.Group>
            <Image
              src={SaveICon}
              height={30}
              alt="save"
              className="tw-invert clickable growable tw-mt-1"
              onClick={FormSubmitHandler}
            ></Image>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Project_Name;
