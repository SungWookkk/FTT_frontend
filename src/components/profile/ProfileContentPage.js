import "../profile/css/ProfileContentPage.css";
import React from "react";

const ProfileContentPage = () => {
    return (
        <div className="dashboard-content">
            {/* 대시보드 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">프로필</span>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner">
                <p className="alert-text">
                    <span className="normal-text">프로필 페이지에서 </span>
                    <span className="highlight-text">개인 정보</span>
                    <span className="normal-text">를 확인하고, </span>
                    <span className="highlight-text">프로필 사진</span>
                    <span className="normal-text"> 및 </span>
                    <span className="highlight-text">연락처</span>
                    <span className="normal-text"> 등의 정보를 최신 상태로 업데이트해 보세요!</span>
                </p>
            </div>

            {/* 프로필 정보 영역 (피그마 디자인 기반) */}
            <div className="container">
                <div className="profile-card">
                    <div className="top-rated">Top rated</div>
                    <p className="description">
                        TodoList 프로젝트를 하며, 집에 가고 시퍼 두비두밥 두비두밥 두비두밥 두비두밥 두비두밥 두비두밥 두비두밥 두비두밥  두비두밥 두비두밥두비두밥두비두밥
                    </p>
                    <div className="overview">소개</div>
                    <div className="pin">

                    </div>
                    <div className="job-success">79% 완료율</div>
                    <p className="introduction">한 줄 자기소개 하는 곳</p>
                    <div className="favorite">짱구가 좋아</div>
                    <div className="avatar-container">
                        <div className="avatar">
                            <img className="avatar-img" src="img/rectangle.png" alt="Avatar"/>
                        </div>
                        <button className="avatar-upload-btn">사진 등록</button>
                    </div>
                    {/* 하단 통계 영역 (4개 칸) */}
                    <div className="bottom-stats-container">
                        <div className="stat-box">
                            <div className="stat-value">1542</div>
                            <div className="stat-label">생성한 작업 수</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">1350</div>
                            <div className="stat-label">완료한 작업 수</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">182</div>
                            <div className="stat-label">실패한 작업 수</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">2849위</div>
                            <div className="stat-label">작업에 따른 사용자 랭킹</div>
                        </div>
                    </div>
                </div>
                {/* 구분선 */}
                <div className="vertical-divider"></div>
            </div>
        </div>
    );
};

export default ProfileContentPage;
