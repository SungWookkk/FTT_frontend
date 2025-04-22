import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import userinfo from "../../Auth/css/img/default-user.svg";
import "../dashboard/css/Sidebar.css";
import "../team/css/ChatSidebar.css";
import AddChannelModal from "./AddChannelModal";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import { Client } from "@stomp/stompjs";

function ChatSidebar({ onBack }) {
    const { teamId } = useParams();
    const { auth } = useAuth();
    const [members, setMembers] = useState([]);
    const [channels, setChannels] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1) 채널 목록
    useEffect(() => {
        if (!teamId) return;
        axios.get(`/api/team/${teamId}/channels`)
            .then(res => setChannels(res.data))
            .catch(console.error);
    }, [teamId]);

    // 2) 팀원 로딩 (offline 으로 세팅)
    useEffect(() => {
        if (!teamId) return;
        axios.get(`/api/teams/${teamId}/members`)
            .then(res => {
                setMembers(res.data.map(u => ({
                    id: u.id,
                    name: u.username,
                    status: "offline"
                })));
            })
            .catch(console.error);
    }, [teamId]);

    // 3) → 팀원 로딩이 끝나면(=members.length>0) STOMP Presence 로직 실행
    useEffect(() => {
        if (!auth?.userId || !teamId || members.length === 0) return;

        const presenceClient = new Client({
            brokerURL: "ws://localhost:8080/ws",
            reconnectDelay: 5000,
        });

        presenceClient.onConnect = () => {
            console.log("Presence STOMP connected");

            // (A) 구독 먼저
            presenceClient.subscribe(
                `/topic/presence/${teamId}`,
                ({ body }) => {
                    const onlineIds = JSON.parse(body);
                    console.log("Presence update received:", onlineIds);
                    setMembers(prev =>
                        prev.map(m => ({
                            ...m,
                            status: onlineIds.includes(m.id) ? "online" : "offline"
                        }))
                    );
                }
            );

            // (B) 구독이 걸리고 나서야 join 알림
            presenceClient.publish({
                destination: "/app/presence/join",
                body: JSON.stringify({ userId: auth.userId, teamId }),
            });
            console.log("Sent presence/join");
        };

        presenceClient.activate();

        const handleLeave = () => {
            presenceClient.publish({
                destination: "/app/presence/leave",
                body: JSON.stringify({ userId: auth.userId, teamId }),
            });
            presenceClient.deactivate();
            console.log("Sent presence/leave");
        };
        window.addEventListener("beforeunload", handleLeave);

        return () => {
            window.removeEventListener("beforeunload", handleLeave);
            handleLeave();
        };
    }, [auth?.userId, teamId, members.length]);

    const handleAddChannelClick = () => setIsModalOpen(true);
    const handleCreateChannel = newChannelName => {
        const payload = {
            channelName: newChannelName,
            description: "",
            createdBy: { id: auth.userId }
        };
        axios.post(`/api/team/${teamId}/channels`, payload)
            .then(res => {
                setChannels(prev => [...prev, res.data]);
                setIsModalOpen(false);
            })
            .catch(err => console.error("채널 생성 실패:", err));
    };
    const handleCancelAddChannel = () => setIsModalOpen(false);

    return (
        <div className="sidebar-container1">
            <div className="sidebar-user1">
                <img className="user-icon" src={userinfo} alt="User Icon" />
                <span className="user-name">팀 채팅 공간</span>
                <div
                    className="basic-button"
                    onClick={e => { e.stopPropagation(); onBack && onBack(); }}
                    title="기본 사이드바로 돌아가기"
                >
                    기본
                </div>
            </div>

            <nav className="sidebar-content1">
                <ul className="sidebar-menu1">
                    <li className="channel-header">
                        <span className="channel-title">채널 목록</span>
                        <button className="add-channel-button" onClick={handleAddChannelClick}>
                            + 채널 추가
                        </button>
                    </li>
                </ul>

                <ul className="sidebar-menu1 channel-list-scroll">
                    {channels.map(channel => (
                        <li key={channel.id}>
                            <NavLink
                                to={`/team/${teamId}/community/${channel.id}`}
                                exact
                                className="sidebar-button"
                                activeClassName="active-channel"
                                style={{ textDecoration: "none" }}
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
                <div className="div-cu-simple-bar1" />
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
