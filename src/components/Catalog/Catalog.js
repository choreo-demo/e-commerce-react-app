import React, { useEffect } from 'react';
import { useState } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as regThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import { useCartContext } from '../context/context';
// import PetStoreNav from '../../App.js';
import axios, { isCancel, AxiosError } from 'axios';



console.log("Catelog.js rendered");

// Component to render the item list
const PetItemList = () => {
  const { addToCart } = useCartContext();
  const itemPrice = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '50px'
  };

  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken,
    on,
    getAccessToken,
    httpRequest
  } = useAuthContext();
  const [token, settoken] = useState([]);
  const [catalog, setCatalog] = useState([]); 
  const [cart, setCartItem] = useState([]);  

  useEffect(() => {
    if (state.isAuthenticated) {
      getAccessToken().then((accessToken) => {
        console.log("token " + accessToken);
        settoken(accessToken);
        const url = 'https://a08ea0cf-47a1-4195-baf2-48335f9914fc-dev.e1-us-east-azure.choreoapis.dev/ezbg/ecommerceapp/1.0.0/items';
        const headers = {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        };
        const fetchCatalogs = async () => {
          const result = await axios.get(url, { headers });
          return result.data;
        };
        const fetchData = async () => {
          const catData = await fetchCatalogs();
          console.log(catData);
          setCatalog(catData);
        };
        fetchData();
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [state.isAuthenticated]);

  
  if (state.isAuthenticated) {
    return (
      <>
        <Container className="mt-5">
          <Table bordered hover>
            <thead>
              <tr>
                <th scope="col" width="150px">ID</th>
                <th scope="col" width="150px">Title</th>
                <th scope="col" width="400px">Description</th>
                <th scope="col">Includes</th>
                <th scope="col">Intended For</th>
                <th scope="col" width="50px">Color</th>
                <th scope="col">Material</th>
                <th scope="col">Price</th>
                <th scope="col">&nbsp;</th>
              </tr>
              {catalog.map(cat => (
                <tr className="align-middle" key={cat.ID}>
                  <td>{cat.ID}</td>
                  <td>{cat.Title}</td>
                  <td>{cat.Description}</td>
                  <td>{cat.Includes}</td>
                  <td>{cat.IntendedFor}</td>
                  <td>{cat.Color}</td>
                  <td>{cat.Material}</td>
                  <td>{cat.Price}</td>
                  <td><Button variant="danger" size="sm" onClick={() => addToCart(cat)}>Add to cart</Button></td>
                </tr>
              ))}
              {/* <tr className="text-end">
                <td colSpan="8"><Button variant="primary" className="float-right" onClick={handleClick}>Add New Product</Button></td>
              </tr> */}
            </thead>
          </Table>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <Container className="mt-5">
          <h1>Admin</h1>
          <p>You must be logged in to view this page.</p>
          <Button variant="primary" onClick={() => signIn()}>Login</Button>
        </Container>
      </>
    )
  }

};

export default function Catalog() {
  const [catalog, setCatalog] = useState(); 
  const [cart, setCartItem] = useState();
  // useEffect(() => {
  //   console.log(cart);
  // }, [cart]);
  useEffect(() => {
    document.title = 'PetStore Catalog';
  }, []); // only when loading
  return (
    <>
      <PetItemList />
    </>
  );
}