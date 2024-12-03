import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./Auth/AuthContext";
import Logout from "./Auth/Logout";

const MainNavigation = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">메인</Link>
                </li>
                {!isLoggedIn && (
                    <>
                        <li>
                            <Link to="/signup">회원가입</Link>
                        </li>
                        <li>
                            <Link to="/login">로그인</Link>
                        </li>
                    </>
                )}
                {isLoggedIn && (
                    <li>
                        <Logout />
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default MainNavigation;
