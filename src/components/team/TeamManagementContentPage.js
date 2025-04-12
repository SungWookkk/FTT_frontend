import TeamDropdown from "./TeamDropdown";
import React, {useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import "../team/css/TeamManagementContentPage.css";

/* 모달(팝업) 컴포넌트 */
const ManagementDetailsModal = ({ onClose }) => {
    return (
        <div className="management-modal-overlay" onClick={onClose}>
            <div className="management-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="management-modal-close-btn" onClick={onClose}>
                    X
                </button>
                <h2 className="management-modal-title">내 팀 관리 상세 기능</h2>
                <ul className="management-details-list">
                    <li className="management-tooltip">
                        팀 신청자 승인 및 반려
                        <span className="management-tooltip-text">
                          팀 신청을 승인하면 팀원으로 추가되고,<br/>
                          반려 시 신청이 취소됩니다.
                        </span>
                    </li>
                    <li className="management-tooltip">
                        멤버 추방
                        <span className="management-tooltip-text">
                          규칙 위반 또는 팀 결정에 따라 멤버를 추방합니다.
                        </span>
                    </li>
                    <li className="management-tooltip">
                        멤버 등급 상승
                        <span className="management-tooltip-text">
                          팀 운영진(관리자, 리더)으로 승격할 수 있습니다.
                        </span>
                    </li>
                    <li className="management-tooltip">
                        팀 탈퇴
                        <span className="management-tooltip-text">
                          팀원이 자발적으로 팀에서 나갈 수 있습니다.
                        </span>
                    </li>
                    <li className="management-tooltip">
                        팀 해체
                        <span className="management-tooltip-text">
                          팀 리더가 팀을 완전히 해체하여 모든 활동이 종료됩니다.
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

function TeamManagementContentPage({teamId}) {
    const history = useHistory();
    const location = useLocation();

    // 현재 경로가 "/team/:teamId"인지 "/team/:teamId/todo"인지 확인
    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;
    const [showModal, setShowModal] = useState(false);

    // 팀을 선택했을 때의 핸들러 (드롭다운 등에서 호출)
    const handleTeamSelect = (selectedTeam) => {
        history.push(`/team/${selectedTeam.id}`);
    };

    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown onTeamSelect={handleTeamSelect}/>
                </div>
            </div>

            {/* 목록 선택 탭 */}
            <div className="list-tap">
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
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
                        <div className="tab-item">소통</div>
                    </div>
                </div>
            </div>

            <div className="management-alert-banner">
                {/* 가운데 텍스트 영역 */}
                <p className="management-alert-text">
                    <span className="management-highlight">내 팀 관리</span>
                    <span className="management-normal">
          페이지에서는 팀 운영의 핵심 기능들을 제공합니다.
        </span>
                </p>

                {/* 오른쪽 버튼 */}
                <button className="management-toggle-btn" onClick={() => setShowModal(true)}>
                    자세히 보기
                </button>

                {/* 모달 */}
                {showModal && <ManagementDetailsModal onClose={() => setShowModal(false)} />}
            </div>
        </div>
    );
}

export default TeamManagementContentPage;