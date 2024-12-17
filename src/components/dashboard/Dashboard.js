import React from "react";
import "../css/Dashboard.css";
import Sidebar from "./Sidebar";

const Dashboard = () => {
    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                {/* 오늘의 작업 섹션 */}
                <section className="today-tasks">
                    <h2 className="section-title">오늘의 작업!</h2>
                    <div className="task-highlight-bar"></div> {/* 녹색 하이라이트 바 */}
                    <div className="task-list">
                        <div className="task-card red-border">
                            <div className="task-details">
                                <h3>프로젝트 보고서 작성</h3>
                                <p>이거 빨리 디자인을 마무리 해야해 그래야 다음을 만들지</p>
                            </div>
                            <span className="task-date">D-1</span>
                        </div>
                        <div className="task-card yellow-border">
                            <div className="task-details">
                                <h3>피그마 디자인 마무리 하기</h3>
                                <p>빨리빨리 디자인 마무리 하자</p>
                            </div>
                            <span className="task-date">D-3</span>
                        </div>
                    </div>
                </section>

                {/* 분석 데이터 섹션 */}
                <section className="chart-section">
                    <h2 className="section-title">User 님의 개인 분석 데이터</h2>
                    <div className="chart-list">
                        <div className="chart-container">
                            <div className="chart-circle blue">
                                <span>92%</span>
                            </div>
                            <p>작성된 To Do 완료율</p>
                        </div>
                        <div className="chart-container">
                            <div className="chart-circle purple">
                                <span>72개</span>
                            </div>
                            <p>완료된 To Do</p>
                        </div>
                        <div className="chart-container">
                            <div className="chart-circle red">
                                <span>92%</span>
                            </div>
                            <p>평균 작업 소요 시간</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
