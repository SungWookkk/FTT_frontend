import React from "react";
import "../statistics/css/StatisticsContentPage.css";

const CARD_DATA = [
    { title: "작업 처리 평균 시간", value: "4시간 20분" },
    { title: "작성한 작업", value: "2,834개", subtitle: "상위 32%" },
    { title: "완료한 작업", value: "2,149개", subtitle: "상위 15%" },
    { title: "실패한 작업", value: "685개", subtitle: "상위 15%" },
    { title: "작업에 따른 사용자 순위", value: "857위" },
];

const MONTHS = [
    { label: "JAN", value: 100 },
    { label: "FEB", value: 120 },
    { label: "MAR", value: 150 },
    { label: "APR", value: 230 },
    { label: "MAY", value: 260 },
    { label: "JUN", value: 200 },
    { label: "JUL", value: 220 },
    { label: "AUG", value: 140 },
    { label: "SEP", value: 240 },
    { label: "OCT", value: 310 },
    { label: "NOV", value: 360 },
    { label: "DEC", value: 400 },
];

const StatisticsContentPage = () => {
    return (
        <div className="dashboard-content">
            {/* 대시보드 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">통계</span>
                </div>
            </div>

            {/* 알림 배너 */}
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
                    {CARD_DATA.map((c, idx) => (
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

                {/* ─────────── 바 차트 영역 ─────────── */}
                <div className="statistics-container">
                    <div className="statistics-chart">
                        <div className="chart-header">
                            <p className="chart-title">작업 시작 통계</p>
                            <select className="chart-select">
                                <option>Month</option>
                            </select>
                        </div>
                        <div className="bar-chart">
                            {MONTHS.map((m, i) => (
                                <div key={i} className="bar-wrapper">
                                    <div
                                        className="bar"
                                        style={{ height: `${(m.value / 400) * 100}%` }}
                                    />
                                    <span className="bar-label">{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─────────── 전체 사용자 통계 섹션 ─────────── */}
                <div className="user-stats-section">
                    <p className="cards-section-title">전체 사용자 통계</p>
                    <div className="user-stats-underline" />

                    <div className="user-stats-cards">
                        <div className="stat-card">
                            <p className="card-title">전체 사용자 수</p>
                            <p className="card-value">1,234명</p>
                            <div className="card-line-chart">
                                <div className="line-chart-path" />
                            </div>
                        </div>

                        <div className="stat-card">
                            <p className="card-title">월간 활성 사용자</p>
                            <p className="card-value">456명</p>
                            <div className="card-line-chart">
                                <div className="line-chart-path" />
                            </div>
                        </div>

                        <div className="stat-card">
                            <p className="card-title">평균 완료율</p>
                            <p className="card-value">78%</p>
                            <div className="card-line-chart">
                                <div className="line-chart-path" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsContentPage;
