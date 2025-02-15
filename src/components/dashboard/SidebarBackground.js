import React from "react";
import "../css/SidebarBackground.css"; // CSS 파일 유지

const SidebarBackground = () => {
    return (
        <aside className="sidebar-background">
            {/* 배경 박스 */}
            <div className="background-box">
                <div className="help-secti  on">
                    <div className="help-item">공유</div>
                    <div className="divider"></div>
                    <div className="help-item1">도움말</div>
                </div>
            </div>
        </aside>
    );
};

export default SidebarBackground;
