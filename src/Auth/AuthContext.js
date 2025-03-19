import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// AuthContext 생성
const AuthContext = createContext();

// AuthContext를 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
    // 초기 상태를 localStorage에서 불러옴
    const [auth, setAuth] = useState({
        token: localStorage.getItem("token"), // 토큰 값
        userName: localStorage.getItem("userName"), // 사용자 이름
        userId: localStorage.getItem("userId"), // 사용자 ID
        userRole: localStorage.getItem("userRole"), // 사용자 역할
    });

    // 로그인 함수
    const login = async (userId, password) => {
        try {
            // 서버로 로그인 요청
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                userId,
                password,
            });

            // 서버 응답에서 필요한 데이터 추출
            const { token, userName, userId: id, userRole } = response.data;
            localStorage.setItem("userId", userId); // userId 저장
            // localStorage에 인증 정보 저장
            localStorage.setItem("token", token);
            localStorage.setItem("userName", userName);
            localStorage.setItem("userId", id);
            localStorage.setItem("userRole", userRole);

            // 인증 상태 업데이트
            setAuth({ token, userName, userId: id, userRole });
        } catch (error) {
            console.error("로그인 오류:", error.response || error.message); // 오류 로그 출력
            throw new Error("아이디 또는 비밀번호가 올바르지 않습니다."); // 사용자에게 표시할 에러 메시지
        }
    };

    // 로그아웃 함수
    const logout = () => {
        // localStorage에서 인증 정보 제거
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");

        // 인증 상태 초기화
        setAuth({ token: null, userName: null, userId: null, userRole: null });
    };

    return (
        // AuthContext Provider로 상태와 함수 전달
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
