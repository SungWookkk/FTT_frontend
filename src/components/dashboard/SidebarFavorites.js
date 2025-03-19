import React, {useState} from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/SidebarFavorites.css";
import TodoCreateModal from "../todolist/TodoCreateModal";

const SidebarFavorites = () => {
    const location = useLocation();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="sidebar-favorites">
            {/* Favorites 제목 */}


            {/* 작업 공간 메뉴 */}
            <div className="sidebar-workspace-menu">
                {/* 작업 공간 제목 */}
                <div className="sidebar-workspace-container">
                    <div className="workspace-title">작업 공간</div>
                    {/*홈페이지의 메인 컬러 색상을 바꾸는 버튼으로*/}
                    <div className="workspace-add-button" title="새 작업 공간 추가"></div>
                </div>

                {/* 현재 활성화된 작업 공간*/}
                <div className="workspace-active">
                    <div className="active-bg"></div>
                    <div className="workspace-icon"></div>
                    <div className="active-text">작업 공간</div>
                </div>

                {/* 작업 공간 하위 메뉴 */}
                <div className="workspace-list">
                    {/* 1) 내 To Do List 목록 */}
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

                    {/* 2) To Do List 작성 */}
                    <div>
                        {/* 모달을 여는 버튼 또는 클릭 가능한 요소 */}
                        <div
                            className="workspace-list-item"
                            onClick={() => setIsCreateModalOpen(true)}
                            style={{cursor: "pointer"}}
                        >
                            To Do List 작성
                        </div>

                        {/* 모달 열림 여부에 따라 TodoCreateModal 렌더링 */}
                        {isCreateModalOpen && (
                            <TodoCreateModal
                                onClose={() => setIsCreateModalOpen(false)}
                                onTaskCreated={(newTask) => {
                                    // 새 작업 생성 후 추가 작업 처리
                                    console.log("새 작업 생성됨:", newTask);
                                }}
                            />
                        )}
                    </div>

                    {/* 3) 작업 폴더 생성 */}
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

                    {/* 4) 모든 작업 폴더 */}
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
                {/* 작업 공간 제목 */}
                <div className="sidebar-workspace-container">
                    <div className="team-list-title">팀 작업 공간</div>
                    {/*팀 목록이나 추가 및 삭제 팀의 이름 멤버 관리 등 작업 하는 공간*/}
                    <Link
                        to="/team-workspace/management"
                        className={`team-list ${location.pathname === "/team-workspace/management" ? "active" : ""}`}
                    >
                        내 팀 관리
                    </Link>
                    {/*팀에서 task를 작성하는 공간*/}
                    <div className="team-list">팀 To Do List</div>
                    {/*팀 내에 커뮤니티 공간으로 제작 예정*/}
                    <Link
                        to="/team-workspace/community"
                        className={`team-list ${location.pathname === "/team-workspace/community" ? "active" : ""}`}
                    >
                        기록
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default SidebarFavorites;
