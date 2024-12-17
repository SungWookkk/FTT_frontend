import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthContext";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import MainNavigation from "./MainNavigation";
import Sidebar from "./components/dashboard/Sidebar";
import Header from "./components/Header";
import "./App.css";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <MainNavigation />
                <div className="app-container">
                    {/* Sidebar */}
                    <Sidebar />

                    <div className="main-content">
                        {/* Header */}
                        <Header />

                        {/* Routes */}
                        <Switch>
                            <Route exact path="/" component={Login} />
                            <Route path="/login" component={Login} />
                            <Route path="/signup" component={Signup} />
                            <Route path="/dashboard" component={Dashboard} />
                        </Switch>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
