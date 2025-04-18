    import React, {useState, useEffect, useCallback} from "react";
    import { useHistory, useLocation, useParams } from "react-router-dom";
    import TeamDropdown from "./TeamDropdown";
    import "../team/css/TeamManagementContentPage.css";
    import axios from "axios";
    import TeamKickMemberModal from "./management/TeamKickMemberModal";
    import TeamRoleModal from "./management/TeamRoleModal";
    import TeamLeaveTeamModal from "./management/TeamLeaveTeamModal";
    import TeamDisbandTeamModal from "./management/TeamDisbandTeamModal";

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

        // 현재 경로가 "/team/:teamId"인지 "/team/:teamId/todo"인지 확인
        const isMainPage = location.pathname === `/team/${teamId}`;
        const isTodoPage = location.pathname === `/team/${teamId}/todo`;
        const [showModal, setShowModal] = useState(false);

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

        // 팀 신청 목록을 서버에서 불러오기
        useEffect(() => {
            if (teamId) {
                axios
                    .get(`/api/team-applications/${teamId}`)
                    .then((res) => {
                        setApplications(res.data);
                    })
                    .catch((err) => {
                        console.error("팀 신청 목록 불러오기 실패:", err);
                    });
            }
        }, [teamId]);


        // 신청 승인 처리 함수
        const handleApprove = (applicationId) => {
            axios
                .patch(`/api/team-applications/${applicationId}/approve`)
                .then((res) => {
                    alert(`신청이 승인되었습니다: ${res.data.id}`);
                    // 승인된 신청의 상태를 "APPROVED"로 업데이트
                    setApplications((apps) =>
                        apps.map((app) =>
                            app.id === applicationId ? { ...app, status: "APPROVED" } : app
                        )
                    );
                })
                .catch((err) => {
                    console.error("신청 승인 실패:", err);
                    alert("신청 승인에 실패하였습니다.");
                });
        };

        // 신청 반려 처리 함수
        const handleReject = (applicationId) => {
            axios
                .patch(`/api/team-applications/${applicationId}/reject`)
                .then((res) => {
                    alert(`신청이 반려되었습니다: ${res.data.id}`);
                    // 반려된 신청의 상태를 "REJECTED"로 업데이트
                    setApplications((apps) =>
                        apps.map((app) =>
                            app.id === applicationId ? { ...app, status: "REJECTED" } : app
                        )
                    );
                })
                .catch((err) => {
                    console.error("신청 반려 실패:", err);
                    alert("신청 반려에 실패하였습니다.");
                });
        };
        // 1) 팀원 불러오기
        const loadMembers = useCallback(() => { //TEAMCONTROLLER에서 불러옴
            const url = `/api/teams/${teamId}/members`;
            console.log("[DEBUG] loadMembers 호출, URL →", url);

            axios.get(url)
                .then(res => {
                    console.log("[DEBUG] loadMembers 응답 성공:", res.data);
                    setMembers(res.data);
                })
                .catch(err => {
                    console.error("[DEBUG] loadMembers 에러:", err.response || err);
                });
        }, [teamId])


        // 2) 신청 목록 불러오기
        const loadApplications = useCallback(() => {
            axios
                .get(`/api/team-applications/${teamId}`)
                .then(res => setApplications(res.data))
                .catch(err => console.error("신청 목록 실패:", err));
        }, [teamId]);

        // 마운트 및 teamId 변경 시 한 번에 호출
        useEffect(() => {
            loadMembers();
            loadApplications();
        }, [loadMembers, loadApplications]);

        useEffect(() => {
            console.log("[DEBUG] members 상태 업데이트 →", members);
        }, [members]);

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
                    {showModal && <ManagementDetailsModal onClose={() => setShowModal(false)}/>}
                </div>

                {/* 팀 신청 목록 영역 */}
                <div className="team-application-section">
                    <h3 className="section-title-manage">팀 신청 목록</h3>
                    {applications.length === 0 ? (
                        <p className="no-applications">현재 신청된 팀 가입 요청이 없습니다.</p>
                    ) : (
                        <ul className="application-list">
                            {applications.map((app) => (
                                <li key={app.id} className="application-item">
                                    <div className="application-info">
                                        <span className="applicant-name">{app.applicant.username}</span>
                                        <span className="application-reason">신청 사유: {app.reason}</span>
                                        <span className="application-goal">목표: {app.goal}</span>
                                        <span
                                            className={`application-status ${
                                                app.status === "PENDING" ? "status-pending" :
                                                    app.status === "APPROVED" ? "status-approved" :
                                                        app.status === "REJECTED" ? "status-rejected" :
                                                            ""
                                            }`}
                                        >
                                          상태: {
                                            app.status === "PENDING" ? "승인 대기중" :
                                                app.status === "APPROVED" ? "승인" :
                                                    app.status === "REJECTED" ? "거절" :
                                                        app.status
                                        }
                                    </span>
                                    </div>
                                    {(app.status === "PENDING" || app.status === "승인 대기중") && (
                                        <div className="application-actions">
                                            <button className="approve-btn" onClick={() => handleApprove(app.id)}>
                                                승인
                                            </button>
                                            <button className="reject-btn" onClick={() => handleReject(app.id)}>
                                                거절
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="management-actions">
                    <button onClick={() => setShowKick(true)}>멤버 추방</button>
                    <button onClick={() => setShowPromote(true)}>멤버 등급 상승</button>
                    <button onClick={() => setShowLeave(true)}>팀 탈퇴</button>
                    <button onClick={() => setShowDisband(true)}>팀 해체</button>
                </div>
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
