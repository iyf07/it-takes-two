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
                <NavDropdown.Item href="/task"><Image src="/icons/Task.png" width={24} height={24} /> Task Board</NavDropdown.Item>
                <NavDropdown.Item href="/service"><Image src="/icons/Beer.png" width={24} height={24} /> Store</NavDropdown.Item>
                <NavDropdown.Item href="/bank"><Image src="/icons/Gold.png" width={24} height={24} /> Bank</NavDropdown.Item>
                <NavDropdown.Item href="/check-in"><Image src="/icons/Pumpkin.png" width={24} height={24} /> Visitor Center</NavDropdown.Item>
                <NavDropdown.Item href="/wish"><Image src="/icons/Star.png" width={24} height={24} /> Wishing Well</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={<Image src="/icons/Note.png" width={24} height={24} />} id="user-menu" align="end">
                <NavDropdown.Item href="/record"><Image src="/icons/Diary.png" width={24} height={24} /> Diary</NavDropdown.Item>
                <NavDropdown.Item href="/order"><Image src="/icons/Order.png" width={24} height={24} /> Orders</NavDropdown.Item>
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