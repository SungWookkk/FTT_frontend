import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import AuthProvider, { AuthContext } from "./Auth/AuthContext";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <header>
                    <NavBar />
                </header>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                </Switch>
            </Router>
        </AuthProvider>
    );
};

const Home = () => <h1>Home</h1>;

const NavBar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext); // 로그인 상태 및 로그아웃 함수 가져오기

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">메인</Link>
                </li>
                {isLoggedIn ? (
                    <li>
                        <button onClick={logout}>로그아웃</button>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to="/signup">회원가입</Link>
                        </li>
                        <li>
                            <Link to="/login">로그인</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default App;
