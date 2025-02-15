import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthContext";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import MainNavigation from "./MainNavigation";
import "./App.css";
import CommunityBestPosts from "./components/community/CommunityBestPosts";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <MainNavigation/>
                <div className="app-container">
                    <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/signup" component={Signup}/>
                        <Route path="/dashboard" component={Dashboard}/>
                        <Route path="/community" component={CommunityBestPosts}/>
                        <Route path="/dasboard" component={Dashboard}/>
                    </Switch>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
