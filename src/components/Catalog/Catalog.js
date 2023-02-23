import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as regThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import { useState } from 'react';
import { useCartContext } from '../context/context';
// import PetStoreNav from '../../App.js';
import axios, {isCancel, AxiosError} from 'axios';


console.log("Catelog.js rendered");



// Component to render the item list
const PetItemList = () => {
  const { addToCart } = useCartContext();
  const itemPrice = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '50px'
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9090/graphql/', {  // Enter your IP address here
      method: 'POST',
      mode: 'no-cors',
      // headers: { 'Content-Type': 'application/json' },
      // headers:{'content-type': 'application/json'},
      // headers: new Headers({'content-type': 'application/json'}),
      // headers: new Headers({'content-type': 'application/json'}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
     },

      body: JSON.stringify("{ \"query\": \"query { items { ID Includes Color} }\" }") // body data type must match "Content-Type" header
    })
      .then(response => response.json())
      .then(data => setItems(data));
  }, []);

  axios.post('http://localhost:8080/auth/signup', {
                username: this.state.username,
                password: this.state.password
            })

  console.log(items);
  // need to map this
  const listItems = items.map((item) =>
    <Col>
      <img src={item.itemImage} width="300" alt="dog"/><br />
      <h4>{item.itemName}</h4>
      <p>{item.itemDesc}</p>
      <p>
        <b>Includes: </b> {item.stockDetails.includes}<br />
        <b>Intended For:</b> {item.stockDetails.intendedFor}<br />
      </p>
      </Col>
    );
  
  return (
    <Row>{listItems}</Row>
  );
};

export default function Catalog() {
  const { cart, addToCart } = useCartContext();
  console.log(cart, addToCart);
  useEffect(() => {
    console.log(cart);
  }, [cart]);
  useEffect(() => {
    document.title = 'PetStore Catalog';
  }, []);
  return (
    <>
      <PetItemList />
    </>
  );
}