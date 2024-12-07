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
            setIsLoggedIn(true); // 로그인 상태 업데이트
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Axios 헤더 설정
            return token;
        } catch (error) {
            console.error("로그인 중 오류:", error.message);
            throw error;
        }
    };

    // 로그아웃 함수
    const logout = () => {
        setIsLoggedIn(false);
        delete axios.defaults.headers.common["Authorization"]; // Axios 헤더에서 토큰 제거
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
