import React, {useContext, useEffect} from 'react';
import logo from '../assets/banana-01.png';
import { useHistory, Link } from 'react-router-dom';
import {AuthContext} from "../context/AuthContext";

function NavBar() {
  const history = useHistory();
  let { logout, loggedIn, user } = useContext( AuthContext );

  console.log( 'navbar logged in? ', loggedIn );
  console.log( ( { logout, loggedIn, user } =useContext( AuthContext)) );
  console.log('end navbar logged in ', );

  return (
    <nav>

        <Link to="/">
          <span className="logo-container">
            <img src={logo} alt="logo"/>
            <h3>
              Banana Security
            </h3>
          </span>
        </Link>

      <div>
          {!loggedIn &&
              <>
              <button
                  type="button"
                  onClick={() => history.push('/signin')}
              >
                  Log in
              </button>
                  <button
                  type="button"
                  onClick={() => history.push('/signup')}
                  >
                  Registreren
              </button>
              </>
          }
          {loggedIn &&
              <>
              <p className="littlewhite">Logged in as {user}</p>
              <button
                  type="button"
                  onClick={() => {
                      logout();
                      history.push('/');
                  }}
              >
                  Log out
              </button>
              </>
          }
      </div>
    </nav>
  );
}

export default NavBar;