import React, { createContext, useState } from "react";
import { login as apiLogin } from "../api/api"; // 로그인 API 함수 호출
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 함수
    const login = async (userId, password) => {
        try {
            const token = await apiLogin(userId, password);
            setIsLoggedIn(true); // 로그인 상태를 true로 변경
            return token; // 토큰 반환
        } catch (error) {
            console.error("로그인 중 오류:", error);
            throw error;
        }
    };

    // 로그아웃 함수
    const logout = () => {
        setIsLoggedIn(false); // 로그인 상태를 false로 변경
        delete axios.defaults.headers.common["Authorization"]; // 헤더에서 토큰 제거
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
