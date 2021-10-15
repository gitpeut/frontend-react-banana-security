import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";
import {useForm} from "react-hook-form";
import axios from "axios";

function SignIn() {
    // import relevanet hook-form functions and set initial values to empty
    const {register, handleSubmit, formState: {errors}} = useForm({
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [loginError, setLoginError] = useState(null);
    const {loggedIn, login} = useContext(AuthContext);
    const history = useHistory();

    async function postLogin( email, password ){
        const rc =  {success: false, JWT: null, result: null};
        try{
            rc.result = await axios.post( "http://localhost:3000/login", { email: email, password: password} );

            rc.success = true;
            console.log( rc.result);
            localStorage.setItem('token', rc.result.data.accessToken );

            return( rc );
        }catch(e){
            rc.result = e.response.data;
            return ( rc );
        }
    }

    async function validateSubmit(data) {
        console.log(`Starting login for ${data.email}`);
        const rc = await postLogin( data.email, data.password);
        if ( rc.success) {
            console.log('signin - login ok');
            await login();
            console.log('signin - go to profile');
            history.push('/profile');
        } else {
            console.log('signin - login failed');
            setLoginError(rc.result);
        }
    }

    return (
        <>
            <h1>Inloggen</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id
                molestias qui quo unde?</p>

            {!loggedIn &&
            <form onSubmit={handleSubmit(validateSubmit)}>

                <label htmlFor="email">email
                    <input
                        type="email"
                        {...register("email", {
                            required: "email adres is verplicht",
                        })
                        }
                        id="email"
                    />
                    {errors.email && <p className="littlered">{errors.email.message}</p>}
                </label>

                <label htmlFor="password">password
                    <input
                        type="password"
                        {...register("password", {
                            required: "password is verplicht"
                        })
                        }
                        id="password"
                    />
                    {errors.password && <p className="littlered">{errors.password.message}</p>}
                </label>

                <button type="submit">
                    Inloggen
                </button>
                {loginError && <p className="littlered">{loginError}</p>}
            </form>
            }

            {loggedIn &&
            <p> U bent al ingelogd. Log eerst uit als u opnieuw wilt inloggen.</p>
            }

            <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
        </>
    );
}

export default SignIn;