import React from "react";
import "../css/SidebarBackground.css"; // CSS 파일 유지

const SidebarBackground = () => {
    return (
        <aside className="sidebar-background">
            {/* 배경 박스 */}
            <div className="background-box">
                <div className="help-section">
                    <button className="help-button">도움말</button>
                    <button className="share-button">공유</button>
                </div>
            </div>
        </aside>
    );
};

export default SidebarBackground;
