import React, { useEffect } from 'react';
import { Button, Col, Container, Form, FormLabel, Row } from 'react-bootstrap';
import { InputNumber, InputGroup } from 'rsuite';
import '../../App.js';
import '../../index.css';
import { useCartContext } from '../context/context';
import './inputnumber.less';

export default function MyCart() {

    const { cart, uptateItemQty } = useCartContext();
    useEffect(() => {
        document.title = 'My Cart';
    }, []);

    // State to keep track of the number of items in the cart
    const [value, setValue] = React.useState(1);
    const [subTotal, setSubTotal] = React.useState(0);
    const handleMinus = () => {
        setValue(parseInt(value, 10) - 1);
    };
    const handlePlus = () => {
        setValue(parseInt(value, 10) + 1);
    };


    const rows = cart.map(cartItem => {
        
        const handleQtyIncrease = () => {
            uptateItemQty({
                id: cartItem.ID,
                qty: cartItem.qty + 1
            })
            setValue(parseInt(value, 10) + 1);
            const total = cartItem.Price * cartItem.qty
            setSubTotal(subTotal + total)
        }
    
        const handleQtyChange = (e) => {
            if (e <= 0) {
                e = 1      
            }
            uptateItemQty({
                id: cartItem.ID,
                qty: e
            })
            const total = cartItem.Price * cartItem.qty
            setSubTotal(subTotal + total)
        }

        const handleQtyDecrease = () => {
            if (cartItem.qty === 1) {
                uptateItemQty({
                    id: cartItem.ID,
                    qty: cartItem.qty
                })

            } else {
                uptateItemQty({
                    id: cartItem.ID,
                    qty: cartItem.qty - 1
                })
            }
            const total = cartItem.Price * cartItem.qty
            setSubTotal(subTotal + total)
        }
    
        return (
            <tr key={cartItem.ID}>
                <td>{cartItem.Title}</td>
                <td width="120px">
                    <InputGroup>
                        <InputGroup.Button onClick={handleQtyDecrease} >-</InputGroup.Button>
                        <input type='number'  className={'custom-input-number'} value={cartItem.qty} onChange={handleQtyChange}/>
                        <InputGroup.Button onClick={handleQtyIncrease}>+</InputGroup.Button>
                    </InputGroup>
                </td>
                <td width="120px" className="text-center">{cartItem.Price}</td>
                <td width="120px" className="text-center">{`$ ${cartItem.Price * cartItem.qty}`}</td>
                {console.log(cartItem)}
            </tr>
        )
    })


    // Number of items in the cart
    let numItems = cart.reduce((acc, curr) => acc + curr.qty, 0);
    let cartPrice = cart.reduce((acc, curr) => acc + curr.qty * curr.Price, 0);
    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col>
                        <p>Checking out items - You have {numItems} items in your cart</p>
                        <table className='table align-middle'>
                            <thead>
                                <tr className="text-center">
                                    <th scope="col"></th>
                                    <th scope="col">QTY</th>
                                    <th scope="col" >Unit</th>
                                    <th scope="col">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}                        
                            </tbody>
                        </table>
                    </Col>
                    <Col className="col-4 bg-primary p-4 text-white rounded-3"><h2>Card Details</h2>
                        <Form>
                            <Row>
                                <Form.Group className="mb-3" controlId="formNameOnCard">
                                    <FormLabel>Name on Card</FormLabel>
                                    <Form.Control type="text" placeholder="Enter full name" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formCardNumber">
                                    <FormLabel>Card Number</FormLabel>
                                    <Form.Control type="text" placeholder="Enter card number" />
                                </Form.Group>
                            </Row>
                            <Row><Col>
                                <Form.Group className="mb-3" controlId="formExpirationDate">
                                    <FormLabel>Expiration Date</FormLabel>
                                    <Form.Control type="text" placeholder="Expiration Date" />
                                </Form.Group></Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formCVV">
                                        <FormLabel>CVV</FormLabel>
                                        <Form.Control type="text" placeholder="CVV" />
                                    </Form.Group></Col>
                            </Row>
                            <Row className="p-1">
                                <Col>Subtotal</Col>
                                <Col className="col-2 d-flex justify-content-right">{`$ ${(cartPrice).toFixed(2)}`}</Col>
                            </Row>
                            <Row className="p-1">
                                <Col>Shipping</Col>
                                <Col className="col-2 d-flex justify-content-right">{`$ ${(cartPrice * 1/100).toFixed(2)}`}</Col>
                            </Row>
                            <Row className="p-1">
                                <Col c>Tax</Col>
                                <Col className="col-2 d-flex justify-content-right">{`$ ${(cartPrice* 10/100).toFixed(2)}`}</Col>
                            </Row>

                            <Row className="p-1">
                                <Col>Total (inc. tax)</Col>
                                <Col className="col-2 d-flex justify-content-right">
                                    {`$ ${(cartPrice + cartPrice* 10/100 + cartPrice * 1/100).toFixed(2)}`}</Col>
                            </Row>
                            <Row className="d-flex justify-content-center p-3">
                                <Button variant="warning" type="submit" size="lg">
                                    Place Order
                                </Button>
                            </Row>
                        </Form>
                    </Col>
                </Row>

            </Container>
        </>
    );
}