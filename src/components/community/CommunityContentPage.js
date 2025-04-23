import React from "react";

function CommunityContentPage() {
    return(
        <div className="dashboard-content">
            {/* 작업공간 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">사용자 커뮤니티</span>
                </div>

            </div>

            {/* 목록 선택 탭 */}
            <div className="list-tap">
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                    <div className="list-tab-container">
                        <div className="tab-item active">메인</div>
                        <div className="tab-item">게시글</div>
                        <div className="tab-item">내 작성 관리</div>
                    </div>

                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text-todo">
                    <span className="normal-text">다른 사용자와 </span>
                    <span className="highlight-text">소통하는 공간 </span>
                    <span className="normal-text">입니다! </span>
                    <span className="highlight-text">서로</span>
                    <span className="normal-text">를 </span>
                    <span className="highlight-text">응원</span>
                    <span className="normal-text">하고 </span>
                    <span className="highlight-text">격려</span>
                    <span className="normal-text">하며, </span>
                    <span className="highlight-text">목표</span>
                    <span className="normal-text">를 이루어 보아요! </span>
                </p>
            </div>
        </div>
    );
}

export default CommunityContentPage;