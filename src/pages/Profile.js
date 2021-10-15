import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import axios from "axios";

function Profile() {
    const {loggedIn, userDetails} = useContext(AuthContext);
    let [secretData, setSecretData] = useState({});

    useEffect(() => {
        async function waitForSecret() {
            await getUserSecrets();
        }

        waitForSecret();
    }, []);

    async function getUserSecrets() {
        const rc = {success: false, result: null};
        const JWT = localStorage.getItem('token');

        try {
            rc.result = await axios.get(`http://localhost:3000/660/private-content`, {
                headers:
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + JWT
                    }
            });

            rc.success = true;
            setSecretData(rc.result.data);

            return (rc);
        } catch (e) {
            rc.result = e.response.data;
            setSecretData({title: 'Error getting user secret data', content: rc.result});

            return (rc);
        }
    }


    return (
        <>
            {loggedIn &&
            <>
                <h1>Profielpagina</h1>
                <section>
                    <h2>Gegevens</h2>
                    <p><strong>Gebruikersnaam:</strong> {userDetails.username}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                </section>
                <section>
                    <h2>{secretData.title}</h2>
                    <p>{secretData.content}</p>
                </section>
                <p>Terug naar de <Link to="/">Homepagina</Link></p>
            </>
            }
        </>
    );
}

export default Profile;