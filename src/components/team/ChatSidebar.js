import React, { useState } from "react";
import userinfo from "../../Auth/css/img/default-user.svg";
import "../dashboard/css/Sidebar.css";
import "../team/css/ChatSidebar.css";
import AddChannelModal from "./AddChannelModal";

/**
 * @param onBack {Function} - "기본 사이드바"로 돌아갈 때 호출하는 콜백
 */
function ChatSidebar({ onBack }) {
    // 1) 채널 목록을 state로 관리 (초기값 임의 설정)
    const [channels, setChannels] = useState(["General", "공지사항", "프로젝트 A", "자유 채널"]);

    // 임시 예시: 사용자 목록
    const [users] = useState([
        { name: "Alice (온라인)", status: "online" },
        { name: "Bob (오프라인)", status: "offline" },
        { name: "Charlie (오프라인)", status: "offline" },
        { name: "Charlie (오프라인)", status: "offline" },
        { name: "Charlie (오프라인)", status: "offline" },
        { name: "Charlie (오프라인)", status: "offline" },
    ]);

    // 모달 열림 여부
    const [isModalOpen, setIsModalOpen] = useState(false);

    // "+ 채널 추가" 버튼 클릭 -> 모달 열기
    const handleAddChannelClick = () => {
        setIsModalOpen(true);
    };

    // 모달에서 "생성" 버튼 클릭 시
    const handleCreateChannel = (newChannelName) => {
        setChannels((prev) => [...prev, newChannelName]);
        setIsModalOpen(false);
    };

    // 모달에서 "취소"/배경 클릭 시
    const handleCancelAddChannel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="sidebar-container1">
            <div className="sidebar-user1">
                <img className="user-icon" src={userinfo} alt="User Icon" />
                <span className="user-name">팀 채팅 공간</span>

                <div
                    className="basic-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onBack) onBack();
                    }}
                    title="기본 사이드바로 돌아가기"
                >
                    기본
                </div>
            </div>

            <nav className="sidebar-content1">
                <ul className="sidebar-menu1">
                    <li className="channel-header">
                        <span className="channel-title">채널 목록</span>
                        <button className="add-channel-button" onClick={handleAddChannelClick}>+ 채널 추가</button>
                    </li>
                </ul>

                {/* ===== 채널 목록: 스크롤 영역 ===== */}
                <ul className="sidebar-menu1 channel-list-scroll">
                    {channels.map((channelName, idx) => (
                        <li key={idx}>
                            <button className="sidebar-button">
                                <span>{channelName}</span>
                            </button>
                        </li>
                    ))}
                </ul>


                {/* 구분선 */}
                <div style={{ height: "1px", backgroundColor: "#e8eaed", margin: "20px 0" }} />

                {/* ==== 사용자 목록: 스크롤 영역 ==== */}
                <ul className="sidebar-menu1 user-list-scroll">
                    <li>
                        <span style={{ fontSize: "14px", color: "#656f7d", fontWeight: 700 }}>사용자 목록</span>
                    </li>
                    {users.map((u, idx) => (
                        <li key={idx}>
                            <button className="sidebar-button">
                                {u.status === "online" ? (
                                    <span className="online">🟢 {u.name}</span>
                                ) : (
                                    <span className="offline">⚪ {u.name}</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* 하단 (도움말 등) */}
            <div className="help-section1">
                <button className="help-button1">공유</button>
                <div className="div-cu-simple-bar1" />
                <button className="share-button1">도움말</button>
            </div>

            {/* 모달: AddChannelModal */}
            {isModalOpen && (
                <AddChannelModal
                    onCreateChannel={handleCreateChannel}
                    onCancel={handleCancelAddChannel}
                />
            )}
        </div>
    );
}

export default ChatSidebar;
