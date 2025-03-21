import React, {useEffect, useState} from "react";
import "./css/DashboardContent.css";
import badge from "../../Auth/css/img/badge_design/Badge_01.svg";
import {useLocation} from "react-router-dom";
import axios from "axios";

import CalendarContainer from "./CalendarSection";
import CalendarSection from "./CalendarSection"; // 달력 컴포넌트 임포트
const DashboardContent = () => {

    const [username, setUsername] = useState("");
    const [allTasks, setAllTasks] = useState([]);
    const location = useLocation();


    useEffect(() => {
        // 로그인 시 localStorage에 저장한 username 불러오기
        const storedUsername = localStorage.getItem("userName");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

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

                // allTasks 상태에 저장
                setAllTasks(tasksData);
            })
            .catch((error) => {
                console.error("Task 목록 불러오기 실패:", error);
            });
    }, [location.pathname]);

    // ---------------------- 마감 임박 & 남은 ToDo 분류 ----------------------
    // 3일 이하 남은 것을 "마감 임박"으로 간주
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const threeDays = 3 * 24 * 60 * 60 * 1000;

    // 마감 임박 (status !== 'DONE' + dueDate가 3일 이하 남음)
    const dueSoonTasks = allTasks.filter((task) => {
        if (task.status === "DONE") return false;
        if (!task.dueDate) return false;
        return new Date(task.dueDate) - now <= threeDays && new Date(task.dueDate) - now >= 0;
    });

    // 남은 To Do (status !== 'DONE' 이면서, 마감임박 아닌 것)
    const todoTasks = allTasks.filter((task) => {
        if (task.status === "DONE") return false;
        // 이미 dueSoonTasks로 분류된 건 제외
        const isDueSoon = dueSoonTasks.some((ds) => ds.id === task.id);
        return !isDueSoon;
    });

    // ---------------------- D-Day 계산 함수 ----------------------
    const calculateDday = (dueDate) => {
        if (!dueDate) return "마감일 없음";
        const target = new Date(dueDate);
        target.setHours(0, 0, 0, 0);
        const diff = Math.floor((target - now) / (1000 * 60 * 60 * 24));
        if (diff > 0) return `D-${diff}`;
        if (diff === 0) return "D-Day";
        return `D+${Math.abs(diff)}`;
    };

    // **2개만 표시**하도록 slice(0, 2)
    const dueSoonToShow = dueSoonTasks.slice(0, 2);
    const todoToShow = todoTasks.slice(0, 2);


    return (
        <div className="dashboard-content">
            {/* 대시보드 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">대시보드</span>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner">
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
                        <img className="profile-img" src={badge} alt="프로필 이미지"/>
                        <span className="user-name"><strong>{username}</strong></span>
                        </div>
                        <span className="user-text">님의 현재 뱃지 등급은</span>
                        <div className="badge-icon"></div>
                        <span className="badge-text">입니다.</span>
                    </div>
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                        <div className="progress-labels">
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                        </div>
                    </div>
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
                            {dueSoonToShow.length === 0 ? (
                                <p className="task-desc1">Task를 생성해 일정을 관리해봐요!</p>
                            ) : (
                                dueSoonToShow.map((task) => (
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
                            {todoToShow.length === 0 ? (
                                <p className="task-desc">Task를 생성해 일정을 관리해봐요!</p>
                            ) : (
                                todoToShow.map((task) => (
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

                {/*이 하위에 피그마 디자인 추출한 달력 넣을 것 */}
                <CalendarSection/>

            </div>
        </div>
    );
};

export default DashboardContent;
