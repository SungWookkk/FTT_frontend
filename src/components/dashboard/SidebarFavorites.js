import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import "./css/SidebarFavorites.css";
import TodoCreateModal from "../todolist/TodoCreateModal";

/* 팀 선택 모달: 사용자가 내 팀 중 관리할 팀을 선택 */
// React Portal을 사용하여 모달을 document.body에 렌더링
function ChooseTeamModal({ teams, onSelectTeam, onClose }) {
    return createPortal(
        <div className="management-modal-overlay" onClick={onClose}>
            <div className="management-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="management-modal-close-btn" onClick={onClose}>
                    X
                </button>
                <h2 className="management-modal-title">어떤 팀을 관리하시겠습니까?</h2>
                {teams && teams.length > 0 ? (
                    <ul className="management-details-list">
                        {teams.map((team) => (
                            <li
                                key={team.id}
                                onClick={() => onSelectTeam(team.id)}
                                style={{ cursor: "pointer", marginBottom: "8px" }}
                            >
                                {team.teamName || `팀 ${team.id}`}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>내가 속한 팀이 없습니다.</div>
                )}
            </div>
        </div>,
        document.body
    );
}

const SidebarFavorites = ({ teamId, myTeams: propMyTeams }) => {
    const { auth } = useAuth();
    const location = useLocation();
    const history = useHistory();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [teamSelectModalOpen, setTeamSelectModalOpen] = useState(false);

    // prop으로 전달받은 myTeams가 없으면, 백엔드 API를 통해 가져옵니다.
    const [localTeams, setLocalTeams] = useState(propMyTeams || []);
    useEffect(() => {
        if ((!propMyTeams || propMyTeams.length === 0) && auth.userId) {
            axios
                .get(`/api/teams/user/${auth.userId}`)
                .then((res) => {
                    console.log("SidebarFavorites - 내 팀 목록:", res.data);
                    setLocalTeams(res.data);
                })
                .catch((err) => {
                    console.error("내 팀 목록 불러오기 오류:", err);
                });
        } else {
            setLocalTeams(propMyTeams);
        }
    }, [propMyTeams, auth.userId]);

    // 디버깅 출력
    console.debug("SidebarFavorites - teamId:", teamId);
    console.debug("SidebarFavorites - localTeams:", localTeams);

    // "내 팀 관리" 버튼 클릭 핸들러
    const handleManagementClick = (e) => {
        e.preventDefault();
        if (!localTeams || localTeams.length === 0) {
            alert("내 팀이 없습니다.");
        } else if (localTeams.length === 1) {
            // 내 팀이 한 개이면 바로 이동
            history.push(`/team/${localTeams[0].id}/management`);
        } else {
            // 내 팀이 2개 이상이면 모달을 열어 사용자가 선택하도록 함
            setTeamSelectModalOpen(true);
        }
    };

    // 현재 URL을 슬래시로 분할하여 active 여부 판단
    const pathSegments = location.pathname.split("/").filter(Boolean);
    // 예) "/team/1" → ["team", "1"]  => 팀 공간 active
    // 예) "/team/1/todo" → ["team", "1", "todo"]  => To Do List active
    const isTeamSpaceActive = pathSegments[0] === "team" && (pathSegments.length === 1 || pathSegments.length === 2);
    const isTeamTodoActive = pathSegments[0] === "team" && pathSegments[2] === "todo";
    const isTeamManagementActive =
        pathSegments[0] === "team" &&
        pathSegments[1] === String(teamId) &&
        pathSegments[2] === "management";

    return (
        <div className="sidebar-favorites">
            {/* 작업 공간 메뉴 */}
            <div className="sidebar-workspace-menu">
                <div className="sidebar-workspace-container">
                    <div className="workspace-title">작업 공간</div>
                    <div className="workspace-add-button" title="새 작업 공간 추가"></div>
                </div>

                <div className="workspace-active">
                    <div className="active-bg"></div>
                    <div className="workspace-icon"></div>
                    <div className="active-text">작업 공간</div>
                </div>

                <div className="workspace-list">
                    <Link
                        to="/todo"
                        className={
                            location.pathname === "/todo" || location.pathname === "/todo/list-all"
                                ? "workspace-list-item active"
                                : "workspace-list-item"
                        }
                    >
                        내 To Do List 목록
                    </Link>

                    <div
                        className="workspace-list-item"
                        onClick={() => setIsCreateModalOpen(true)}
                        style={{cursor: "pointer"}}
                    >
                        To Do List 작성
                    </div>
                    {isCreateModalOpen && (
                        <TodoCreateModal
                            onClose={() => setIsCreateModalOpen(false)}
                            onTaskCreated={(newTask) => {
                                console.log("새 작업 생성됨:", newTask);
                            }}
                        />
                    )}

                    <Link
                        to="/todo/folder/create"
                        className={
                            location.pathname === "/todo/folder/create"
                                ? "workspace-list-item active"
                                : "workspace-list-item"
                        }
                    >
                        작업 폴더 생성
                    </Link>

                    <Link
                        to="/todo/folder/all"
                        className={
                            location.pathname === "/todo/folder/all"
                                ? "workspace-list-item active"
                                : "workspace-list-item"
                        }
                    >
                        모든 작업 폴더
                    </Link>
                </div>

                <div className="sidebar-workspace-container">
                    <div className="team-list-title">팀 작업 공간</div>

                    {/* 수정된 부분: 팀 공간 링크 */}
                    <Link
                        to="/team"
                        className={`team-list ${isTeamSpaceActive ? "active" : ""}`}
                    >
                        팀 공간
                    </Link>

                    {/* 수정된 부분: To Do List 링크 */}
                    <Link
                        to={`/team/${teamId}/todo`}
                        className={`team-list ${isTeamTodoActive ? "active" : ""}`}
                    >
                        To Do List
                    </Link>

                    <Link
                        to={`/team/${teamId}/community`}
                        className={`team-list ${location.pathname.startsWith(`/team/${teamId}/community`) ? "active" : ""}`}
                    >
                        소통
                    </Link>

                    {/* 내 팀 관리 버튼 */}
                    <div
                        className={`team-list ${isTeamManagementActive ? "active" : ""}`}
                        style={{cursor: "pointer"}}
                        onClick={handleManagementClick}
                    >
                        내 팀 관리
                    </div>
                </div>
            </div>

            {/* 팀 선택 모달 (React Portal을 사용한 ChooseTeamModal) */}
            {teamSelectModalOpen && (
                <ChooseTeamModal
                    teams={localTeams || []}
                    onSelectTeam={(chosenId) => {
                        setTeamSelectModalOpen(false);
                        history.push(`/team/${chosenId}/management`);
                    }}
                    onClose={() => setTeamSelectModalOpen(false)}
                />
            )}
        </div>
    );
};

export default SidebarFavorites;
