"use client";

import { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { fetchUserDataByCookie } from '@/lib/client-utils';

export default function NavigationBar() {
  const [userData, setUserData] = useState(Object);

  async function handleSignOut() {
    await fetch("/api/user/sign-out", {
      method: "POST",
      credentials: "include",
    });

    location.href = "/user/sign-in";
  }

  useEffect(() => {
    (async () => {
      const userData = await fetchUserDataByCookie();
      if (userData) {
        setUserData(userData);
      }
    })();
  }, []);

  return (
    <Navbar className="theme-color">
      <Container>
        <Navbar.Brand href="/">Mihu</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {userData.username ? (<>
              <NavDropdown title={userData.username} id="user-menu" align="end">
                <NavDropdown.Item href="/user/account">Account</NavDropdown.Item>
                <NavDropdown.Item href="/user/pair-partner">Pair partner</NavDropdown.Item>
                <NavDropdown.Item onClick={handleSignOut}>Sign out</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={<Image src="/icons/Village.png" width={24} height={24} />} id="user-menu" align="end">
                <NavDropdown.Item href="/task">Task Board</NavDropdown.Item>
                <NavDropdown.Item href="/service">Store</NavDropdown.Item>
                <NavDropdown.Item href="/bank">Bank</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={<Image src="/icons/Note.png" width={24} height={24} />} id="user-menu" align="end">
                <NavDropdown.Item href="/record">Diary</NavDropdown.Item>
                <NavDropdown.Item href="/order">Orders</NavDropdown.Item>
              </NavDropdown>
            </>) :
              (<>
                <NavDropdown title="User" id="user-menu" align="end">
                  <NavDropdown.Item href="/user/sign-in">Sign in</NavDropdown.Item>
                  <NavDropdown.Item href="/user/sign-up">Sign up</NavDropdown.Item>
                </NavDropdown></>)
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}