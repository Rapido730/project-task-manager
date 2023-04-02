import React, { useState, useEffect, Fragment } from "react";
import { Project_Type } from "@/DB/models/Project.Model";
import { Project_Action_Type } from "@/Store/Project/Project.Types";
import Project_Preview from "./project_preview.component";
import {
  Button,
  Container,
  ListGroup,
  ListGroupItem,
  Dropdown,
  Offcanvas,
} from "react-bootstrap";

import { Delete_Project } from "@/Services/Project.Services";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Image from "next/image";
import DeleteIcon from "../assests/Delete.svg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Select_Current_User,
  Select_User_Data,
} from "@/Store/User/User.Selector";
import { State_Type } from "@/Store/Root_Reducer";
import { Read_Users } from "@/Services/User.Services";
import Create_Action from "@/Store/Action_Creator";
import { User_Action_Type } from "@/Store/User/User.Types";
import { Fetch_All_Projects_Admin } from "@/Services/Project.Services";
import { User_Type } from "@/DB/models/User.Model";
import { faL } from "@fortawesome/free-solid-svg-icons";
import Developer_Tasks from "./developer_task.component";
import Developer_Body from "./developer_body.component";
import { Update_User } from "@/Services/User.Services";

const Admin_Body = () => {
  // console.log({ body: selectedProject });
  const Dispatch = useDispatch();

  const Current_User = useSelector((State: State_Type) =>
    Select_Current_User(State)
  );
  const Selected_User = useSelector(
    (State: State_Type) => State.User.Selected_User
  );
  const Users = useSelector((State: State_Type) => Select_User_Data(State));
  const [ShowUserCanvas, SetShowUserCanvas] = useState(false);
  const { Project_Data, Selected_Project } = useSelector(
    (state: State_Type) => state.Project
  );
  const [Projects, SetProjects] = useState<Project_Type[]>();
  const [ModalFormVisible, setModalFormVisible] = useState(false);
  const [Template_Preview, set_Template_Preview] = useState(false);

  const get_All_Users = async () => {
    if (Current_User) {
      const { Status, Response_Data } = await Read_Users(Current_User);

      if (Status === "Success") {
        Dispatch(Create_Action(User_Action_Type.Set_User_Data, Response_Data));
      }
    }
  };

  const get_All_Projects = async () => {
    if (Current_User) {
      const { Status, Response_Data } = await Fetch_All_Projects_Admin(
        Current_User
      );

      if (Status === "Success") {
        // console.log(response.data.Projects);
        Dispatch({ type: "Set_Project_Data", payload: Response_Data });
        // set_Project_data(response.data.Projects); //  getting error Cannot update a component (`Header`) while rendering a different component (`He`). To locate the bad setState() call inside `He`
      } else {
        alert("users not fetch try again");
      }
    }
  };

  const SelectProjectHandler = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<Element, MouseEvent>,
    project: Project_Type | null
  ) => {
    event.preventDefault();
    Dispatch(Create_Action(Project_Action_Type.Select_Project, project));
  };

  const SelectUserHandler = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<Element, MouseEvent>,
    User: User_Type | null
  ) => {
    event.preventDefault();
    Dispatch(Create_Action(Project_Action_Type.Select_Project, null));
    Dispatch(Create_Action(User_Action_Type.Select_User, User));
  };
  useEffect(() => {
    get_All_Users();
    get_All_Projects();
  }, []);
  const DeleteProjectHandler = async (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
    project: Project_Type
  ) => {
    event.preventDefault();
    await Delete_Project(project);
    Dispatch(Create_Action(Project_Action_Type.Delete_Project, project));
  };
  useEffect(() => {
    if (Selected_User) {
      const filteredProject = Project_Data.filter(
        (project) => project.manager_Id === Selected_User?._id
      );
      SetProjects(filteredProject);
    } else {
      SetProjects(Project_Data);
    }
  }, [Project_Data, Selected_User]);

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

  const [showOffCanvas, setShowOffCanvas] = useState(false);

  const handleCloseOffCanvas = () => setShowOffCanvas(false);
  const handleShowOffCanvas = () => setShowOffCanvas(true);

  return (
    <Fragment>
      <div className="tw-flex tw-flex-row tw-h-full">
        <div className="tw-w-96 tw-p-1 tw-flex tw-flex-col tw-bg-gray-300 tw-h-full tw-overflow-auto">
          <div className="">
            <Accordion defaultActiveKey="1">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Users</Accordion.Header>
                <Accordion.Body>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Managers</Accordion.Header>
                      <Accordion.Body>
                        {Users.filter((user) => user.role === "manager").map(
                          (user) => (
                            <h1
                              key={user.email}
                              className="tw-overflow-auto tw-cursor-pointer tw-text-xl"
                              onClick={(event) =>
                                SelectUserHandler(event, user)
                              }
                            >
                              {user.email}
                            </h1>
                          )
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Developers</Accordion.Header>
                      <Accordion.Body>
                        {Users.filter((user) => user.role === "developer").map(
                          (user) => (
                            <h1
                              key={user.email}
                              // action
                              // variant="light"
                              className="tw-overflow-auto tw-cursor-pointer tw-text-xl"
                              onClick={(event) =>
                                SelectUserHandler(event, user)
                              }
                            >
                              {user.email}
                            </h1>
                          )
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item
                eventKey="1"
                onClick={() => {
                  console.log("open projets");
                  Dispatch(Create_Action(User_Action_Type.Select_User, null));
                  get_All_Projects();
                }}
              >
                <Accordion.Header>Projects</Accordion.Header>
                <Accordion.Body>
                  <ListGroup>
                    <ListGroup.Item
                      key={"8465213896"}
                      action
                      variant="light"
                      className="tw-overflow-auto"
                      onClick={(event) => {
                        SelectProjectHandler(event, null);
                        SelectUserHandler(event, null);
                      }}
                    >
                      {"Show All"}
                    </ListGroup.Item>
                    {Projects &&
                      Project_Data.map((project) => (
                        <ListGroup.Item
                          key={project.name}
                          action
                          variant="light"
                          className="tw-overflow-auto"
                          onClick={(event) =>
                            SelectProjectHandler(event, project)
                          }
                        >
                          {project.name}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
        <div className="tw-flex">
          {Selected_Project ? (
            <Project_Preview />
          ) : Selected_User?.role !== "developer" ? (
            <div className="tw-grid tw-shadow-inner tw-mx-auto tw-ml-12 tw-p-5 tw-grid-cols-3 tw-gap-12">
              {Selected_User && (
                <Button
                  variant="dark"
                  style={{ width: "18rem", height: "14rem" }}
                  onClick={() => SetShowUserCanvas(true)}
                  className="me-2"
                >
                  {"Profile"}
                </Button>
              )}
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
                          src={DeleteIcon}
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
          ) : (
            <div>
              <Developer_Body />
            </div>
          )}
        </div>
      </div>

      {ShowUserCanvas && (
        <div>
          <Offcanvas
            show={ShowUserCanvas}
            onHide={() => SetShowUserCanvas(false)}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>{Selected_User?.name}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="tw-flex tw-items-center">
                <h1 className="tw-text-2xl tw-p-2">Role</h1>
                <h1 className="tw-text-2xl tw-p-2">{Selected_User?.role}</h1>
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    <span className="tw-text-xl">{Selected_User?.role}</span>
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
                        onClick={(event) => OnRoleUpdate(event, "developer")}
                      >
                        Developer
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      )}
    </Fragment>
  );
};

export default Admin_Body;

//  <div className="tw-grid tw-grid-cols-3 tw-gap-12 mx-auto">
//    {Project_Data.map((project) => (
//      <div>
//        <Card style={{ width: "18rem" }}>
//          {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
//          <Card.Body>
//            <Card.Title>{project.name}</Card.Title>
//            <Card.Text>{"get there"}</Card.Text>
//            <Button variant="primary">Go somewhere</Button>
//          </Card.Body>
//        </Card>
//      </div>
//    ))}
//  </div>;
