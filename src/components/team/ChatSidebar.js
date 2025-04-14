import React from "react";
import "../dashboard/css/Sidebar.css";
import userinfo from "../../Auth/css/img/default-user.svg";

/**
 * @param onBack {Function} - "기본 사이드바"로 돌아갈 때 호출하는 콜백
 */
function ChatSidebar({ onBack }) {
    return (
        <div className="sidebar-container" style={{ backgroundColor: "#f7f8f9" }}>
            {/* 사용자 정보 영역 */}
            <div className="sidebar-user" style={{ position: "relative", cursor: "pointer" }}>
                <img className="user-icon" src={userinfo} alt="User Icon" />
                <span className="user-name">팀 채팅 공간</span>

                {/* "기본" 버튼 */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onBack) onBack(); // 부모에서 전달된 콜백 호출
                    }}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "yellow",
                        color: "#333",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                    title="기본 사이드바로 돌아가기"
                >
                    기본
                </div>
            </div>

            <nav className="sidebar-content" style={{ top: "120px" }}>
                {/* 채널 목록 */}
                <ul className="sidebar-menu">
                    <li style={{ marginTop: 15 }}>
                        <span style={{ fontSize: "14px", color: "#656f7d", fontWeight: 700 }}>채널 목록</span>
                    </li>
                    <li><a><span>General</span></a></li>
                    <li><a><span>공지사항</span></a></li>
                    <li><a><span>프로젝트 A</span></a></li>
                    <li><a><span>자유 채널</span></a></li>
                </ul>

                {/* 구분선 */}
                <div style={{ height: "1px", backgroundColor: "#e8eaed", margin: "20px 0" }} />

                {/* 사용자 목록 */}
                <ul className="sidebar-menu">
                    <li style={{ marginTop: 15 }}>
                        <span style={{ fontSize: "14px", color: "#656f7d", fontWeight: 700 }}>사용자 목록</span>
                    </li>
                    <li><a><span>Alice (온라인)</span></a></li>
                    <li><a><span>Bob (오프라인)</span></a></li>
                    <li><a><span>Charlie (오프라인)</span></a></li>
                </ul>
            </nav>

            {/* 하단 (도움말 등) */}
            <div className="help-section" style={{ marginTop: "auto" }}>
                <button className="help-button">공유</button>
                <div className="div-cu-simple-bar" />
                <button className="share-button">도움말</button>
            </div>
        </div>
    );
}

export default ChatSidebar;
