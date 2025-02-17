import React from "react";
import "./css/SidebarFavorites.css"

export const SidebarFavorites = () => {
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

                {/* 작업 공간 리스트 */}
                <div className="workspace-active">
                    <div className="active-bg"></div>
                    <div className="workspace-icon"></div>
                    <div className="workspace-arrow">v</div>
                    <div className="active-text">작업 공간</div>
                </div>

                {/* 작업 공간 하위 메뉴 */}
                <div className="workspace-list">
                    <div className="workspace-list-item">내 To Do List 목록</div>
                    <div className="workspace-list-item">To Do List 작성</div>
                    <div className="workspace-list-item">작업 폴더 생성</div>
                    <div className="workspace-list-item">모든 작업 폴더</div>
                </div>
            </div>
        </div>
    );
};

export default SidebarFavorites;
