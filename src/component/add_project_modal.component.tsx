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

interface Props {
  setModalFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  ModalFormVisible: boolean;
}

const Add_Project_Modal_Form = ({
  setModalFormVisible,
  ModalFormVisible,
}: Props) => {
  const Dispatch = useDispatch();
  const [Project_Field, set_Project_Field] = useState({
    name: "",
    description: "",
  });

  const Current_User = useSelector((State: State_Type) =>
    Select_Current_User(State)
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

    set_Project_Field({ ...Project_Field, [name]: value });
  };
  // console.log(Project_Field)

  const FormSubmitHandler = async (
    event: React.ChangeEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (Current_User && Current_User._id) {
      try {
        const data: Project_Type = {
          name: Project_Field.name,
          description: Project_Field.description,
          manager_Id: Current_User._id,
        };
        const { Status, Response_Data } = await Create_Project(data);
        if (Status === "Success") {
          Dispatch(
            Create_Action(Project_Action_Type.Add_Project, Response_Data)
          );
          Set_Notification_Data({
            Heading: "New project is created",
            Body: `You have successfully created ${Response_Data.name}`,
          });
          Set_Notification_Toast_Show(true);
          setModalFormVisible(false);
        } else if (Status == "Database_Error") {
          Set_Notification_Data({
            Heading: "Error while fetching data",
            Body: "Project data is not created try again!",
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
          <Modal.Title id="contained-modal-title-vcenter">
            Add project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={FormSubmitHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Project</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Project Name"
                name="name"
                onChange={ProjectFieldChangeHandler}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>description</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="About the project"
                name="description"
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

export default Add_Project_Modal_Form;
