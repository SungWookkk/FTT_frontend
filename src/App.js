import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";

const App = () => {
    return (
        <Router>
            <MainNavigation />
            <main>
                <Switch>
                    <Route path="/" exact>
                        <h1>Welcome to the Appnnn</h1>
                    </Route>
                    <Route path="/signup" component={Signup} />
                    <Route path="/login" component={Login} />
                </Switch>
            </main>
        </Router>
    );
};

export default App;
