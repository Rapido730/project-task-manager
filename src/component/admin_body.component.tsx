import React, { useState, useEffect, Fragment } from "react";

// import {
//   Button,
//   Container,
//   ListGroup,
//   ListGroupItem,
//   Offcanvas,
// } from "react-bootstrap";
// // import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import Image from "next/image";
// import DeleteIcon from "../assests/deleteLogo.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Select_Current_User } from "@/Store/User/User.Selector";
import { State_Type } from "@/Store/Root_Reducer";

const Body = () => {
  // console.log({ body: selectedProject });
  const Dispatch = useDispatch();

  const Current_User = useSelector((State: State_Type) =>
    Select_Current_User(State)
  );
  // const Users = useSelector((State: State_Type) => Select_All_Users(State));
  const { Selected_Category } = useSelector(
    (state: State_Type) => state.Category
  );
  const { Project_Data } = useSelector((state: State_Type) => state.Project);

  const [ModalFormVisible, setModalFormVisible] = useState(false);
  const [Template_Preview, set_Template_Preview] = useState(false);

  const get_All_Users = async () => {
    if (Current_User) {
      const response = await axios.get(
        "/api/database.api/user.api/read_user.api"
      );

      if (response.status == 200) {
        console.log(response.data.Users);
        Dispatch({ type: "Set_Users", payload: response.data.Users });
        // set_Project_data(response.data.Projects); //  getting error Cannot update a component (`Header`) while rendering a different component (`He`). To locate the bad setState() call inside `He`
      } else {
        alert("users not fetch try again");
      }
    }
  };

  const get_All_Projects = async () => {
    if (Current_User) {
      const response = await axios.get(
        "/api/database.api/project.api/read_All.projects.admin"
      );

      if (response.status == 200) {
        console.log(response.data.Projects);
        Dispatch({ type: "Set_Project_Data", payload: response.data.Projects });
        // set_Project_data(response.data.Projects); //  getting error Cannot update a component (`Header`) while rendering a different component (`He`). To locate the bad setState() call inside `He`
      } else {
        alert("users not fetch try again");
      }
    }
  };

  useEffect(() => {
    get_All_Users();
    get_All_Projects();
  }, []);

  const [showOffCanvas, setShowOffCanvas] = useState(false);

  const handleCloseOffCanvas = () => setShowOffCanvas(false);
  const handleShowOffCanvas = () => setShowOffCanvas(true);

  return (
    <Fragment>
      <div className="tw-flex tw-flex-row tw-h-full">
        <div className="tw-w-64 tw-p-1 tw-flex tw-flex-col tw-bg-gray-300 tw-h-full tw-overflow-auto">
          <h1 className="tw-text-xl tw-mx-auto tw-font-bold ">Users</h1>
          <div className="">
            {/* <ListGroup>
              {Users.map((user) => (
                <ListGroup.Item
                  key={user.email}
                  action
                  variant="light"
                  className="tw-overflow-auto"
                >
                  {user.email}
                </ListGroup.Item>
              ))}
            </ListGroup> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Body;

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
