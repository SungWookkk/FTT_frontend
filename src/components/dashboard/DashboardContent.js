import React, { useEffect, useState } from "react";
import "./css/DashboardContent.css";
// 프로필 이미지는 임시로 유지
import defaultUser from "../../Auth/css/img/default-user.svg";
// 두 매핑 객체 import
import { badgeImages, badgeNameMapping } from "../badge/badgeNameMapping";

import axios from "axios";
import { useLocation } from "react-router-dom";
import CalendarSection from "./CalendarSection"; // 달력 컴포넌트
import { useAuth } from "../../Auth/AuthContext";
import BadgeProgress from "./BadgeProgress";

const DashboardContent = () => {
    const { auth } = useAuth();
    const [username, setUsername] = useState("");
    const [allTasks, setAllTasks] = useState([]);
    const [userBadges, setUserBadges] = useState([]); // 여러 뱃지 가능
    const [profileImage, setProfileImage] = useState("");
    const location = useLocation();
    const [allBadges, setAllBadges] = useState([]);

    useEffect(() => {
        // 로그인 시 localStorage에 저장한 username 불러오기
        const storedUsername = localStorage.getItem("userName");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // ---------------------- 프로필 이미지 불러오기 ------------------------
    useEffect(() => {
        if (auth) {
            setUsername(auth.userName);
            setProfileImage(auth.profileImage);
        }
    }, [auth]);

    // ---------------------- 전체 뱃지 목록 API 호출 ------------------------
    useEffect(() => {
        axios
            .get("/api/badges")
            .then((res) => {
                setAllBadges(res.data);
                console.log(allBadges);
            })
            .catch((err) => console.error(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 빈 배열

    // ---------------------- 백엔드에서 Task 목록 가져오기 ----------------------
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        axios
            .get("/api/tasks/my-tasks", {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId },
            })
            .then((response) => {
                const tasksData = Array.isArray(response.data)
                    ? response.data
                    : response.data.tasks;
                setAllTasks(tasksData);
            })
            .catch((error) => {
                console.error("Task 목록 불러오기 실패:", error);
            });
    }, [location.pathname]);

    // ---------------------- 백엔드에서 뱃지 목록 가져오기 ----------------------
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId"); // DB PK(숫자)로 가정

        if (storedUserId && token) {
            axios
                .get(`/api/user-badges/${storedUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    console.log("UserBadges => ", res.data);
                    setUserBadges(res.data);
                })
                .catch((err) => {
                    console.error("사용자 뱃지를 가져오는데 실패했습니다:", err);
                });
        }
    }, []);

    // ---------------------- 마감 임박 & 남은 ToDo 분류 ----------------------
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const threeDays = 3 * 24 * 60 * 60 * 1000;

    // 마감 임박
    const dueSoonTasks = allTasks.filter((task) => {
        if (task.status === "DONE") return false;
        if (!task.dueDate) return false;
        return new Date(task.dueDate) - now <= threeDays && new Date(task.dueDate) - now >= 0;
    });

    // 남은 To Do
    const todoTasks = allTasks.filter((task) => {
        if (task.status === "DONE") return false;
        const isDueSoon = dueSoonTasks.some((ds) => ds.id === task.id);
        return !isDueSoon;
    });

    // D-Day 계산
    const calculateDday = (dueDate) => {
        if (!dueDate) return "마감일 없음";
        const target = new Date(dueDate);
        target.setHours(0, 0, 0, 0);
        const diff = Math.floor((target - now) / (1000 * 60 * 60 * 24));
        if (diff > 0) return `D-${diff}`;
        if (diff === 0) return "D-Day";
        return `D+${Math.abs(diff)}`;
    };

    // ---------------------------
    // 사용자 뱃지 정렬 및 현재 뱃지 결정
    // ---------------------------
// auth.activeBadge가 존재하면 우선 표시, 없으면 userBadges 중 정렬된 첫 번째 사용
    const sortedUserBadges = [...userBadges].sort((a, b) => {
        const tA = a.badge?.completionThreshold ?? 0;
        const tB = b.badge?.completionThreshold ?? 0;
        return tB - tA;
    });
    const highestUserBadge = sortedUserBadges[0] || null;
    const activeBadgeFromAuth =
        auth && auth.activeBadge && auth.activeBadge.badgeName
            ? auth.activeBadge
            : null;
    const currentBadge = activeBadgeFromAuth || (highestUserBadge ? highestUserBadge.badge : null);
    const currentBadgeName = currentBadge ? currentBadge.badgeName : null;
    const currentBadgeImg = currentBadgeName ? badgeImages[currentBadgeName] : null;
    const displayName = currentBadgeName ? badgeNameMapping[currentBadgeName] : null;


    // ---------------------- 렌더링 ----------------------
    return (
        <div className="dashboard-content">
            {/* 대시보드 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">대시보드</span>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text">
                    <span className="normal-text">대시보드에서</span>
                    <span className="highlight-text"> 통계 </span>
                    <span className="normal-text">를 확인해 일, 주, 월에 대한 </span>
                    <span className="highlight-text">작업 현황과 시각화 </span>
                    <span className="normal-text">데이터로</span>
                    <span className="highlight-text"> 완료율, 미루기 비율 </span>
                    <span className="normal-text">등을 </span>
                    <span className="highlight-text">확인 </span>
                    <span className="normal-text">해 보아요!</span>
                </p>
            </div>

            {/* 메인 작업 컨테이너 */}
            <div className="info-title">{username} 님의 정보</div>
            <div className="info-underline"></div>
            <div className="main-task-container">
                {/* 좌측 - 사용자 정보 및 진행률 */}
                <div className="user-info-box">
                    <div className="info-header">
                        <div className="profile-container">
                            <img
                                className="profile-img"
                                src={profileImage || defaultUser}
                                alt="프로필 이미지"
                            />
                            <span className="user-name">
                <strong>{username || "닉네임 미등록"}</strong>
              </span>
                        </div>
                        <span className="user-text">님의 현재 뱃지 등급은</span>

                        {/* 뱃지 아이콘 (백엔드에서 가져온 badgeName → 로컬 SVG) */}
                        <div className="badge-icon" style={{ marginLeft: "8px" }}>
                            {currentBadgeImg && (
                                <img
                                    src={currentBadgeImg}
                                    alt={displayName}
                                    style={{ width: "55px", height: "55px" }}
                                />
                            )}
                        </div>
                        <span className="badge-text">
              {displayName ? displayName : "뱃지 없음"} 입니다.
            </span>
                    </div>
                        <BadgeProgress/>
                </div>

                {/* 우측 - 두 섹션 (마감 임박 / 남은 To Do) */}
                <div className="task-sections1">
                    {/* ⏳ 마감 임박 */}
                    <div className="task-section">
                        <div
                            className="section-header"
                            style={{ borderBottom: "5px solid #e74c3c" }}
                        >
                            <div className="section-header-content">
                                <span className="section-title">⏳ 마감 임박</span>
                            </div>
                        </div>
                        <div className="task-list">
                            {dueSoonTasks.length === 0 ? (
                                <p className="task-desc1">Task를 생성해 일정을 관리해봐요!</p>
                            ) : (
                                dueSoonTasks.slice(0, 2).map((task) => (
                                    <div className="task-card1" key={task.id}>
                                        <div className="task-content">
                                            <div className="task-name">{task.title}</div>
                                            <div
                                                className="task-desc1"
                                                dangerouslySetInnerHTML={{ __html: task.description }}
                                            />
                                        </div>
                                        <div className="task-deadline">
                                            {calculateDday(task.dueDate)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 🔥 남은 To Do */}
                    <div className="task-section">
                        <div
                            className="section-header"
                            style={{ borderBottom: "5px solid #3498db" }}
                        >
                            <div className="section-header-content">
                                <span className="section-title">🔥 남은 To Do</span>
                            </div>
                        </div>
                        <div className="task-list">
                            {todoTasks.length === 0 ? (
                                <p className="task-desc1">Task를 생성해 일정을 관리해봐요!</p>
                            ) : (
                                todoTasks.slice(0, 2).map((task) => (
                                    <div className="task-card1" key={task.id}>
                                        <div className="task-content">
                                            <div className="task-name1">{task.title}</div>
                                            <div
                                                className="task-desc1"
                                                dangerouslySetInnerHTML={{ __html: task.description }}
                                            />
                                        </div>
                                        <div className="task-deadline">
                                            {calculateDday(task.dueDate)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* 달력 컴포넌트 */}
                <CalendarSection />
            </div>
        </div>
    );
};

export default DashboardContent;
