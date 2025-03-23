import React from "react";

const BadgeMainPage = () => {
    return(

        <div className="dashboard-content">
            {/* 작업공간 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">뱃지</span>
                </div>
            </div>
            {/* 알림 배너 */}
            <div className="alert-banner">
                <p className="alert-text">
                    <span className="highlight-text"> 뱃지 </span>
                    <span className="normal-text">는 여러분의</span>
                    <span className="highlight-text"> 성취를 기록 </span>
                    <span className="normal-text">하고, </span>
                    <span className="highlight-text">꾸준한 노력</span>
                    <span className="normal-text">을 격려하기 위해 만들어졌습니다. 매일 </span>
                    <span className="highlight-text">작업을 완료 </span>
                    <span className="normal-text">하며 </span>
                    <span className="highlight-text">성장해</span>
                    <span className="normal-text"> 나가는 모습을 </span>
                    <span className="highlight-text">뱃지</span>
                    <span className="normal-text">로 확인하세요!</span>
                </p>
            </div>
        </div>
    )
};

export default BadgeMainPage;