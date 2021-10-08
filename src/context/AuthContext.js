import React, {useState} from 'react';

export const AuthContext = React.createContext({});

function AuthContextProvider({children}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState(null);

    function login(userEmail) {
        //return true (or false) when logged in, so this can be acted upon at form submit
        //random success guaranteed
        const validAccount = ((Math.random() * 10) & 1) ? true : false;

        if (validAccount) {
            setLoggedIn(true);
            setEmail(userEmail);
            console.log(`Gebruiker ${userEmail} logt nu in`);
        } else {
            console.log('Not logged in, invalid user/password');
        }
        return (validAccount);
    }

    function logout() {
        console.log(`Gebruiker ${email} logt nu uit`);
        setLoggedIn(false);
        setEmail(null);
    }

    return (
        <AuthContext.Provider
            value={{
                login: login,
                logout: logout,
                isLoggedIn: loggedIn,
                user: email,
            }}
        >
            {children}
        </AuthContext.Provider>
    );


}

export default AuthContextProvider;

