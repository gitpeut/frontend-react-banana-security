import React, {useContext} from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Profile from './pages/Profile';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import './App.css';
import PrivateRoute from "./components/PrivateRoute";
import {AuthContext} from "./context/AuthContext";

function App() {
  const {isLoggedIn} = useContext(AuthContext);

  return (
    <>
      <NavBar />
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
             <PrivateRoute path="/profile" isAuthenticated={isLoggedIn}>
                <Profile/>
             </PrivateRoute>
          <Route exact path="/signin">
            <SignIn />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
