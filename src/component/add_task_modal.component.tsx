import React, { Fragment, useState } from "react";
import Notification_Toast from "./notification_toast.component";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Create_Action from "@/Store/Action_Creator";
import { Project_Action_Type } from "@/Store/Project/Project.Types";
import { Select_Current_User } from "@/Store/User/User.Selector";
import { State_Type } from "@/Store/Root_Reducer";
import { Create_Project } from "@/Services/Project.Services";
import { Project_Type } from "@/DB/models/Project.Model";
import { Task_Type } from "@/DB/models/Task.Model";
import { Task_Action_Type } from "@/Store/Task/Task.Types";
import { Create_Task } from "@/Services/Task.Services";

interface Props {
  setModalFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  ModalFormVisible: boolean;
}

const Add_Task_Modal_Form = ({
  setModalFormVisible,
  ModalFormVisible,
}: Props) => {
  const Dispatch = useDispatch();
  const [Task_Field, set_Task_Field] = useState({
    name: "",
    description: "",
    assigned_to: "",
  });

  const Current_User = useSelector((State: State_Type) =>
    Select_Current_User(State)
  );

  const { Selected_Project } = useSelector(
    (state: State_Type) => state.Project
  );

  const [Notification_Toast_Show, Set_Notification_Toast_Show] =
    useState(false);

  const [Notification_Data, Set_Notification_Data] = useState<{
    Heading: String;
    Body: String;
  }>({ Heading: "", Body: "" });

  const cancelButtonHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setModalFormVisible(false);
  };

  const ProjectFieldChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    set_Task_Field({ ...Task_Field, [name]: value });
  };
  // console.log(Project_Field)

  const FormSubmitHandler = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (Selected_Project && Selected_Project._id) {
      try {
        const data = {
          name: Task_Field.name,
          description: Task_Field.description,
          manager_Id: Selected_Project.manager_Id,
          project_Id: Selected_Project._id,
          worker_Id: Task_Field.assigned_to,
        };
        const { Status, Response_Data } = await Create_Task(data);
        if (Status === "Success" && Response_Data ) {
          Dispatch(Create_Action(Task_Action_Type.Add_Task, Response_Data));
        //   Set_Notification_Data({
        //     Heading: "New task is created",
        //     Body: `You have successfully created ${Response_Data.name}`,
        //   });
        //   Set_Notification_Toast_Show(true);
          setModalFormVisible(false);
        } else if (Status == "Database_Error") {
          Set_Notification_Data({
            Heading: "Error while fetching data",
            Body: "Project data is not created try again!",
          });
          Set_Notification_Toast_Show(true);
        } else if (Status === "Worker not found!") {
          Set_Notification_Data({
            Heading: "employee not found!",
            Body: "Please enter correct Id.",
          });
        } else {
          Set_Notification_Data({
            Heading: "employee not found!",
            Body: "Please enter correct Id.",
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
    // console.log(response);
  };

  return (
    <Fragment>
      <Modal
        show={ModalFormVisible}
        onHide={() => setModalFormVisible(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={FormSubmitHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Task</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Task Name"
                name="name"
                onChange={ProjectFieldChangeHandler}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="About the task"
                name="description"
                onChange={ProjectFieldChangeHandler}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Assigned to</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="email"
                name="assigned_to"
                onChange={ProjectFieldChangeHandler}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <div className="d-flex gap-3">
              <Button variant="dark" type="submit">
                Add
              </Button>
              <p className="my-auto" onClick={() => setModalFormVisible(false)}>
                Cancel
              </p>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
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

export default Add_Task_Modal_Form;
