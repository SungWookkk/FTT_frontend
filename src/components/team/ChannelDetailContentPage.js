import React from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import TeamDropdown from "./TeamDropdown";

function ChannelDetailContentPage() {
    const { teamId } = useParams();
    const history = useHistory();
    const location = useLocation();

    const handleTeamSelect = (selectedTeam) => {
        history.push(`/team/${selectedTeam.id}`);
    };

    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown onTeamSelect={handleTeamSelect} disableAutoSelect={true} />
                </div>
            </div>
            <div className="list-tap">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div className="list-tab-container">
                        <div className={`tab-item ${isMainPage ? "active" : ""}`} onClick={() => history.push(`/team/${teamId}`)}>
                            메인
                        </div>
                        <div className={`tab-item ${isTodoPage ? "active" : ""}`} onClick={() => history.push(`/team/${teamId}/todo`)}>
                            팀 Todo
                        </div>
                        <div className={`tab-item ${isTodoPage ? "active" : ""}`} onClick={() => history.push(`/team/${teamId}/community`)}>
                            소통
                        </div>
                    </div>
                </div>
            </div>
            <div className="alert-banner-todo">
                <p className="alert-text">
                    <span className="highlight-text">팀</span>
                    <span className="normal-text">은 공동의 목표를 위해 함께 </span>
                    <span className="highlight-text">소통하고 협업</span>
                    <span className="normal-text">하는 공간입니다. 서로의 아이디어와 역량을 모아 </span>
                    <span className="highlight-text">시너지를 발휘</span>
                    <span className="normal-text">하며, 매일의 과제를 함께 해결해 보세요. 작지만 꾸준한 노력들이 모여 </span>
                    <span className="highlight-text">팀의 성장</span>
                    <span className="normal-text">을 이끌어냅니다!</span>
                </p>
            </div>
            <div>
                <h2>fasdasdasd</h2>
            </div>
        </div>
    );
}

export default ChannelDetailContentPage;
