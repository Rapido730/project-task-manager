import React, { Fragment, useEffect, useState } from "react";
import { Fetch_All_Projects } from "@/Services/Project.Services";
import { Select_Current_User } from "@/Store/User/User.Selector";
import { useDispatch, useSelector } from "react-redux";
import { State_Type } from "@/Store/Root_Reducer";
import { CloseButton } from "react-bootstrap";
import Add_Project_Modal_Form from "./add_project_modal.component";
import { Project_Action_Type } from "@/Store/Project/Project.Types";
import Notification_Toast from "./notification_toast.component";
import Create_Action from "@/Store/Action_Creator";
import { Project_Type } from "@/DB/models/Project.Model";
import { Button, Card, ListGroup, Dropdown, Offcanvas } from "react-bootstrap";
import Project_Preview from "./project_preview.component";
import Delete_Icon from "../assests/Delete.svg";
import Image from "next/image";
import { Delete_Project } from "@/Services/Project.Services";
import { animated, useTransition } from "@react-spring/web";
import { Update_User } from "@/Services/User.Services";
import { User_Action_Type } from "@/Store/User/User.Types";
import { Read_Users } from "@/Services/User.Services";

type props = {
  Parent_Sidebar_State?: boolean;
};

const Manager_Body = ({ Parent_Sidebar_State }: props) => {
  const Dispatch = useDispatch();
  const { Current_User, Selected_User } = useSelector(
    (state: State_Type) => state.User
  );
  const { Project_Data, Selected_Project } = useSelector(
    (state: State_Type) => state.Project
  );
  const [Projects, SetProjects] = useState<Project_Type[]>();
  console.log(Selected_User);

  const [SideBar_State, Set_Sidebar] = useState(false);

  const [ModalFormVisible, SetModalFormVisible] = useState(false);
  const [Notification_Data, Set_Notification_Data] = useState({
    Heading: "",
    Body: "",
  });

  const [Notification_Toast_Show, Set_Notification_Toast_Show] =
    useState(false);

  const get_all_projects = async () => {
    if (Selected_User && Selected_User._id) {
      try {
        const { Status, Response_Data } = await Fetch_All_Projects(
          Selected_User
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

  const OnRoleUpdate = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    role: string
  ) => {
    console.log("aaya2");
    event.preventDefault();
    if (Selected_User) {
      Dispatch(
        Create_Action(User_Action_Type.Update_User, {
          ...Selected_User,
          role: role,
        })
      );

      await Update_User({ ...Selected_User, role: role });
    }
  };

  const [ShowUserCanvas, SetShowUserCanvas] = useState(false);

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

  const get_All_Users = async () => {
    if (Current_User) {
      const { Status, Response_Data } = await Read_Users(Current_User);

      if (Status === "Success") {
        Dispatch(Create_Action(User_Action_Type.Set_User_Data, Response_Data));
      }
    }
  };

  useEffect(() => {
    get_all_projects();
    get_All_Users();
  }, [Selected_User]);

  useEffect(() => {
    SetProjects(Project_Data);
  }, [Project_Data]);
  const transition = useTransition(SideBar_State, {
    from: { opacity: 1, width: 200 },
    enter: { opacity: 1, width: 500 },
    leave: { opacity: 1, width: 200 },
  });
  return (
    <Fragment>
      <div className="tw-flex tw-flex-col tw-h-full">
        <div className="tw-flex tw-h-full tw-w-full tw-justify-between">
          {Current_User?.role === "manager" &&
            transition((style, item) =>
              item ? (
                <animated.div style={{ ...style }} className="  tw-h-full ">
                  <div className="tw-p-1 tw-flex tw-flex-col tw-space-y-4 tw-h-full tw-bg-gray-300 ">
                    {SideBar_State ? (
                      <button
                        className=" tw-w-10 tw-bg-gradient-to-tl tw-from-gray-900 tw-via-slate-700 tw-to-gray-900"
                        onClick={() => {
                          Set_Sidebar(false);
                        }}
                      >
                        {">>>"}
                      </button>
                    ) : (
                      <div className="tw-h-8"></div>
                    )}

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
                            onClick={(event) =>
                              SelectProjectHandler(event, project)
                            }
                            action
                            variant="light"
                            key={project.name}
                          >
                            {project.name}
                          </ListGroup.Item>
                        ))}
                      <Button
                        variant="dark"
                        onClick={() => SetModalFormVisible(true)}
                      >
                        Add Project
                      </Button>
                    </ListGroup>
                  </div>
                </animated.div>
              ) : (
                ""
              )
            )}

          {!SideBar_State && Current_User?.role == "manager" && (
            <button
              className="tw-fixed tw-left-1 tw-mt-1  tw-bg-gradient-to-tl tw-from-gray-900 tw-via-slate-700 tw-to-gray-900"
              onClick={() => {
                Set_Sidebar(true);
              }}
            >
              {">>>"}
            </button>
          )}

          {Selected_Project ? (
            <Project_Preview />
          ) : (
            <div
              className={
                "tw-grid tw-w-full tw-m-2  tw-mt-4 tw-p-5 " +
                (Current_User?.role === "admin"
                  ? "self-end tw-ml-12 tw-gap-16 "
                  : "") +
                (SideBar_State || Parent_Sidebar_State
                  ? "tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8 "
                  : "tw-ml-12 tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-4 ")
              }
            >
              {Current_User?.role === "admin" && (
                <Button
                  variant="dark"
                  style={{ width: "18rem", height: "14rem" }}
                  onClick={() => SetShowUserCanvas(true)}
                  className="me-2 tw-flex tw-transition tw-duration-150 tw-ease-in-out hover:tw-scale-105"
                >
                  <h1 className="tw-text-xl"> {Selected_User?.name}</h1>

                  <h1 className="tw-text-xl"> {Selected_User?.role}</h1>
                </Button>
              )}
              {Projects &&
                Projects.map((project) => (
                  <Card
                    style={{ width: "18rem", height: "14rem" }}
                    key={project.name}
                    className="tw-transition tw-duration-150 tw-ease-in-out  text-center tw-shadow-lg hover:tw-scale-105"
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
      {ShowUserCanvas && (
        <div>
          <Offcanvas
            show={ShowUserCanvas}
            onHide={() => SetShowUserCanvas(false)}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Profile</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="tw-flex tw-flex-col ">
                <div className="tw-flex">
                  <h1 className="tw-text-xl tw-p-1 hover:tw-bg-gray-300">
                    Name :{" "}
                  </h1>
                  <h1 className="tw-text-xl tw-p-1 hover:tw-bg-gray-300">
                    {Selected_User?.name}{" "}
                  </h1>
                </div>
                <div className="tw-flex">
                  <h1 className="tw-text-xl tw-p-1 hover:tw-bg-gray-300">
                    Email :
                  </h1>
                  <h1 className="tw-text-xl tw-p-1 hover:tw-bg-gray-300">
                    {Selected_User?.email}{" "}
                  </h1>
                </div>
                <div className="tw-flex">
                  <h1 className="tw-text-xl tw-p-1 hover:tw-bg-gray-300">
                    Role :
                  </h1>
                  <h1 className="tw-text-xl tw-p-1 hover:tw-bg-gray-300">
                    <Dropdown>
                      <Dropdown.Toggle variant="dark" id="dropdown-basic">
                        <span className="tw-text-xl">
                          {Selected_User?.role}
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {Selected_User?.role === "developer" && (
                          <Dropdown.Item
                            onClick={(event) => OnRoleUpdate(event, "manager")}
                          >
                            Manager
                          </Dropdown.Item>
                        )}
                        {Selected_User?.role === "manager" && (
                          <Dropdown.Item
                            onClick={(event) =>
                              OnRoleUpdate(event, "developer")
                            }
                          >
                            Developer
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </h1>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      )}
    </Fragment>
  );
};

export default Manager_Body;
