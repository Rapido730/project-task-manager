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
                  <NavDropdown
                    title={
                      <span className="tw-space-x-2">
                        <Image
                          src={data?.user?.image || ProfileIcon}
                          alt="UserName profile image"
                          width={30}
                          height={30}
                          className="rounded-circle"
                          quality={100}
                        />
                        <span>{data.user?.name}</span>
                      </span>
                    }
                    id="collasible-nav-dropdown"
                    className=" tw-flex tw-flex-col "
                  >
                    <NavDropdown.ItemText className="tw-bg-inherit tw-text-center">
                      <h1 className="tw-text-sm">
                        Role : {Current_User?.role}
                      </h1>
                    </NavDropdown.ItemText>
                    <NavDropdown.Item className="tw-bg-inherit">
                      <Link href={"/"}>
                        <Button
                          className="w-100 tw-font-bold hover:tw-text-white tw-text-white hover:tw-bg-cyan-200 tw-bg-cyan-400 tw-mx-1 tw-p-2"
                          onClick={signOutHandler}
                        >
                          Sign Out
                        </Button>
                      </Link>
                    </NavDropdown.Item>

                    {/* </Dropdown.Item> */}
                  </NavDropdown>
                </Nav>
              ) : (
                <Nav>
                  <Button
                    variant="light"
                    className="tw-text-white"
                    onClick={signinHandler}
                  >
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
