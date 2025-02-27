import React from "react";
import "./css/DashboardContent.css";
import badge from "../../Auth/css/img/badge_design/Badge_01.svg";
import arrow1 from "../../Auth/css/img/arrow1.svg";

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
            <div className="info-title">짱구가 좋은 성욱 님의 정보</div>
            <div className="info-underline"></div>
            <div className="main-task-container">
                {/* 좌측 - 사용자 정보 및 진행률 */}
                <div className="user-info-box">
                    <div className="info-header">
                        <div className="profile-container">
                        <img className="profile-img" src={badge} alt="프로필 이미지"/>
                        <span className="user-name"><strong>짱구가 좋은 성욱</strong></span>
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


                {/* 우측 - 기존 작업 컨테이너 */}
                <div className="task-container">
                    {/* 오늘의 작업 */}
                    <div className="task-box today-task">
                        <div className="title-underline"></div>

                        <div className="task-title">오늘의 작업!</div>
                        <div className="task-card1">
                            <div className="task-color red-gradient"></div>
                            <div className="task-content">
                                <div className="task-name">옆의 색상은 </div>
                                <div className="task-desc">마감 임박에 맞춰 변할 예정</div>
                            </div>
                            <div className="task-deadline">D-1</div>
                        </div>

                        <div className="task-card1">
                            <div className="task-color blue-gradient"></div>
                            <div className="task-content">
                                <div className="task-name">옆의 색상은 </div>
                                <div className="task-desc">마감 임박에 맞춰 변할 예정</div>
                            </div>
                            <div className="task-deadline">D-3</div>
                        </div>
                    </div>

                    {/* 작성한 작업 */}
                    <div className="task-box written-task">
                        <div className="title-underline"></div>
                        <div className="task-title">작성한 작업!</div>
                        <div className="task-card1">
                            <div className="task-color red-gradient"></div>
                            <div className="task-content">
                                <div className="task-name">옆의 색상은 </div>
                                <div className="task-desc">마감 임박에 맞춰 변할 예정</div>
                            </div>
                            <div className="task-deadline">D-1</div>
                        </div>

                        <div className="task-card1">
                            <div className="task-color blue-gradient"></div>
                            <div className="task-content">
                                <div className="task-name">옆의 색상은 </div>
                                <div className="task-desc">마감 임박에 맞춰 변할 예정</div>
                            </div>
                            <div className="task-deadline">D-3</div>
                        </div>
                    </div>
                </div>
                {/* 데이터 통계 섹션 */}
                <div className="data-statistics">
                    <div className="data-title">데이터 통계</div>
                    <div className="data-underline"></div>

                    {/* 통계 카드 5개 생성 */}
                    <div className="statistics-container">
                        {["작업 처리 평균 시간", "작성한 작업", "완료한 작업", "실패한 작업", "작업에 따른 사용자 순위"].map((title, index) => (
                            <div className={`stat-card ${index === 4 ? 'last-card' : ''}`} key={index}>
                                <div className="stat-title">{title}</div>
                                <div className="stat-value-placeholder"></div>
                                {index === 4 && <img className="arrow-icon" src={arrow1} alt="Arrow" />}
                            </div>
                        ))}
                    </div>
                </div>
                {/* 그래프 섹션 */}
                <div className="graph-section">
                    <div className="graph-title">작업 시작 통계</div>
                    <div className="graph-underline"></div>
                    <div className="graph-placeholder"></div>
                </div>
                {/* 피그마 디자인 코드(노란색 영역) */}
                <div className="yellow-design-section">
                    {/* 뱃지 */}
                    <div className="yellow-title">뱃지</div>
                    <div className="progress-bar badge-bar">
                        <div className="progress-fill badge-fill"></div>
                        <div className="progress-text">작업 진척도</div>
                    </div>

                    {/* 칭호 */}
                    <div className="yellow-title">칭호</div>
                    <div className="progress-bar badge-bar">
                        <div className="progress-fill title-fill"></div>
                        <div className="progress-text">3일 연속 작업 완료! - "3일의 기적"</div>
                    </div>

                    {/* 마감시간 */}
                    <div className="yellow-title">마감 시간 준수</div>
                    <div className="progress-bar badge-bar">
                        <div className="progress-fill time-fill"></div>
                        <div className="progress-text">마감 시간 준수! - "시간 관리의 신!"</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
