import React, {useState, useEffect, useRef} from 'react';
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

     const autstatus = useRef({
        ...loggedIn,
        login:login,
        logout: logout,
        }
    );

    useEffect( ()=>{
               async function waitForLogin() {
                   await login();
                   autstatus.current = {
                       ...loggedIn,
                       login: login,
                       logout: logout,
                   }
               }
               if( loggedIn.loginReady === false ) {
                 waitForLogin();
                 console.log('useeffect');
                 console.log( autstatus.current );
               }
        },[] );


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
            console.log( loggedIn );

            const rc = await getUserDetails( JWT, decodedToken.sub );

            console.log ( 'User details ', rc );
            if ( rc.success){
                // user details has following fields:
                // email, username, password (bcrypted) and id.

                const status = {
                    ...loggedIn,
                    userDetails: rc.result.data,
                    user: rc.result.data.username,
                    loggedIn: true,
                    loginReady: true,
                };
                console.log( 'login success', loggedIn );
                autstatus.current = { ...status, login: login, logout: logout};
                setLoggedIn( status );
            }else{
                const status = {
                    ...loggedIn,
                    loggedIn: false,
                    user: null,
                    userDetails: null,
                    loginReady: true,
                };
                autstatus.current = { ...status, login: login, logout: logout};
                setLoggedIn( status );
                console.log( 'login failure', loggedIn );
            }

        } else {
            const status = {
                ...loggedIn,
                loggedIn: false,
                user: null,
                userDetails: null,
                loginReady: true,
            };
            autstatus.current = { ...status, login: login, logout: logout};
            setLoggedIn( status );
            console.log('Aut: Not logged in, invalid user/password');
        }
        return ( loggedIn );
    }

    function logout() {
        console.log(`Gebruiker ${loggedIn.user} logt nu uit`);
        setLoggedIn({...loggedIn, loggedIn: false, userDetails: null, loginReady: true} );
        localStorage.removeItem('token');
    }

    console.log( 'end of auth - logged in');
    console.log( loggedIn );
    console.log( 'end of auth - autstatus.current');
    console.log( autstatus.current );

    return (
        <>
            { loggedIn.loginReady ?
                <AuthContext.Provider value={autstatus.current}>
                    {children}
                </AuthContext.Provider>
                : <p>Loading...{loggedIn.loginReady ? "true" : "false"}</p>
            }
       </>

    );

}

export default AuthContextProvider;

