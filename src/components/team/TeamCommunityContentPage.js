import TeamDropdown from "./TeamDropdown";
import React from "react";
import {useHistory, useLocation, useParams} from "react-router-dom";


function TeamCommunityContentPage() {
    // URL에서 teamId 추출
    const { teamId } = useParams();
    const history = useHistory();
    const location = useLocation();

    // 팀 선택 (TeamDropdown에서 호출)
    const handleTeamSelect = (selectedTeam) => {
        history.push(`/team/${selectedTeam.id}`);
    };

    // 현재 경로 확인
    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;
    const isCommunityPage = location.pathname === `/team/${teamId}/community`;


    return(
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown onTeamSelect={handleTeamSelect} disableAutoSelect={true} />
                </div>
            </div>

            {/* 목록 선택 탭 */}
            <div className="list-tap">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div className="list-tab-container">
                        <div
                            className={`tab-item ${isMainPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}`)}
                        >
                            메인
                        </div>
                        <div
                            className={`tab-item ${isTodoPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}/todo`)}
                        >
                            팀 Todo
                        </div>
                        <div
                            className={`tab-item ${isCommunityPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}/community`)}
                        >
                            소통
                        </div>
                    </div>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text">
                    <span className="highlight-text">커뮤니티</span>
                    <span className="normal-text">는 팀원들이 자유롭게 의견을 나누고, 아이디어를 공유하며 </span>
                    <span className="highlight-text">열린 소통</span>
                    <span className="normal-text">을 통해 서로를 격려하고 도전할 수 있는 공간입니다. 여러분의 생각과 경험을 함께 나눠, </span>
                    <span className="highlight-text">팀의 발전</span>
                    <span className="normal-text">뿐 아니라, 개인의 성장도 함께 이루어가세요!</span>
                </p>
            </div>
        </div>
    )
}
export default TeamCommunityContentPage;