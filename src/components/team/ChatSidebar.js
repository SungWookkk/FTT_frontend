import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import userinfo from "../../Auth/css/img/default-user.svg";
import "../dashboard/css/Sidebar.css";
import "../team/css/ChatSidebar.css";
import AddChannelModal from "./AddChannelModal";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";

function ChatSidebar({ onBack }) {
    const { teamId } = useParams();
    const { auth } = useAuth();
    // 실제 팀원 엔티티 기반 state
    const [members, setMembers] = useState([]);

    // 임시 더미 데이터 (로컬 테스트용)
    const dummyChannels = [
        { id: 1, channelName: "General" },
        { id: 2, channelName: "공지사항" },
        { id: 3, channelName: "자유 채널" }
    ];

    const [channels, setChannels] = useState(dummyChannels);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (teamId) {
            axios
                .get(`/api/team/${teamId}/channels`)
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        setChannels(res.data);
                    }
                })
                .catch((err) => {
                    console.error("채널 목록 불러오기 실패:", err);
                });
        }
    }, [teamId]);

    useEffect(() => {
        axios.get(`/api/teams/${teamId}/members`)
            .then(res => {
                // res.data 는 UserInfo[] 형식
                setMembers(
                    res.data.map(u => ({
                        id: u.id,
                        name: u.username,
                        status: "offline"   // 나중에 WebSocket Presence 로 업데이팅
                    }))
                );
            })
            .catch(err => console.error("팀원 조회 실패:", err));
    }, [teamId]);

    const handleAddChannelClick = () => {
        setIsModalOpen(true);
    };

    const handleCreateChannel = (newChannelName) => {
        const payload = {
            channelName: newChannelName,
            description: "",
            createdBy: { id: auth.userId }
        };

        axios
            .post(`/api/team/${teamId}/channels`, payload)
            .then((res) => {
                setChannels((prev) => [...prev, res.data]);
                setIsModalOpen(false);
            })
            .catch((err) => {
                console.error("채널 생성 실패:", err);
            });
    };

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
                        onBack && onBack();
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
                        <button
                            className="add-channel-button"
                            onClick={handleAddChannelClick}
                        >
                            + 채널 추가
                        </button>
                    </li>
                </ul>

                <ul className="sidebar-menu1 channel-list-scroll">
                    {channels.map((channel) => (
                        <li key={channel.id}>
                            <NavLink
                                to={`/team/${teamId}/community/${channel.id}`}
                                exact
                                className="sidebar-button"
                                activeClassName="active-channel"
                                style={{textDecoration: "none"}}
                            >
                                {channel.channelName}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div
                    style={{
                        height: "1px",
                        backgroundColor: "#e8eaed",
                        margin: "20px 0",
                        width: "240px"
                    }}
                />

                <ul className="sidebar-menu1 user-list-scroll">
                    <li><span className="channel-title">사용자 목록</span></li>
                    {members.map(u => (
                        <li key={u.id}>
                            <button className="sidebar-button">
                                {u.status === "online"
                                    ? <span className="online">🟢 {u.name}</span>
                                    : <span className="offline">⚪ {u.name}</span>
                                }
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="help-section1">
                <button className="help-button1">공유</button>
                <div className="div-cu-simple-bar1"/>
                <button className="share-button1">도움말</button>
            </div>

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
