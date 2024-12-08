import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth/AuthContext";

const MainNavigation = () => {
    const { auth, logout } = useAuth();

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">메인</Link>
                </li>
                {!auth?.token && (
                    <>
                        <li>
                            <Link to="/signup">회원가입</Link>
                        </li>
                        <li>
                            <Link to="/login">로그인</Link>
                        </li>
                    </>
                )}
                {auth?.token && (
                    <>
                        <li>
                            <Link to="/dashboard">대시보드</Link>
                        </li>
                        <li>
                            <button onClick={logout}>로그아웃</button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default MainNavigation;
