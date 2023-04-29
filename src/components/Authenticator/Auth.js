import { default as authConfig } from "../../config.json";
import React, { useEffect, useState } from 'react';



function manualSignIn() {
    const clientId = authConfig.clientID;
    const redirectUri = authConfig.signInRedirectURL;
    const authorizationEndpoint = authConfig.authEndpoint;
    const responseType = 'code';
    const scope = 'openid profile email';
  
    // build the authorization URL
    const url = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  
    // redirect the user to the authorization URL
    window.location.href = url;
  }

function manualGetToken(code) {

    const CLIENT_ID = authConfig.clientID;
    const CLIENT_SECRET = 'rxjs_f1UFR042AAZJm_P_vXZ6O8a';
    const REDIRECT_URI = authConfig.signInRedirectURL;
    const AUTHORIZATION_ENDPOINT = authConfig.authEndpoint;
    const TOKEN_ENDPOINT = authConfig.tokenEndpoint;
    console.log("------------ code in manualGetToken() -------------- 1 ");
    console.log(code);
    // parse the query string to get the authorization code
    // const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = code;

    // call the token API to exchange the authorization code for an access token
    fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${REDIRECT_URI}`,
    })
        .then((response) => response.json())
        .then((data) => {
            // access token is available in data.access_token
            console.log("------------ token in manualGetToken() -------------- ");
            console.log(data.access_token);
            // return data.access_token;
        })
        .catch((error) => console.error(error));
}

export { manualSignIn, manualGetToken };