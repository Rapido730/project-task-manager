import { signIn, signOut, useSession } from "next-auth/react";
import React, { Fragment } from "react";
import {
  Container,
  Button,
  Nav,
  Navbar,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  NavDropdown,
} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import Image from "next/image";
import { faListAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileIcon from "../assests/ProfileLogo.png";

import Router, { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { State_Type } from "@/Store/Root_Reducer";
import { Select_Current_User } from "@/Store/User/User.Selector";
import Link from "next/link";

const Header = () => {
  const { data } = useSession();
  const signinHandler = (event: any) => {
    event.preventDefault();
    signIn().then(() => {
      Router.push("/dashboard");
    });
  };
  const router = useRouter();

  const signOutHandler = (event: any) => {
    signOut();
  };
  const Current_User = useSelector((state: State_Type) =>
    Select_Current_User(state)
  );
  const { pathname } = useRouter();

  const Current_Theme = "Dark";

  return (
    <Fragment>
      <Navbar expand="lg" className="tw-font-bold  tw-bg-gray-200">
        <Container fluid className="">
          <Navbar.Brand href="/">
            <FontAwesomeIcon icon={faListAlt} size="2x" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto ">
              {data && (
                <Nav className="me-md-2  px-2 px-md-0">
                  {pathname === "/dashboard" && (
                    <Nav.Link className="tw-text-white" href="/">
                      Home
                    </Nav.Link>
                  )}
                  {pathname === "/" && (
                    <Nav.Link className="tw-text-white" href="/dashboard">
                      Dashboard
                    </Nav.Link>
                  )}
                  {/* <Nav.Link
                    className="tw-text-white"
                    onClick={() => {
                      router.push("/dashboard/projects", undefined, { shallow: true });
                    }}
                  >
                    Dashboard
                  </Nav.Link> */}
                </Nav>
              )}

              {data ? (
                <Nav className=" tw-w-max ">
                  <Dropdown drop="start">
                    <DropdownToggle variant="flat">
                      <span className="tw-space-x-2">
                        <Image
                          src={data?.user?.image || ProfileIcon}
                          alt="UserName profile image"
                          width={30}
                          height={30}
                          className="rounded-circle"
                          quality={100}
                        />
                        <span className="tw-text-white">{data.user?.name}</span>
                      </span>
                    </DropdownToggle>
                    <DropdownMenu
                      className={
                        "tw-relative tw-w-fit  tw-justify-center " +
                        (Current_Theme === "Dark"
                          ? " tw-bg-gradient-to-tl tw-from-gray-900 tw-via-slate-700 tw-to-gray-900"
                          : "")
                      }
                    >
                      <div
                        className={
                          "tw-flex  tw-px-4 tw-flex-col tw-items-center tw-space-y-2" +
                          (Current_Theme === "Dark" ? " tw-text-white" : "")
                        }
                      >
                        <Image
                          src={data?.user?.image || ProfileIcon}
                          alt="UserName profile image"
                          width={60}
                          height={60}
                          className="rounded-circle "
                          quality={100}
                        />
                        <h1 className="tw-font-bold tw-text-xl">
                          {data.user?.name}
                        </h1>
                        <span> {data.user?.email}</span>

                        {/* <button
                          // variant="flat"
                          className=" tw-font-bold tw-mx-1 tw-p-2 tw-rounded-md tw-bg-gray-900 tw-text-white hover:tw-bg-gray-700"
                          onClick={Theme_Change_Handler}
                        >
                          {(Theme === "Dark" ? "Light" : "Dark") + " Theme"}
                        </button> */}

                        <button
                          // variant="flat"
                          className=" tw-font-bold tw-mx-1 tw-p-2 tw-rounded-md tw-bg-gray-900 tw-text-white hover:tw-bg-gray-700"
                          onClick={signOutHandler}
                        >
                          Sign Out
                        </button>
                      </div>
                    </DropdownMenu>
                  </Dropdown>
                </Nav>
              ) : (
                <Nav>
                  <Button variant="flat" className="" onClick={signinHandler}>
                    Sign In
                  </Button>
                </Nav>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Fragment>
  );
};

export default Header;
