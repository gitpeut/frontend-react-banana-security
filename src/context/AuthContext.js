import React, {useState, useEffect} from 'react';
import jwtDecode from "jwt-decode";
import axios from "axios";

export const AuthContext = React.createContext({});

function AuthContextProvider({children}) {
    const [loggedIn, setLoggedIn] = useState({
        loggedIn: false,
        user: null,
        userDetails: null,
        loginReady: false,
    });

    useEffect( ()=>{ login();},[] );

    async function getUserDetails( accessToken, id ){
        const rc =  {success: false, result: null};

        try{
            rc.result = await axios.get( `http://localhost:3000/600/users/${id}` ,{headers:
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + accessToken
                }
            } );

            rc.success = true;
            console.log( rc.result);

            return( rc );
        }catch(e){
            rc.result = e.response.data;
            console.log( "Error response get user data : ", e.response.data);
            return ( rc );
        }
    }

    async function login() {
        //return true (or false) when logged in, so this can be acted upon at form submit
        //random success guaranteed
        //const validAccount = ((Math.random() * 10) & 1) ? true : false;

        // get JWT token, if available
        const JWT = localStorage.getItem('token');
        if ( JWT ) {
            const decodedToken = jwtDecode( JWT );

            console.log( 'Auth: decoded Token : ', decodedToken );

            setLoggedIn({
                    ...loggedIn,
                    loggedIn: true,
                    user: decodedToken.email,
                }
            );

            console.log(`Gebruiker ${ decodedToken.email } is ingelogd`);

            const rc = getUserDetails( JWT, decodedToken.sub );

            console.log ( 'User details ', rc );
            if ( rc.success){
                        // user details has following fields:
                        // email, username, password (bcrypted) and id.

                setLoggedIn({
                        ...loggedIn,
                        userDetails: rc.result.data,
                        loginReady: true,
                    }
                );


                console.log("loginReady : true");

            }else{
                setLoggedIn({
                        ...loggedIn,
                        loggedIn: false,
                        userDetails: null,
                        loginReady: false,
                    }
                );
            }

        } else {
            console.log('Aut: Not logged in, invalid user/password');
        }
        return ( loggedIn.loggedIn );
    }

    function logout() {
        console.log(`Gebruiker ${loggedIn.user} logt nu uit`);
        setLoggedIn({...loggedIn, loggedIn: false, userDetails: null, loginReady: false} );
        localStorage.removeItem('token');
    }



    return (

        <AuthContext.Provider value={ {login: login,logout: logout, ...loggedIn} }>
            {
                loggedIn ? children : <p>Loading...{ loggedIn}</p>
            }

        </AuthContext.Provider>
    );


}

export default AuthContextProvider;

