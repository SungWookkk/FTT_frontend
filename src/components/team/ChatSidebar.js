import React, { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import userinfo from "../../Auth/css/img/default-user.svg";
import "../dashboard/css/Sidebar.css";
import "../team/css/ChatSidebar.css";
import AddChannelModal from "./AddChannelModal";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";

/**
 * ChatSidebar 컴포넌트
 * @param {Function} onBack - "기본 사이드바"로 돌아갈 때 호출되는 콜백
 */
function ChatSidebar({ onBack }) {
    const { teamId } = useParams();
    const { auth } = useAuth();

    // 채널 목록 상태 (초기값은 빈 배열; 팀 생성 시 BE에서 기본채널(["General", "공지사항", "자유 채널"])이 설정되어 있어야 함)
    const [channels, setChannels] = useState([]);
    // 사용자 목록: 실제 기능에서는 서버에서 가져오지만 여기서는 임시로 사용
    const [users] = useState([
        { name: "Alice (온라인)", status: "online" },
        { name: "Bob (오프라인)", status: "offline" },
        { name: "Charlie (오프라인)", status: "offline" },
    ]);

    // 모달 열림 여부
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 팀 채널 목록을 BE로부터 불러오기 (컴포넌트 마운트 시, 팀ID 변경 시)
    useEffect(() => {
        if (teamId) {
            axios
                .get(`/api/team/${teamId}/channels`)
                .then((res) => {
                    setChannels(res.data);
                })
                .catch((err) => {
                    console.error("채널 목록 불러오기 실패:", err);
                });
        }
    }, [teamId]);

    // "+ 채널 추가" 버튼 클릭: 모달 열기
    const handleAddChannelClick = () => {
        setIsModalOpen(true);
    };

    // 모달에서 생성 버튼을 누르면 채널 추가 처리 (DB에 채널 추가 API 호출 후 state 업데이트)
    const handleCreateChannel = (newChannelName) => {
        const payload = {
            channelName: newChannelName,
            description: "",
            // 생성자 정보: BE는 createdBy가 UserInfo 엔티티 여기서는 ID를 전달
            createdBy: { id: auth.userId },
        };

        axios
            .post(`/api/team/${teamId}/channels`, payload)
            .then((res) => {
                // 응답으로 새 채널 객체가 넘어온다고 가정하고, state에 추가
                setChannels((prev) => [...prev, res.data]);
                setIsModalOpen(false);
            })
            .catch((err) => {
                console.error("채널 생성 실패:", err);
            });
    };

    // 모달 닫기 처리
    const handleCancelAddChannel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="sidebar-container1">
            {/* 사용자 정보 영역 */}
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
                {/* 채널 목록 헤더 */}
                <ul className="sidebar-menu1">
                    <li className="channel-header">
                        <span className="channel-title">채널 목록</span>
                        <button className="add-channel-button" onClick={handleAddChannelClick}>
                            + 채널 추가
                        </button>
                    </li>
                </ul>

                {/* 채널 목록 스크롤 영역 */}
                <ul className="sidebar-menu1 channel-list-scroll">
                    {channels.map((channel) => (
                        <li key={channel.id}>
                            <Link
                                to={`/team/${teamId}/community/${channel.id}`}
                                className="sidebar-button"
                                style={{textDecoration: "none"}}
                            >
                                <span>{channel.channelName}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* 구분선 */}
                <div style={{height: "1px", backgroundColor: "#e8eaed", margin: "20px 0", width: "240px"}}/>

                {/* 사용자 목록 스크롤 영역 */}
                <ul className="sidebar-menu1 user-list-scroll">
                    <li>
            <span style={{fontSize: "14px", color: "#656f7d", fontWeight: 700}}>
              사용자 목록
            </span>
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

            {/* 하단 (도움말 & 공유) */}
            <div className="help-section1">
                <button className="help-button1">공유</button>
                <div className="div-cu-simple-bar1"/>
                <button className="share-button1">도움말</button>
            </div>

            {/* 채널 추가 모달 */}
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
