import React, { useEffect } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import { useState } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import { manualSignIn, manualGetToken } from '../Authenticator/Auth.js';
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

    useEffect(() => {
        document.title = "Admin | PetStore";
    }, []);

    var items = [];
    console.log(state);

    useEffect(() => {
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
                // const url = 'http://localhost:9091/rest/items';
                // const config = {
                //     method: 'get',
                //     url: url,
                //     withCredentials: false,
                //     mode: 'no-cors',
                //     headers: {
                //         // 'Access-Control-Allow-Origin': '*',
                //         'Content-Type': 'application/json',
                //         'Accept': 'application/json'
                //     }
                // };
                // axios(config)
                //     .then(response => {
                //         console.log(response);
                //     })
                //     .catch(error => {
                //         console.log(error);
                //     });
            } else {
                
            }
        }).catch((error) => {
            // Handle the error
        })
    }, [state.isAuthenticated]);

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    const editCartItem = (id) => {
        
    };

    const addNewCartItem = (id) => {
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
                                        <td>{cat.ID}</td>
                                        <td>{cat.Title}</td>
                                        <td>{cat.Description}</td>
                                        <td>{cat.Includes}</td>
                                        <td>{cat.IntendedFor}</td>
                                        <td>{cat.Color}</td>
                                        <td>{cat.Material}</td>
                                        <td>{cat.Price}</td>
                                        <td><Button variant="danger" size="sm" onClick={() => editCartItem(cat.ID)}>Edit</Button></td>
                                    </tr>
                                ))}
                                <tr className="text-end">
                                    <td>{numberOfItems}</td>
                                    <td contenteditable='true'></td>
                                    <td contenteditable='true'></td>
                                    <td contenteditable='true'></td>
                                    <td contenteditable='true'></td>
                                    <td contenteditable='true'></td>
                                    <td contenteditable='true'></td>
                                    <td contenteditable='true'></td>
                                    <td colSpan="8"><Button variant="primary" className="float-right" onClick={() => addNewCartItem(item)}>Add New Product</Button></td>
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