import { signIn, useSession } from "next-auth/react";
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

const Header = () => {
  const { data } = useSession();
  const signinHandler = (event: any) => {
    event.preventDefault();
    signIn().then(() => {
      Router.push("/dashboard");
    });
  };

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
                    className=" "
                  >
                    <NavDropdown.Item className="tw-bg-inherit">
                      <Button
                        className="w-100 tw-font-bold hover:tw-text-white tw-text-white hover:tw-bg-cyan-200 tw-bg-cyan-400 tw-mx-1 tw-p-2"
                        // onClick={signOutHandler}
                      >
                        Sign Out
                      </Button>
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
