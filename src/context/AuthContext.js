import React, {useState, useEffect, useRef} from 'react';
import jwtDecode from "jwt-decode";
import axios from "axios";

export const AuthContext = React.createContext({});

function AuthContextProvider({children}) {
    const [loggedIn, setLoggedIn] = useState({
        loggedIn: false,   // in stead of 'isAuth'
        user: null,
        userDetails: null,
        loginReady: false, // in stead of 'status'
    });

    const autStatus = useRef({
            ...loggedIn,
            login: login,
            logout: logout,
        }
    );

    useEffect(() => {
        async function waitForLogin() {
            await login();
        }
        waitForLogin();
    }, []);

    async function getUserDetails(accessToken, id) {
        const rc = {success: false, result: null};

        try {
            rc.result = await axios.get(`http://localhost:3000/600/users/${id}`, {
                headers:
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + accessToken
                    }
            });

            rc.success = true;
            rc.result.data.password = '-- zeer geheim --';

            return (rc);
        } catch (e) {
            rc.result = e.response.data;

            return (rc);
        }
    }

    async function login() {
        //return true (or false) when logged in, so this can be acted upon at form submit
        //random success guaranteed
        //const validAccount = ((Math.random() * 10) & 1) ? true : false;

        // get JWT token, if available
        const JWT = localStorage.getItem('token');
        if (JWT) {
            const decodedToken = jwtDecode(JWT);

            setLoggedIn({
                    ...loggedIn,
                    loggedIn: true,
                    user: decodedToken.email,
                }
            );


            const rc = await getUserDetails(JWT, decodedToken.sub);

            if (rc.success) {
                // user details has following fields:
                // email, username, password (bcrypted) and id.

                const status = {
                    ...loggedIn,
                    userDetails: rc.result.data,
                    user: rc.result.data.username,
                    loggedIn: true,
                    loginReady: true,
                };
                setLoggedIn(status);
            } else {
                const status = {
                    ...loggedIn,
                    loggedIn: false,
                    user: null,
                    userDetails: null,
                    loginReady: true,
                };
                setLoggedIn(status);
            }

        } else {
            const status = {
                ...loggedIn,
                loggedIn: false,
                user: null,
                userDetails: null,
                loginReady: true,
            };
            setLoggedIn(status);
        }
        return (loggedIn);
    }

    function logout() {
        setLoggedIn({...loggedIn, loggedIn: false, userDetails: null, loginReady: true});
        localStorage.removeItem('token');
    }

    autStatus.current = {
        ...loggedIn,
        login: login,
        logout: logout,
    };

    return (
        <>
            {loggedIn.loginReady ?
                <AuthContext.Provider value={autStatus.current}>
                    {children}
                </AuthContext.Provider>
                : <p>Loading...{loggedIn.loginReady ? "true" : "false"}</p>
            }
        </>

    );

}

export default AuthContextProvider;

