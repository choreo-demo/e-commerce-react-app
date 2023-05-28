import React, { useEffect } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import { useState } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import { manualSignIn, manualGetToken } from '../Authenticator/Auth.js';
import { default as authConfig } from "../../config.json";
const axios = require('axios');

export default function Admin() {
    const [authorizationCode, setAuthorizationCode] = useState();
    const [token, settoken] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const [isAdmin, setAdmin] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
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
    var catalogUpdated = false;
    const gatewayURL = authConfig.endpointURL;
    useEffect(() => {
        document.title = "Admin | PetStore";
    }, []);

    var items = [];
    console.log(state);

    useEffect(() => {
        console.log("catelogsUpdated - " + catalogUpdated )
        getBasicUserInfo().then((basicUserDetails) => {
            console.log("Userinfo : " + JSON.stringify(basicUserDetails));
            console.log("Userinfo groups: " + basicUserDetails.groups);
            var isadmin2 = basicUserDetails.groups.includes("admin");
            console.log(basicUserDetails.groups);
            setAdmin(isadmin2);
            if (isadmin2) {
                getAccessToken().then((accessToken) => {
                    console.log("token " + accessToken);
                    settoken(accessToken);
                    const url = gatewayURL + '/items';
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
          } else {
            
        }
        }).catch((error) => {
            // Handle the error
        })
    }, [state.isAuthenticated, catalogUpdated]);

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    const editCartItem = (id) => {
        
    };

    const deleteCartItem = (id) => {
        const payload = {id: parseInt(id)};
        console.log("in item deletion: " + payload);
        console.log(payload);
        getAccessToken().then((accessToken) => {
            console.log("token " + accessToken);
            settoken(accessToken);
            const url = gatewayURL + '/item';
            const headers = {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': '*'
            };
            const addToCatalog = async () => {
                const result = await axios.delete(url, payload, { headers });
                catalogUpdated = false;
                console.log("Catalog updated")
                console.log(result.data)
                console.log(catalogUpdated);
                return result.data;
            };
            addToCatalog();
        }).catch((error) => {
            console.log(error);
        });
    };

    const addNewCartItem = (newid) => {
        console.log(newid);
        const id = -1;
        const title = document.getElementById("newtitle").innerHTML;
        const description = document.getElementById("newdescription").innerHTML;
        const includes = document.getElementById("newincludes").innerHTML;
        const irntendedFor = document.getElementById("newintendedFor").innerHTML;
        const color = document.getElementById("newcoler").innerHTML;
        const material = document.getElementById("newmaterial").innerHTML;
        const price = parseFloat(document.getElementById("newprice").innerHTML);
        const payload = {id: id, title: title, description: description, includes: includes, intendedFor: irntendedFor, color: color, material: material, price: price};
        console.log(payload);
        getAccessToken().then((accessToken) => {
            console.log("token " + accessToken);
            settoken(accessToken);
            const url = gatewayURL + '/item';
            const headers = {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': '*'
            };
            const addToCatalog = async () => {
                const result = await axios.post(url, payload, { headers });
                catalogUpdated = false;
                console.log("Catalog updated")
                console.log(result.data)
                console.log(catalogUpdated);
                return result.data;
            };
            addToCatalog();

            // const fetchCatalogs = async () => {
            //     const result = await axios.post(url, payload, { headers });
            //     return result.data;
            // };
            // const fetchData = async () => {
            //     const catData = await fetchCatalogs();
            //     console.log(catData);
            //     setCatalog(catData);
            // };
            
        }).catch((error) => {
            console.log(error);
        });
    };

    if (state.isAuthenticated) {
        if (isAdmin) {
            console.log("Logged in user is an ADMIN");
            var numberOfItems = catalog.length + 1;
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
                                    <tr className="align-middle" key={cat.ID} row={cat.ID} onClick={handleRowClick}>
                                        <td>{cat.Title}</td>
                                        <td>{cat.Description}</td>
                                        <td>{cat.Includes}</td>
                                        <td>{cat.IntendedFor}</td>
                                        <td>{cat.Color}</td>
                                        <td>{cat.Material}</td>
                                        <td>{cat.Price}</td>
                                        <td>
                                            <Button variant="warning" size="sm" onClick={() => editCartItem(cat.ID)}>Edit</Button>
                                            <Button variant="danger" size="sm" onClick={() => deleteCartItem(cat.ID)}>Remove</Button>    
                                        </td>
                                    </tr>
                                ))}
                                <tr className="text-end">
                                    <td id='newtitle' contenteditable='true'></td>
                                    <td id='newdescription' contenteditable='true'></td>
                                    <td id='newincludes' contenteditable='true'></td>
                                    <td id='newintendedFor' contenteditable='true'></td>
                                    <td id='newcoler' contenteditable='true'></td>
                                    <td id='newmaterial' contenteditable='true'></td>
                                    <td id='newprice' contenteditable='true'></td>
                                    <td colSpan="8"><Button variant="success" className="float-right" onClick={() => addNewCartItem(numberOfItems)}>Add New Product</Button></td>
                                </tr>
                            </thead>
                        </Table>
                    </Container>
                </>
            );
        } else {
            console.log("Logged in user is NOT an ADMIN");
            return (
                <>
                    <Container className="mt-5">
                        <h1>Admin</h1>
                        <p>You must be an Admin in to view this page. Logout and Sign in Again</p>
                    </Container>
                </>
            )
        }


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


}

async function fetchMovies404() {
    const response = await fetch('http://localhost:9091/rest/items');
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const movies = await response.json();
    return movies;
}