import React, { Fragment, useEffect, useState } from "react";
import { Fetch_All_Projects } from "@/Services/Project.Services";
import { Select_Current_User } from "@/Store/User/User.Selector";
import { useDispatch, useSelector } from "react-redux";
import { State_Type } from "@/Store/Root_Reducer";
import { Button, Card, ListGroup } from "react-bootstrap";
import Add_Project_Modal_Form from "./add_project_modal.component";
import { Project_Action_Type } from "@/Store/Project/Project.Types";
import Notification_Toast from "./notification_toast.component";
import Create_Action from "@/Store/Action_Creator";
import { Project_Type } from "@/DB/models/Project.Model";
import Project_Preview from "./project_preview.component";
import Delete_Icon from "../assests/Delete.svg";
import Image from "next/image";
import { Delete_Project } from "@/Services/Project.Services";

const Manager_Body = () => {
  const Dispatch = useDispatch();
  const { Current_User } = useSelector((state: State_Type) => state.User);
  const { Project_Data, Selected_Project } = useSelector(
    (state: State_Type) => state.Project
  );
  const [Projects, SetProjects] = useState<Project_Type[]>();
  console.log(Current_User);

  const [ModalFormVisible, SetModalFormVisible] = useState(false);
  const [Notification_Data, Set_Notification_Data] = useState({
    Heading: "",
    Body: "",
  });

  const [Notification_Toast_Show, Set_Notification_Toast_Show] =
    useState(false);

  const get_all_projects = async () => {
    if (Current_User && Current_User._id) {
      try {
        const { Status, Response_Data } = await Fetch_All_Projects(
          Current_User
        );
        if (Status === "Success") {
          Dispatch(
            Create_Action(Project_Action_Type.Set_Project_Data, Response_Data)
          );
        } else if (Status == "Database_Error") {
          Set_Notification_Data({
            Heading: "Error while fetching data",
            Body: "Project data is not fetched, try again!",
          });
          Set_Notification_Toast_Show(true);
        } else {
          Set_Notification_Data({
            Heading: "Error in network",
            Body: " try again!",
          });
          Set_Notification_Toast_Show(true);
        }
      } catch (err) {
        Set_Notification_Data({
          Heading: "Error in app",
          Body: " try again!",
        });
        Set_Notification_Toast_Show(true);
      }
    }
  };

  const SelectProjectHandler = async (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<Element, MouseEvent>,
    project: Project_Type | null
  ) => {
    event.preventDefault();

    Dispatch(Create_Action(Project_Action_Type.Select_Project, project));
  };

  const DeleteProjectHandler = async (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
    project: Project_Type
  ) => {
    event.preventDefault();
    await Delete_Project(project);
    Dispatch(Create_Action(Project_Action_Type.Delete_Project, project));
  };

  useEffect(() => {
    get_all_projects();
  }, [Current_User]);

  useEffect(() => {
    SetProjects(Project_Data);
  }, [Project_Data]);

  return (
    <Fragment>
      <div className="tw-flex tw-flex-col tw-h-full">
        <div className="tw-flex tw-h-full  tw-justify-between">
          <div className="tw-w-96 tw-p-1 tw-flex tw-flex-col tw-bg-gray-300 tw-h-full tw-overflow-auto">
            <ListGroup>
              <ListGroup.Item
                onClick={(event) => SelectProjectHandler(event, null)}
                action
                variant="light"
                key={"864243"}
              >
                {"All projects"}
              </ListGroup.Item>
              {Projects &&
                Projects.map((project) => (
                  <ListGroup.Item
                    onClick={(event) => SelectProjectHandler(event, project)}
                    action
                    variant="light"
                    key={project.name}
                  >
                    {project.name}
                  </ListGroup.Item>
                ))}
              <Button variant="dark" onClick={() => SetModalFormVisible(true)}>
                Add Project
              </Button>
            </ListGroup>
          </div>
          {Selected_Project ? (
            <Project_Preview />
          ) : (
            <div className="tw-grid tw-shadow-inner tw-w-full tw-m-2 tw-p-5 tw-grid-cols-3 tw-gap-8">
              {Projects &&
                Projects.map((project) => (
                  <Card
                    style={{ width: "18rem", height: "14rem" }}
                    key={project.name}
                    className="text-center tw-shadow-lg"
                  >
                    <Card.Header>
                      <div className="tw-flex tw-justify-center">
                        <h1 className="tw-text-xl tw-font-bold">
                          {project.name}
                        </h1>
                        <Image
                          className="ms-auto growable tw-cursor-pointer"
                          src={Delete_Icon}
                          alt="img"
                          height={25}
                          onClick={(event) =>
                            DeleteProjectHandler(event, project)
                          }
                          width={25}
                        />
                      </div>
                    </Card.Header>
                    <Card.Body>
                      {/* <Card.Title>{project.name}</Card.Title> */}
                      <Card.Text>{project.description}</Card.Text>
                      <Button
                        variant="dark"
                        onClick={(event) =>
                          SelectProjectHandler(event, project)
                        }
                      >
                        more...
                      </Button>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                      Created on :{" "}
                      {project.created_At &&
                        project.created_At.toString().slice(0, 10)}
                    </Card.Footer>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>

      {ModalFormVisible && (
        <Add_Project_Modal_Form
          ModalFormVisible={ModalFormVisible}
          setModalFormVisible={SetModalFormVisible}
        />
      )}

      {Notification_Toast_Show && (
        <div className="">
          <div className=" tw-absolute tw-top-0 tw-right-0 z-40">
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
};

export default Manager_Body;
