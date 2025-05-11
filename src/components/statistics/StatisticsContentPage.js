import React, {useState, useEffect, useMemo} from "react";
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
    const [dailyData, setDailyData]     = useState([]);
    const [viewBy, setViewBy] = useState("month");
    // 클릭한 “일” 또는 “월” 숫자
    const [selectedX, setSelectedX] = useState(null);
    // 클릭 디테일 (DailyDetailDto or MonthlyDetailDto)
    const [detail, setDetail] = useState(null);

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

        const now = new Date();
        axios
            .get(`/api/statistics/monthly`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setMonthlyData(res.data));
        axios.get(`/api/statistics/daily?year=${now.getFullYear()}&month=${now.getMonth()+1}`, {
            headers :{Authorization: `Bearer ${auth.token}`}
        })
            .then(res => setDailyData(res.data));
    }, [auth.token, token]);

    // 일별/월별 차트용 데이터 보강
    const displayedData = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();

        if (viewBy === "day") {
            // ── Day 뷰: 1일부터 말일까지 ──
            const month = now.getMonth() + 1;
            const daysInMonth = new Date(year, month, 0).getDate();
            const dayValueMap = new Map(
                dailyData.map(d => [ Number(d.label), d.value ])
            );
            return Array.from({ length: daysInMonth }, (_, idx) => {
                const day = idx + 1;
                return {
                    label: String(day),
                    value: dayValueMap.get(day) || 0
                };
            });
        } else {
            const monthMap = new Map(
                monthlyData.map(m => {
                    // 영문 약어 → 숫자(1~12) 매핑
                    const num = new Date(`${m.label} 1, ${year}`).getMonth() + 1;
                    return [num, m.value];
                })
            );
            return Array.from({ length: 12 }, (_, idx) => {
                const mNum = idx + 1;
                return {
                    label: `${mNum}월`,
                    value: monthMap.get(mNum) || 0
                };
            });
        }
    }, [viewBy, dailyData, monthlyData]);

    // 막대 클릭 핸들러
    const handleBarClick = (x) => {
        setSelectedX(x);
        const now = new Date();
        if (viewBy === "day") {
            axios
                .get(
                    `/api/statistics/daily/detail?year=${now.getFullYear()}&month=${now.getMonth()+1}&day=${x}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then(res => setDetail(res.data))
                .catch(console.error);
        } else {
            axios
                .get(
                    `/api/statistics/monthly/detail?year=${now.getFullYear()}&month=${x}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then(res => setDetail(res.data))
                .catch(console.error);
        }
    };


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

                {/* 원본 data 대신 보강된 displayedData 사용 */}
                <StatisticsBarChart
                    data={displayedData}
                    viewBy={viewBy}
                    onViewByChange={setViewBy}
                    onBarClick={handleBarClick}
                />
                {/* ───── 클릭 디테일 영역 ───── */}
                {detail && (
                    <div className="daily-detail-container">
                        <h4>
                            {viewBy === "day"
                                ? `${selectedX}일 작업 상세`
                                : `${selectedX}월 작업 상세`}
                        </h4>

                        <div className="detail-bars">
                            {/* 생성된 Task (100% 배경) */}
                            <div className="detail-bar">
                                <span>{viewBy === "day" ? "생성된 Task" : "생성된 Task"}</span>
                                <div className="bar-bg">
                                    <div className="bar-fill" style={{ width: "100%" }} />
                                </div>
                                <strong>{detail.total}개</strong>
                            </div>

                            {/* 완료 비율 */}
                            <div className="detail-bar">
                                <span>완료</span>
                                <div className="bar-bg">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width:
                                                detail.total > 0
                                                    ? `${(detail.completed / detail.total) * 100}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                                <strong>{detail.completed}개</strong>
                            </div>

                            {/* 실패 비율 */}
                            <div className="detail-bar">
                                <span>실패</span>
                                <div className="bar-bg">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width:
                                                detail.total > 0
                                                    ? `${(detail.failed / detail.total) * 100}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                                <strong>{detail.failed}개</strong>
                            </div>
                        </div>
                    </div>
                )}


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
