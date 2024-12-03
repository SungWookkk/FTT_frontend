import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const Logout = () => {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        alert("로그아웃 했습니다.");
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
