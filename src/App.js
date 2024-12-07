import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AuthProvider, { AuthContext } from "./Auth/AuthContext";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import MainNavigation from "./MainNavigation";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <header>
                    <MainNavigation />
                </header>
                <Switch>
                    <Route exact path="/">
                        <HomeRedirect />
                    </Route>
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <PrivateRoute path="/dashboard">
                        <Dashboard />
                    </PrivateRoute>
                </Switch>
            </Router>
        </AuthProvider>
    );
};

// 로그인 상태에 따라 홈 경로 리다이렉트
const HomeRedirect = () => {
    const { isLoggedIn } = React.useContext(AuthContext);
    return <Redirect to={isLoggedIn ? "/dashboard" : "/login"} />;
};

// 보호된 경로 설정
const PrivateRoute = ({ children, ...rest }) => {
    const { isLoggedIn } = React.useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={() =>
                isLoggedIn ? children : <Redirect to="/login" />
            }
        />
    );
};

export default App;
