import React from "react";
import "../css/DashboardContent.css";

const DashboardContent = () => {
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
            <div className="main-task-container">
                {/* 🔹 좌측 - 사용자 정보 및 진행률 */}
                <div className="user-info-box">
                    <div className="info-title">짱구가 좋은 성욱 님의 정보</div>
                    <div className="progress-area">
                        <div className="progress-bar"></div>
                        <div className="progress-labels">
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                        </div>
                    </div>
                    <div className="badge-area"></div>
                </div>

                {/* 🔹 우측 - 기존 작업 컨테이너 */}
                <div className="task-container">
                    {/* 오늘의 작업 */}
                    <div className="task-box today-task">
                        <div className="task-title">오늘의 작업!</div>

                        {/* 첫 번째 작업 */}
                        <div className="task-card">
                            <div className="task-color red-gradient"></div>
                            <div className="task-content">
                                <div className="task-name">프로젝트 보고서 작성</div>
                                <div className="task-desc">이거 빨리 디자인을 마무리 해야해 그래야</div>
                            </div>
                            <div className="task-deadline">D-1</div>
                        </div>

                        {/* 두 번째 작업 */}
                        <div className="task-card">
                            <div className="task-color blue-gradient"></div>
                            <div className="task-content">
                                <div className="task-name">피그마 디자인 마무리 하기</div>
                                <div className="task-desc">빨리빨리 디자인 마무리 하자</div>
                            </div>
                            <div className="task-deadline">D-3</div>
                        </div>
                    </div>

                    {/* 작성한 작업 */}
                    <div className="task-box written-task">
                        <div className="task-title">작성한 작업!</div>

                        {/* 첫 번째 작업 */}
                        <div className="task-card">
                            <div className="task-color red-gradient"></div>
                            <div className="task-content">
                                <div className="task-name">프로젝트 보고서 작성</div>
                                <div className="task-desc">이거 빨리 디자인을 마무리 해야해 그래야</div>
                            </div>
                            <div className="task-deadline">D-1</div>
                        </div>

                        {/* 두 번째 작업 */}
                        <div className="task-card">
                            <div className="task-color blue-gradient"></div>
                            <div className="task-content">
                                <div className="task-name">피그마 디자인 마무리 하기</div>
                                <div className="task-desc">빨리빨리 디자인 마무리 하자</div>
                            </div>
                            <div className="task-deadline">D-3</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
