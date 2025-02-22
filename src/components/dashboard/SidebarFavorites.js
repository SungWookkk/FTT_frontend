import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/SidebarFavorites.css";

const SidebarFavorites = () => {
    const location = useLocation();

    return (
        <div className="sidebar-favorites">
            {/* Favorites 제목 */}
            <div className="favorites-button">
                <div className="favorites-text">Favorites</div>
            </div>

            {/* 작업 공간 메뉴 */}
            <div className="sidebar-workspace-menu">
                {/* 작업 공간 제목 */}
                <div className="sidebar-workspace-container">
                    <div className="workspace-title">작업 공간</div>
                    <div className="workspace-add-button" title="새 작업 공간 추가"></div>
                </div>

                {/* 현재 활성화된 작업 공간 (예: "작업 공간") */}
                <div className="workspace-active">
                    <div className="active-bg"></div>
                    <div className="workspace-icon"></div>
                    <div className="workspace-arrow">v</div>
                    <div className="active-text">작업 공간</div>
                </div>

                {/* 작업 공간 하위 메뉴 (Link로 변경) */}
                <div className="workspace-list">
                    {/* 1) 내 To Do List 목록 */}
                    <Link
                        to="/todo"
                        className={
                            location.pathname === "/todo"
                                ? "workspace-list-item active"
                                : "workspace-list-item"
                        }
                    >
                        내 To Do List 목록
                    </Link>

                    {/* 2) To Do List 작성 */}
                    <Link
                        to="/todo/create"
                        className={
                            location.pathname === "/todo/create"
                                ? "workspace-list-item active"
                                : "workspace-list-item"
                        }
                    >
                        To Do List 작성
                    </Link>

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
            </div>
        </div>
    );
};

export default SidebarFavorites;
