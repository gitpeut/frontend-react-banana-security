import React, {useContext, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import {useForm} from "react-hook-form";
import axios from "axios";
import jwtDecode from "jwt-decode";

import entropy from "../helpers/entropy";
import matchEmail from "../helpers/matchEmail";

function SignUp() {
    const [submitMessage, setSubmitMessage] = useState(null);
    const {login} = useContext(AuthContext);
    const history = useHistory();
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: "onBlur", // update errors when field goes out of focus
        defaultValues: {
            email: "",
            password: "",
            username: "",
        },
    });

    async function postRegistration( data ){
        const rc =  {success: false, JWT: null, result: null};
        try{

            rc.result = await axios.post( "http://localhost:3000/register", data );

            rc.success = true;
            console.log( rc.result);
            localStorage.setItem('token', rc.result.data.accessToken );

            const decodedToken = jwtDecode( rc.result.data.accessToken );
            console.log( 'decoded Token : ', decodedToken );

            return( rc );
        }catch(e){
            rc.result = e.response.data;
            return ( rc );
        }
    }


    async function validateSubmit(data) {
        let message = '';
        if (!matchEmail(data.email)) {
            message = 'Email adres is ongeldig';
        }

        if (entropy(data.password) < 0) { // minimal 3, now set to 0 for testing purposes
            message += (message === '') ? 'Het password is te zwak' : ' en het password is te zwak';
        }
        if (message !== '') {
            setSubmitMessage(message);
        } else {
            const rc = await postRegistration( {
               email:    data.email,
               password: data.password,
               username: data.username,
            });

            setSubmitMessage(rc.success?'U bent geregistreerd': rc.result );

            if ( rc.success ) {
                console.log( "Success!");
                login();
                history.push('/profile');
            }
        }
    }


    return (
        <>
            <h1>Registreren</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur atque consectetur, dolore eaque
                eligendi
                harum, numquam, placeat quisquam repellat rerum suscipit ullam vitae. A ab ad assumenda, consequuntur
                deserunt
                doloremque ea eveniet facere fuga illum in numquam quia reiciendis rem sequi tenetur veniam?</p>

            <form onSubmit={handleSubmit(validateSubmit)}>
                <label htmlFor="email">email
                    {/*Type to email, supplies a rough test on email address validity in the browser*/}
                    <input

                        type="email"
                        {...register("email", {
                                required: "email is een verplicht veld",
                                minLength: {
                                    value: 6,
                                    message: "email adres moet minstens 6 tekens bevatten",
                                }
                            },
                        )}
                        id="email"
                    />
                    {errors.email && <p className="littlered">{errors.email.message}</p>}
                </label>

                <label htmlFor="password">password
                    <input
                        type="password"
                        {...register("password", {
                                required: "password is een verplicht veld",
                                minLength: {
                                    value: 8,
                                    message: "password moet minstens 8 tekens bevatten",
                                }
                            },
                        )}

                        id="password"
                    />
                    {errors.password && <p className="littlered">{errors.password.message}</p>}
                </label>

                <label htmlFor="username">gebruikersnaam
                    <input
                        type="text"
                        {...register("username", {
                                required: "username is een verplicht veld",
                                minLength: {
                                    value: 4,
                                    message: "username moet minstens 4 tekens bevatten",
                                }
                            },
                        )}

                        id="username"
                    />
                    {errors.username && <p className="littlered">{errors.username.message}</p>}
                </label>

                <button type="submit" id="submit">
                    Registreren
                </button>
                {submitMessage && <p className="littlered">{submitMessage}</p>}
            </form>
            <p>Heb je al een account? Je kunt je <Link to="/signin">hier</Link> inloggen.</p>
        </>
    );
}

export default SignUp;