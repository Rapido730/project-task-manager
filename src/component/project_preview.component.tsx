import { Fetch_All_Task } from "@/Services/Task.Services";
import { State_Type } from "@/Store/Root_Reducer";
import React, { Fragment, useEffect, useState } from "react";
import { Update_Task } from "@/Services/Task.Services";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import Notification_Toast from "./notification_toast.component";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import Create_Action from "@/Store/Action_Creator";
import { Task_Action_Type } from "@/Store/Task/Task.Types";
import { Task_Type } from "@/DB/models/Task.Model";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import Add_Task_Modal_Form from "./add_task_modal.component";
import Sidebar_Preview from "./sidebar.component";
import Delete_Icon from "../assests/Delete.svg";
import Add_Icon from "../assests/Add.svg";
import { Task_Delete } from "@/Services/Task.Services";
import Image from "next/image";
import { Select_Current_User } from "@/Store/User/User.Selector";
export const Task_Status = {
  ToDo: "ToDo",
  ReworkRequired: "ReworkRequired",
  InReview: "InReview",
  InProgress: "InProgress",
  Completed: "Completed",
};

type Task_List_Type = {
  todo: Task_Type[];
  completed: Task_Type[];
  review: Task_Type[];
  inProgress: Task_Type[];
};

const Project_Preview = () => {
  const Dispatch = useDispatch();
  console.log("aaya");
  const { Selected_Project } = useSelector(
    (State: State_Type) => State.Project
  );
  const [Tasks, Set_Tasks] = useState<Task_List_Type>({
    todo: [],
    completed: [],
    review: [],
    inProgress: [],
  });

  const Current_User = useSelector((State: State_Type) =>
    Select_Current_User(State)
  );
  const Task_Data = useSelector((state: State_Type) => state.Task.Task_Data);
  console.log({ Task_Data });
  const [ModalFormVisible, SetModalFormVisible] = useState(false);
  const [Notification_Data, Set_Notification_Data] = useState({
    Heading: "",
    Body: "",
  });

  useEffect(() => {
    console.log({ Task_Data });
    console.log("aaya");
    const todo_list = Task_Data.filter(
      (task) => task.status === Task_Status.ToDo
    );
    const completed = Task_Data.filter(
      (task) => task.status === Task_Status.Completed
    );
    const review = Task_Data.filter(
      (task) => task.status === Task_Status.InReview
    );
    const inProgress = Task_Data.filter(
      (task) => task.status === Task_Status.InProgress
    );
    const updated_Task = {
      todo: todo_list,
      completed,
      inProgress,
      review,
    };
    Set_Tasks(updated_Task);
  }, [Task_Data]);

  const [Task_Preview, Set_Task_Preview] = useState(false);

  console.log({ Tasks });

  const [Notification_Toast_Show, Set_Notification_Toast_Show] =
    useState(false);
  const get_all_tasks = async () => {
    console.log({ Selected_Project });
    if (Selected_Project && Selected_Project._id) {
      try {
        const { Status, Response_Data } = await Fetch_All_Task(
          Selected_Project
        );
        if (Status === "Success") {
          Dispatch(
            Create_Action(Task_Action_Type.Set_Task_Data, Response_Data)
          );
        } else if (Status == "Database_Error") {
          Set_Notification_Data({
            Heading: "Error while fetching data",
            Body: "Task data is not fetched, try again!",
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

  const Task_Select_Handler = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    task: Task_Type
  ) => {
    Dispatch(Create_Action(Task_Action_Type.Select_Task, task));
    Set_Task_Preview(true);
  };

  useEffect(() => {
    get_all_tasks();
  }, [Selected_Project]);

  const updateTaskStatus = async (task: Task_Type) => {
    const updatedTask = task;
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
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let add: Task_Type;
    let todo = Tasks.todo;
    let completed = Tasks.completed;
    let progress = Tasks.inProgress;
    let review = Tasks.review;

    if (source.droppableId === Task_Status.ToDo) {
      add = todo[source.index];
      todo.splice(source.index, 1);
    } else if (source.droppableId === Task_Status.InReview) {
      add = review[source.index];
      review.splice(source.index, 1);
    } else if (source.droppableId === Task_Status.InProgress) {
      add = progress[source.index];
      progress.splice(source.index, 1);
    } else {
      add = completed[source.index];
      completed.splice(source.index, 1);
    }

    if (destination.droppableId === Task_Status.ToDo) {
      add.status = Task_Status.ToDo;
      updateTaskStatus(add);

      todo.splice(destination.index, 0, add);
    } else if (destination.droppableId === Task_Status.Completed) {
      add.status = Task_Status.Completed;
      updateTaskStatus(add);
      completed.splice(destination.index, 0, add);
    } else if (destination.droppableId === Task_Status.InProgress) {
      add.status = Task_Status.InProgress;
      updateTaskStatus(add);
      progress.splice(destination.index, 0, add);
    } else if (destination.droppableId === Task_Status.InReview) {
      add.status = Task_Status.InReview;
      updateTaskStatus(add);
      review.splice(destination.index, 0, add);
    }

    Set_Tasks({ todo, completed, review, inProgress: progress });
  };
  const DeleteTaskHandler = async (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
    task: Task_Type
  ) => {
    event.preventDefault();
    await Task_Delete(task);
    Dispatch(Create_Action(Task_Action_Type.Delete_Task, task));
  };

  return (
    <Fragment>
      <div className="absolute tw-flex tw-w-full tw-flex-col tw-mx-4 tw-space-y-2">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className=" tw-grid tw-grid-cols-4 tw-gap-64 tw-w-full tw-mt-8 lg:tw-gap-8 tw-mx-8 ">
            <Droppable droppableId={Task_Status.ToDo}>
              {(provided, snapshot) => (
                <div
                  className={`todolist tw-p-2 tw-w-64 md:tw-w-84 tw-bg-gray-100 tw-mb-2${
                    snapshot.isDraggingOver ? "dragactive" : ""
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="tw-text-2xl tw-flex tw-justify-between tw-border-b-4 tw-border-red-500">
                    <span>{"Todo"}</span>
                    <span>
                      <Image
                        height={25}
                        src={Add_Icon}
                        alt="add"
                        className="growable clickable"
                        onClick={() => SetModalFormVisible(true)}
                      ></Image>
                    </span>
                  </div>
                  {Tasks?.todo.map((task, index) => (
                    <Draggable
                      key={task.name}
                      draggableId={task.name}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          style={{ width: "18rem" }}
                          key={task.name}
                          className="text-center tw-opacity-90 tw-shadow-lg tw-my-4"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          onClick={(event) => Task_Select_Handler(event, task)}
                        >
                          <Card.Header>
                            <div className="tw-flex tw-justify-center">
                              <h1 className="tw-text-xl tw-font-bold">
                                {task.name}
                              </h1>
                              <Image
                                className="ms-auto growable tw-cursor-pointer"
                                src={Delete_Icon}
                                alt="img"
                                height={25}
                                onClick={(event) =>
                                  DeleteTaskHandler(event, task)
                                }
                                width={25}
                              />
                            </div>
                          </Card.Header>
                          <Card.Body>
                            {/* <Card.Title>{project.name}</Card.Title> */}
                            <Card.Text>{task.description}</Card.Text>
                            <Card.Text>
                              {"Status : "} {task.status}
                            </Card.Text>
                            <Button
                              variant="dark"
                              onClick={(event) =>
                                Task_Select_Handler(event, task)
                              }
                            >
                              open
                            </Button>
                          </Card.Body>
                          <Card.Footer className="text-muted">
                            Created on :{" "}
                            {task.created_At &&
                              task.created_At.toString().slice(0, 10)}
                          </Card.Footer>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId={Task_Status.InProgress}>
              {(provided, snapshot) => (
                <div
                  className={`todolist tw-p-2 tw-w-64 md:tw-w-84 tw-bg-blue-100 tw-mb-2 ${
                    snapshot.isDraggingOver ? "dragactive" : ""
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <span className="tw-text-2xl tw-align-center">
                    {"In Progress"}
                  </span>

                  {Tasks?.inProgress.map((task, index) => (
                    <Draggable
                      key={task.name}
                      draggableId={task.name}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          style={{ width: "18rem" }}
                          key={task.name}
                          className="text-center tw-opacity-90 tw-shadow-lg tw-my-4"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          onClick={(event) => Task_Select_Handler(event, task)}
                        >
                          <Card.Header>
                            <div className="tw-flex tw-justify-center">
                              <h1 className="tw-text-xl tw-font-bold">
                                {task.name}
                              </h1>
                              <Image
                                className="ms-auto growable tw-cursor-pointer"
                                src={Delete_Icon}
                                alt="img"
                                height={25}
                                onClick={(event) =>
                                  DeleteTaskHandler(event, task)
                                }
                                width={25}
                              />
                            </div>
                          </Card.Header>
                          <Card.Body>
                            {/* <Card.Title>{project.name}</Card.Title> */}
                            <Card.Text>{task.description}</Card.Text>
                            <Card.Text>
                              {"Status : "} {task.status}
                            </Card.Text>
                            <Button
                              variant="dark"
                              onClick={(event) =>
                                Task_Select_Handler(event, task)
                              }
                            >
                              open
                            </Button>
                          </Card.Body>
                          <Card.Footer className="text-muted">
                            Created on :{" "}
                            {task.created_At &&
                              task.created_At.toString().slice(0, 10)}
                          </Card.Footer>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId={Task_Status.InReview}>
              {(provided, snapshot) => (
                <div
                  className={`todolist tw-p-2 tw-w-64 md:tw-w-84 tw-bg-red-100 tw-mb-2 ${
                    snapshot.isDraggingOver ? "dragactive" : ""
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <span className="tw-text-2xl">In Review</span>
                  {Tasks?.review.map((task, index) => (
                    <Draggable
                      key={task.name}
                      draggableId={task.name}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          style={{ width: "18rem" }}
                          key={task.name}
                          className="text-center tw-shadow-lg tw-my-4"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          onClick={(event) => Task_Select_Handler(event, task)}
                        >
                          <Card.Header>
                            <div className="tw-flex tw-justify-center">
                              <h1 className="tw-text-xl tw-font-bold">
                                {task.name}
                              </h1>
                              <Image
                                className="ms-auto growable tw-cursor-pointer"
                                src={Delete_Icon}
                                alt="img"
                                height={25}
                                onClick={(event) =>
                                  DeleteTaskHandler(event, task)
                                }
                                width={25}
                              />
                            </div>
                          </Card.Header>
                          <Card.Body>
                            {/* <Card.Title>{project.name}</Card.Title> */}
                            <Card.Text>{task.description}</Card.Text>
                            <Card.Text>
                              {"Status : "} {task.status}
                            </Card.Text>
                            <Button
                              variant="dark"
                              onClick={(event) =>
                                Task_Select_Handler(event, task)
                              }
                            >
                              open
                            </Button>
                          </Card.Body>
                          <Card.Footer className="text-muted">
                            Created on :{" "}
                            {task.created_At &&
                              task.created_At.toString().slice(0, 10)}
                          </Card.Footer>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId={Task_Status.Completed}>
              {(provided, snapshot) => (
                <div
                  className={`todolist tw-p-2 tw-w-64 md:tw-w-84 tw-bg-green-100  tw-mb-2 ${
                    snapshot.isDraggingOver ? "dragactive" : ""
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <span className="tw-text-2xl">Completed</span>
                  {Tasks?.completed.map((task, index) => (
                    <Draggable
                      key={task.name}
                      draggableId={task.name}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          style={{ width: "18rem" }}
                          key={task.name}
                          className="text-center tw-shadow-lg tw-my-4"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          onClick={(event) => Task_Select_Handler(event, task)}
                        >
                          <Card.Header>
                            <div className="tw-flex tw-justify-center">
                              <h1 className="tw-text-xl tw-font-bold">
                                {task.name}
                              </h1>
                              <Image
                                className="ms-auto growable tw-cursor-pointer"
                                src={Delete_Icon}
                                alt="img"
                                height={25}
                                onClick={(event) =>
                                  DeleteTaskHandler(event, task)
                                }
                                width={25}
                              />
                            </div>
                          </Card.Header>
                          <Card.Body>
                            {/* <Card.Title>{project.name}</Card.Title> */}
                            <Card.Text>{task.description}</Card.Text>
                            <Card.Text>
                              {"Status : "} {task.status}
                            </Card.Text>
                            <Button
                              variant="dark"
                              onClick={(event) =>
                                Task_Select_Handler(event, task)
                              }
                            >
                              open
                            </Button>
                          </Card.Body>
                          <Card.Footer className="text-muted">
                            Created on :{" "}
                            {task.created_At &&
                              task.created_At.toString().slice(0, 10)}
                          </Card.Footer>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
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

      <Sidebar_Preview
        setModalFormVisible={Set_Task_Preview}
        Template_Preview={Task_Preview}
      />

      {ModalFormVisible && (
        <Add_Task_Modal_Form
          ModalFormVisible={ModalFormVisible}
          setModalFormVisible={SetModalFormVisible}
        />
      )}
    </Fragment>
  );
};

export default Project_Preview;
