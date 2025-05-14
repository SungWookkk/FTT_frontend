import React, {useState, useEffect, useCallback} from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import TeamDropdown from "./TeamDropdown";
import "../team/css/TeamManagementContentPage.css";
import axios from "axios";
import TeamKickMemberModal from "./management/TeamKickMemberModal";
import TeamRoleModal from "./management/TeamRoleModal";
import TeamLeaveTeamModal from "./management/TeamLeaveTeamModal";
import TeamDisbandTeamModal from "./management/TeamDisbandTeamModal";
import { FaTrash } from 'react-icons/fa';
import {useAuth} from "../../Auth/AuthContext";

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
              팀 신청을 승인하면 팀원으로 추가되고,<br />
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

function TeamManagementContentPage() {
    const { teamId } = useParams(); // URL에서 teamId 추출
    const history = useHistory();
    const location = useLocation();
    const [teamInfo, setTeamInfo] = useState({ teamLeader: null });
    // 현재 경로가 "/team/:teamId"인지 "/team/:teamId/todo"인지 확인
    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;
    const [showModal, setShowModal] = useState(false);
    const { auth } = useAuth();
    const userId = auth.userId;
    // 팀 신청 목록 상태
    const [applications, setApplications] = useState([]);

    // 팀 관리 기능 상태
    const [showKick, setShowKick] = useState(false);
    const [showPromote, setShowPromote] = useState(false);
    const [showLeave, setShowLeave] = useState(false);
    const [showDisband, setShowDisband] = useState(false);
    const [members, setMembers] = useState([]);

    // 팀 선택 시 호출 (TeamDropdown 등에서)
    const handleTeamSelect = (selectedTeam) => {
        history.push(`/team/${selectedTeam.id}`);
    };

    // 1) 팀 신청 목록 불러오기
    const loadApplications = useCallback(() => {
        axios
            .get(`/api/team-applications/${teamId}`)
            .then(res => setApplications(res.data))
            .catch(err => console.error("신청 목록 실패:", err));
    }, [teamId]);

    // 2) 팀원 불러오기
    const loadMembers = useCallback(() => {
        axios.get(`/api/teams/${teamId}/members`)
            .then(res => setMembers(res.data))
            .catch(err => console.error("[DEBUG] loadMembers 에러:", err));
    }, [teamId]);

    // 3) 팀 정보 불러오기
    const loadTeamInfo = useCallback(() => {
        axios.get(`/api/teams/${teamId}`)
            .then(res => setTeamInfo(res.data))
            .catch(err => console.error("팀 정보 오류:", err));
    }, [teamId]);

    useEffect(() => {
        loadApplications();
        loadMembers();
        loadTeamInfo();
    }, [loadApplications, loadMembers, loadTeamInfo]);

    // 승인 처리
    const handleApprove = (applicationId) => {
        if (!window.confirm("정말 승인하시겠습니까?")) return;
        axios.patch(`/api/team-applications/${applicationId}/approve`)
            .then(() => loadApplications())
            .catch(() => alert("신청 승인에 실패하였습니다."));
    };

    // 반려 처리
    const handleReject = (applicationId) => {
        if (!window.confirm("정말 반려하시겠습니까?")) return;
        axios.patch(`/api/team-applications/${applicationId}/reject`)
            .then(() => loadApplications())
            .catch(() => alert("신청 반려에 실패하였습니다."));
    };

    // 멤버 추방
    const handleKick = (memberId) => {
        if (!window.confirm("정말 멤버를 추방하시겠습니까?")) return;
        axios.delete(`/api/team-applications/${teamId}/members/${memberId}`)
            .then(() => loadMembers())
            .catch(() => alert("추방 실패"));
    };

    // 멤버 등급 변경
    const handleRoleChange = (memberId, newRole) => {
        if (!window.confirm(`정말 ${newRole}로 변경하시겠습니까?`)) return;
        axios.patch(`/api/teams/${teamId}/members/${memberId}/role`, { role: newRole })
            .then(() => loadMembers())
            .catch(() => alert("등급 변경 실패"));
    };

    // 팀 탈퇴
    const handleLeave = () => {
        if (!window.confirm("정말 팀을 탈퇴하시겠습니까?")) return;
        axios.delete(`/api/team-applications/${teamId}/members/me`, {
            headers: { "X-User-Id": userId }
        })
            .then(() => history.push("/"))
            .catch(() => alert("팀 탈퇴 중 오류가 발생했습니다."));
    };

    // 팀 해체
    const handleDisband = () => {
        if (!window.confirm("팀을 완전히 해체하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
        axios.delete(`/api/team-applications/${teamId}`)
            .then(() => history.push("/team"))
            .catch(() => alert("해체 실패"));
    };

    /** 권한 계산 **/
    const isLeader = String(userId) === String(teamInfo.teamLeader);
    // 내 멤버 정보를 찾아서 ADMIN 권한 체크
    const myMember = members.find(m => m.id === userId);
    const isAdmin = myMember && myMember.role === "ADMIN";
    const canManageMembers = isLeader || isAdmin;
    const singleMember = members.length === 1;

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

            {/* 관리 페이지 알림 배너 */}
            <div className="management-alert-banner">
                <p className="management-alert-text">
                    <span className="management-highlight">내 팀 관리</span>
                    <span className="management-normal">
            페이지에서는 팀 운영의 핵심 기능들을 제공합니다.
          </span>
                </p>
                <button className="management-toggle-btn" onClick={() => setShowModal(true)}>
                    자세히 보기
                </button>
                {showModal && <ManagementDetailsModal onClose={() => setShowModal(false)}/>}
            </div>

            <div className="management-sections2">
                {/* 1. 팀 신청 목록 */}
                <div className="team-application-section">
                    <h3 className="section-title-manage">
                        팀 신청 목록
                        <button className="clear-list-btn" onClick={()=>{
                            if(window.confirm("정말 전체 삭제하시겠습니까?")) setApplications([]);
                        }} title="전체 삭제"><FaTrash/></button>
                    </h3>
                    {applications.length===0
                        ? <p className="no-applications">현재 신청된 팀 가입 요청이 없습니다.</p>
                        : <ul className="application-list">
                            {applications.map(app=>(
                                <li key={app.id} className="application-item">
                                    <div className="application-info">
                                        <span className="applicant-name">{app.applicant.username}</span>
                                        <span className="application-reason">신청 사유: {app.reason}</span>
                                        <span className="application-goal">목표: {app.goal}</span>
                                        <span className={`application-status ${
                                            app.status==="PENDING"?"status-pending":
                                                app.status==="APPROVED"?"status-approved":
                                                    app.status==="REJECTED"?"status-rejected":""}`}>
                                            상태: {app.status==="PENDING"?"승인 대기중":
                                            app.status==="APPROVED"?"승인":
                                                app.status==="REJECTED"?"거절":app.status}
                                        </span>
                                    </div>
                                    {app.status==="PENDING" && (
                                        <div className="application-actions">
                                            <button className="approve-btn" onClick={()=>handleApprove(app.id)}>승인</button>
                                            <button className="reject-btn" onClick={()=>handleReject(app.id)}>반려</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    }
                </div>

                {/* -- 2. 멤버 추방 (권한 없으면 불투명) -- */}
                <div className={`team-application-section ${!canManageMembers ? 'disabled-section' : ''}`}>
                    <h3 className="section-title-manage">멤버 추방</h3>
                    {members.length === 0
                        ? <p>팀원이 없습니다.</p>
                        : <ul>
                            {members.map(m => (
                                <li key={m.id} className="application-item">
                                    <span>{m.username}</span>
                                    <button
                                        className="reject-btn"
                                        onClick={() => handleKick(m.id)}
                                    >추방</button>
                                </li>
                            ))}
                        </ul>
                    }
                </div>

                {/* -- 3. 멤버 등급 변경 (권한 없으면 불투명) -- */}
                <div className={`team-application-section ${!canManageMembers ? 'disabled-section' : ''}`}>
                    <h3 className="section-title-manage">멤버 등급 변경</h3>
                    {members.length === 0
                        ? <p>팀원이 없습니다.</p>
                        : <ul>
                            {members.map(m => (
                                <li key={m.id} className="application-item">
                                    <span>{m.username}</span>
                                    <select
                                        defaultValue={m.role}
                                        onChange={e => handleRoleChange(m.id, e.target.value)}
                                    >
                                        {["MEMBER","ADMIN","TEAM_LEADER"].map(r =>
                                            <option key={r} value={r}>{r}</option>
                                        )}
                                    </select>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
                {/* 4. 팀 탈퇴 */}
                <div className="team-application-section">
                    <h3 className="section-title-manage">팀 탈퇴</h3>
                    <button className="reject-btn" onClick={handleLeave} disabled={isLeader}>팀 탈퇴</button>
                    {isLeader && <p style={{color:"#999",marginTop:8}}>리더는 권한 양도 후 탈퇴 가능합니다.</p>}
                </div>

                {/* 5. 팀 해체 */}
                <div className="team-application-section">
                    <h3 className="section-title-manage">팀 해체</h3>
                    <button className="reject-btn" onClick={handleDisband} disabled={!isLeader||!singleMember}>
                        팀 해체
                    </button>
                    {(!isLeader||!singleMember) && (
                        <p style={{color:"#999",marginTop:8}}>
                            {!isLeader?"리더만 해체할 수 있습니다.":"팀원 모두 추방 후 해체 가능합니다."}
                        </p>
                    )}
                </div>
            </div>


            {/* 모달들 */}
            {showKick && (
                <TeamKickMemberModal
                    teamId={teamId}
                    members={members}
                    onClose={() => setShowKick(false)}
                    onKicked={() => loadMembers()}
                />
            )}
            {showPromote && (
                <TeamRoleModal
                    teamId={teamId}
                    members={members.map(m => ({
                        id: m.id,
                        username: m.username,
                        role: m.role
                    }))}
                    onClose={() => setShowPromote(false)}
                />
            )}
            {showLeave && <TeamLeaveTeamModal teamId={teamId} onClose={() => setShowLeave(false)} />}
            {showDisband && (
                <TeamDisbandTeamModal teamId={teamId} onClose={() => setShowDisband(false)} />
            )}
        </div>
    );
}

export default TeamManagementContentPage;
