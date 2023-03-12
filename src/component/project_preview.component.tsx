import { Fetch_All_Task } from "@/Services/Task.Services";
import { State_Type } from "@/Store/Root_Reducer";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Notification_Toast from "./notification_toast.component";
import Create_Action from "@/Store/Action_Creator";
import { Task_Action_Type } from "@/Store/Task/Task.Types";
import { Task_Type } from "@/DB/models/Task.Model";
import { Card, Button } from "react-bootstrap";
import Add_Task_Modal_Form from "./add_task_modal.component";
const Project_Preview = () => {
  const Dispatch = useDispatch();

  const { Selected_Project } = useSelector(
    (State: State_Type) => State.Project
  );
  const [Tasks, Set_Tasks] = useState<Task_Type[]>();
  const { Task_Data } = useSelector((state: State_Type) => state.Task);
  const [ModalFormVisible, SetModalFormVisible] = useState(false);
  const [Notification_Data, Set_Notification_Data] = useState({
    Heading: "",
    Body: "",
  });

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

  useEffect(() => {
    get_all_tasks();
  }, []);

  useEffect(() => {
    Set_Tasks(Task_Data);
  }, [Task_Data]);

  return (
    <Fragment>
      <div>
        <div>
          <Button onClick={()=>SetModalFormVisible(true)}>Create Task</Button>
        </div>
        <div>
          {Tasks &&
            Tasks.map((task) => (
              <Card
                style={{ width: "18rem" }}
                key={task.name}
                className="text-center tw-shadow-lg"
              >
                <Card.Header>{task.name}</Card.Header>
                <Card.Body>
                  {/* <Card.Title>{project.name}</Card.Title> */}
                  <Card.Text>{task.description}</Card.Text>
                  <Button variant="primary">more...</Button>
                </Card.Body>
                <Card.Footer className="text-muted">
                  Created on :{" "}
                  {task.created_At && task.created_At.toString().slice(0, 10)}
                </Card.Footer>
              </Card>
            ))}
        </div>
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
