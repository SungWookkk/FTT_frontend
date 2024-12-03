import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthProvider from "./Auth/AuthContext";
import MainNavigation from "./MainNavigation";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";

const Home = () => <h1>Home</h1>;

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <MainNavigation />
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/signup" component={Signup} />
                        <Route path="/login" component={Login} />
                    </Switch>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
