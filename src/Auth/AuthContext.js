import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const storedActiveBadge = localStorage.getItem("activeBadge");
    const initialActiveBadge =
        !storedActiveBadge || storedActiveBadge === "undefined"
            ? null
            : JSON.parse(storedActiveBadge);

    const [auth, setAuth] = useState({
        token: localStorage.getItem("token"),           // 토큰 값
        userName: localStorage.getItem("userName"),       // 사용자 이름
        userId: localStorage.getItem("userId"),           // 사용자 ID
        userRole: localStorage.getItem("userRole"),       // 사용자 역할
        profileImage: localStorage.getItem("profileImage"), // 프로필 사진 URL
        activeBadge: initialActiveBadge,                  // 활성 뱃지
    });

    // 로그인 함수 (기존 그대로)
    const login = async (userId, password) => {
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                userId,
                password,
            });
            const { token, userName, userId: id, userRole, profileImage, activeBadge } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("userName", userName);
            localStorage.setItem("userId", id);
            localStorage.setItem("userRole", userRole);
            localStorage.setItem("profileImage", profileImage);
            // activeBadge가 undefined인 경우 null로 저장
            localStorage.setItem("activeBadge", activeBadge ? JSON.stringify(activeBadge) : "null");

            setAuth({ token, userName, userId: id, userRole, profileImage, activeBadge });
        } catch (error) {
            console.error("로그인 오류:", error.response || error.message);
            throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    };

    // 로그아웃 함수
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("profileImage");
        localStorage.removeItem("activeBadge");
        setAuth({ token: null, userName: null, userId: null, userRole: null, profileImage: null, activeBadge: null });
    };

    // 활성 뱃지 업데이트 함수
    const updateActiveBadge = (badge) => {
        localStorage.setItem("activeBadge", JSON.stringify(badge));
        setAuth((prev) => ({ ...prev, activeBadge: badge }));
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, updateActiveBadge }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
