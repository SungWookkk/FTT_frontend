import React from "react";
import "../dashboard/css/Sidebar.css";
import userinfo from "../../Auth/css/img/default-user.svg";
import "../team/css/ChatSidebar.css";
/**
 * @param onBack {Function} - "기본 사이드바"로 돌아갈 때 호출하는 콜백
 */
function ChatSidebar({ onBack }) {
    return (
        <div className="sidebar-container1" style={{backgroundColor: "#f7f8f9"}}>
            {/* 사용자 정보 영역 */}
            <div className="sidebar-user1" style={{position: "relative", cursor: "pointer"}}>
                <img className="user-icon" src={userinfo} alt="User Icon"/>
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

            {/* 채팅 콘텐츠 영역 */}
            <nav className="sidebar-content1">
                {/* 채널 목록 */}
                <ul className="sidebar-menu1">
                    <li style={{ marginTop: 15 }}>
                        <span style={{ fontSize: "14px", color: "#656f7d", fontWeight: 700 }}>채널 목록</span>
                    </li>
                    {/* 내비게이션 링크가 아니라 단순 버튼 형태로 대체하여 href 관련 ESLint 경고를 피함 */}
                    <li>
                        <button className="sidebar-button">
                            <span>General</span>
                        </button>
                    </li>
                    <li>
                        <button className="sidebar-button">
                            <span>공지사항</span>
                        </button>
                    </li>
                    <li>
                        <button className="sidebar-button">
                            <span>프로젝트 A</span>
                        </button>
                    </li>
                    <li>
                        <button className="sidebar-button">
                            <span>자유 채널</span>
                        </button>
                    </li>
                </ul>

                {/* 구분선 */}
                <div style={{ height: "1px", backgroundColor: "#e8eaed", margin: "20px 0" }} />

                <ul className="sidebar-menu1">
                    <li style={{ marginTop: 15 }}>
                        <span style={{ fontSize: "14px", color: "#656f7d", fontWeight: 700 }}>사용자 목록</span>
                    </li>
                    <li>
                        <button className="sidebar-button">
                            <span className="online">🟢 Alice (온라인)</span>
                        </button>
                    </li>
                    <li>
                        <button className="sidebar-button">
                            <span className="offline">⚪ Bob (오프라인)</span>
                        </button>
                    </li>
                    <li>
                        <button className="sidebar-button">
                            <span className="offline">⚪ Charlie (오프라인)</span>
                        </button>
                    </li>
                </ul>
            </nav>
                {/* 하단 (도움말 등) */}
            <div className="help-section1">
                <button className="help-button1">공유</button>
                <div className="div-cu-simple-bar1"/>
                <button className="share-button1">도움말</button>
            </div>
        </div>
    );
}

export default ChatSidebar;
