// src/Auth/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // 로컬스토리지에서 뱃지 복원
    const storedActiveBadge = localStorage.getItem("activeBadge");
    const initialActiveBadge =
        !storedActiveBadge || storedActiveBadge === "undefined"
            ? null
            : JSON.parse(storedActiveBadge);

    const [auth, setAuth] = useState({
        token: localStorage.getItem("token"),           // 토큰
        userName: localStorage.getItem("userName"),     // 사용자 이름
        userId: localStorage.getItem("userId"),         // 사용자 ID
        userRole: localStorage.getItem("userRole"),     // 역할
        profileImage: localStorage.getItem("profileImage"), // 프로필 URL
        activeBadge: initialActiveBadge,                // 활성 뱃지
        teams: [],                                      // 내가 속한 팀 ID 리스트
        presence: {},
    });

    // 1) 토큰/유저아이디가 세팅되면 내가 속한 팀 목록을 불러와 auth.teams 에 저장
    useEffect(() => {
        if (!auth.token || !auth.userId) return;

        const fetchTeams = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/teams/user/${auth.userId}`,
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
                const teamIds = res.data.map((t) => t.id);
                setAuth((a) => ({ ...a, teams: teamIds }));
            } catch (e) {
                console.error("팀 목록 불러오기 실패:", e);
            }
        };
        fetchTeams();
    }, [auth.token, auth.userId]);

    // 2) PresenceManager 에서 호출할 수 있도록, 특정 팀의 onlineId 목록을 저장하는 헬퍼
    const updatePresence = (teamId, onlineIds) => {
        setAuth((a) => ({
            ...a,
            presence: { ...a.presence, [teamId]: onlineIds },
        }));
    };

    // 3) 로그인
    const login = async (userId, password) => {
        const response = await axios.post("http://localhost:8080/api/auth/login", {
            userId,
            password,
        });
        const { token, userName, userId: id, userRole, profileImage, activeBadge } =
            response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userId", id);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("profileImage", profileImage);
        localStorage.setItem(
            "activeBadge",
            activeBadge ? JSON.stringify(activeBadge) : "null"
        );

        setAuth({
            token,
            userName,
            userId: id,
            userRole,
            profileImage,
            activeBadge,
            teams: [],
            presence: {},
        });
    };

    // 5) 소셜 로그인 전용 세팅
    const loginWithSocial = ({
                                 token,
                                 userName,
                                 userId,
                                 userRole,
                                 profileImage,
                                 activeBadge,
                             }) => {
        // 필드명을 똑같이 맞춰서 로컬스토리지에 저장
        localStorage.setItem("token", token);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("profileImage", profileImage);
        localStorage.setItem(
            "activeBadge",
            activeBadge ? JSON.stringify(activeBadge) : "null"
        );

        // Context state 갱신
        setAuth({
            token,
            userName,
            userId,
            userRole,
            profileImage,
            activeBadge,
            teams: [],
            presence: {},
        });
    };


    // 4) 로그아웃
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("profileImage");
        localStorage.removeItem("activeBadge");
        setAuth({
            token: null,
            userName: null,
            userId: null,
            userRole: null,
            profileImage: null,
            activeBadge: null,
            teams: [],
            presence: {},
        });
    };

    // 5) 뱃지 업데이트
    const updateActiveBadge = (badge) => {
        localStorage.setItem("activeBadge", JSON.stringify(badge));
        setAuth((a) => ({ ...a, activeBadge: badge }));
    };


    return (
        <AuthContext.Provider
            value={{ auth, login, logout, updateActiveBadge, updatePresence,  loginWithSocial }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
