import React from "react";
import arrow1 from "../../Auth/css/img/arrow1.svg";

const StatisticsContentPage = () => {
    return (
        <div className="dashboard-content">
            {/* 작업공간 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">To Do List - 작업 공간</span>
                </div>
                <div className="header-button-group">
                    <button className="btn btn-create">
                        생성하기
                    </button>
            </div>

            {/* 목록 선택 탭 */}
            <div className="list-tap">
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                    <div className="list-tab-container">
                        <div className="tab-item active">내 목록</div>
                        <div className="tab-item">
                            전체 목록
                        </div>
                        <div className="tab-item">팀</div>
                    </div>

                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text-todo">
                    <span className="highlight-text">효율적인 하루</span>
                    <span className="normal-text">를 설계하세요! 우리의 </span>
                    <span className="highlight-text">To-Do List 서비스</span>
                    <span className="normal-text">
            를 통해 목표를 정리하고 실천하세요. 지금 바로 시작해보세요!
          </span>
                </p>


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
    )
};

export default StatisticsContentPage;