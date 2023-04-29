// import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.css';
import './App.scss';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import { default as authConfig } from "./config.json";
import { Provider } from './components/context/context';

import Catalog from './components/Catalog/Catalog.js';
import MyCart from './components/MyCart/Cart.js';
import Admin from './components/Admin/Admin.js';
import { manualSignIn, manualGetToken } from './components/Authenticator/Auth.js';

// Component to render the login/signup/logout menu

const RightLoginSignupMenu = () => {
  // Based on Asgardeo SDK, set a variable like below to check and conditionally render the menu
  let isLoggedIn = false;

  // Host the menu content and return it at the end of the function
  let menu;
 
  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken,
    on,
    getAccessToken
  } = useAuthContext();

  // Conditionally render the following two links based on whether the user is logged in or not
  if (state.isAuthenticated) {
    menu = <>
      <Nav>
        <Nav.Link onClick={() => signOut()}>Logout</Nav.Link>
        <Nav.Link href="#deets"><FontAwesomeIcon icon={faUser} /></Nav.Link></Nav>
    </>
  } else {
    menu = <>
      <Nav>
        <Nav.Link onClick={() => signIn()} >Login</Nav.Link>
        {/* <Nav.Link onClick={() => handleSignIn()} >Login</Nav.Link> */}
        <Nav.Link href="#deets">Sign Up</Nav.Link></Nav>
    </>
  }
  return menu;
}

// Component to render the navigation bar
const PetStoreNav = () => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">PetStore</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Link to={"/"}>Catalog</Link>
          <Link to={"/mycart"}>My Cart</Link>
          <Link to={"/admin"}>Admin</Link>
          <RightLoginSignupMenu isLoggedIn />
        </Container>
      </Navbar>
    </>
  );
};

// Main app component
const App = () => {
  return (
    <>
      <AuthProvider config={authConfig}>
        <Provider>
          <BrowserRouter>
            <PetStoreNav />
            <Switch>
              <Route exact path="/">
                <Catalog />
              </Route>
              <Route path="/mycart">
                <MyCart />
              </Route>
              <Route path="/admin">
                <Admin />
              </Route>
            </Switch>
          </BrowserRouter>
        </Provider>
      </AuthProvider>
    </>
  );
}

export default App;

