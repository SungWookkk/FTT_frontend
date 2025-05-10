import React, { useState, useEffect } from "react";
import axios from "axios";
import "../statistics/css/StatisticsContentPage.css";
import {useAuth} from "../../Auth/AuthContext";
import StatisticsBarChart from "./StatisticsBarChart";

const StatisticsContentPage = () => {
    const { auth } = useAuth();
    const token = auth?.token;
    // 1) 카드 요약용 데이터
    const [overviewData, setOverviewData] = useState([]);
    // 2) 바 차트용 월별 값
    const [monthlyData, setMonthlyData] = useState([]);
    // 3) 전체 사용자 통계
    const [taskStats, setTaskStats] = useState({
        totalTasks: "",
        activeTasks: "",
        completionRate: ""
    });


    useEffect(() => {
        if (!token) return; // 로그인 전엔 호출하지 않음

        // 1) 카드형 개요
        axios.get("/api/statistics/overview", {
                 headers: { Authorization: `Bearer ${auth.token}` }
           })
            .then(res => setOverviewData(res.data))
            .catch(err => console.error("overview 에러:", err));

        // 2) 월별 차트
           axios.get("/api/statistics/monthly", {
                 headers: { Authorization: `Bearer ${auth.token}` }
           })
            .then(res => setMonthlyData(res.data))
            .catch(err => console.error("monthly 에러:", err));

        // 3) 전체 task 통계
           axios.get("/api/statistics/users", {
                 headers: { Authorization: `Bearer ${auth.token}` }
           })
            .then(res => {
                const { totalTasks, activeTasks, completionRate } = res.data;
                setTaskStats({
                    totalTasks: `${totalTasks}개`,
                    activeTasks: `${activeTasks}개`,
                    completionRate: `${completionRate.toFixed(1)}%`
                });
            })

               .catch(err => console.error("users 에러:", err));
    }, [auth.token, token]);

    return (
        <div className="dashboard-content">
            {/* ─────────── 대시보드 헤더 ─────────── */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">통계</span>
                </div>
            </div>

            {/* ─────────── 알림 배너 ─────────── */}
            <div className="alert-banner">
                <p className="alert-text">
                    <span className="normal-text">통계 페이지에서 </span>
                    <span className="highlight-text">지금까지의 작업에 대한 통계를</span>
                    <span className="normal-text">를 확인하고, 목표를 위해 </span>
                    <span className="highlight-text">보완점을 </span>
                    <span className="normal-text">찾아봐요!</span>
                </p>
            </div>

            <div className="all-statisics-container">
                {/* ─────────── 카드 요약 영역 ─────────── */}
                <div className="statistics-cards">
                    <p className="cards-section-title">데이터 통계</p>
                    <div className="info-underline1" />
                    {overviewData.map((c, idx) => (
                        <div key={idx} className="stat-card">
                            <p className="card-title">{c.title}</p>
                            <p className="card-value">{c.value}</p>
                            {c.subtitle && <p className="card-subtitle">{c.subtitle}</p>}
                            <div className="card-line-chart">
                                <div className="line-chart-path" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 바 차트 영역 */}
                <StatisticsBarChart data={monthlyData} />

                {/* ─────────── 전체 사용자 통계 섹션 ─────────── */}

                <div className="user-stats-container">
                <div className="user-stats-section">
                    <p className="cards-section-title">전체 사용자 통계</p>
                    <div className="user-stats-underline" />
                    <div className="user-stats-cards">
                        <div className="stat-card">
                            <p className="card-title">전체 과제 수</p>
                            <p className="card-value">{taskStats.totalTasks}</p>
                            <div className="card-line-chart">
                                <div className="line-chart-path" />
                            </div>
                        </div>
                        <div className="stat-card">
                            <p className="card-title">한 달간 과제 수</p>
                            <p className="card-value">{taskStats.activeTasks}</p>
                            <div className="card-line-chart">
                                <div className="line-chart-path" />
                            </div>
                        </div>
                        <div className="stat-card">
                            <p className="card-title">평균 완료율</p>
                            <p className="card-value">{taskStats.completionRate}</p>
                            <div className="card-line-chart">
                                <div className="line-chart-path" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default StatisticsContentPage;
