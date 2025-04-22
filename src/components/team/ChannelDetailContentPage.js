import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import TeamDropdown from "./TeamDropdown";
import { Client } from "@stomp/stompjs";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";

function ChannelDetailContentPage() {
    const { teamId, channelId } = useParams();
    const history = useHistory();
    const location = useLocation();
    const { auth } = useAuth();              // auth.userId, auth.username 등 제공된다고 가정

    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("연결 중...");
    const [members, setMembers] = useState([]);
    const handleTeamSelect = (selectedTeam) => {
        history.push(`/team/${selectedTeam.id}`);
    };

    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;

    // avoid “assigned but never used” lint error by logging members
    useEffect(() => {
        console.log("현재 팀원 상태:", members);
    }, [members]);

    useEffect(() => {
        if (!channelId || !auth?.userId) return;

        // 1) 초기화
        setMessages([]);
        setConnectionStatus("연결 중...");

        // 2) 과거 메시지 히스토리 조회
        axios
            .get(`/api/chat/channels/${channelId}/messages`)
            .then((res) => setMessages(res.data))
            .catch((err) => console.error("히스토리 불러오기 실패:", err));

        // 3) STOMP 클라이언트 생성
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            setConnectionStatus("연결됨");

            // A) 채널별 메시지 구독
            client.subscribe(`/topic/chat/${channelId}`, (frame) => {
                const msg = JSON.parse(frame.body);
                setMessages((prev) => [...prev, msg]);
            });

            // B) Presence 목록 구독
            client.subscribe(`/topic/presence/${teamId}`, (frame) => {
                const onlineIds = JSON.parse(frame.body);
                setMembers((prev) =>
                    prev.map((u) => ({
                        ...u,
                        status: onlineIds.includes(u.id) ? "online" : "offline",
                    }))
                );
            });

            // C) 나 입장 알림
            client.publish({
                destination: "/app/presence/join",
                body: JSON.stringify({ userId: auth.userId, teamId: parseInt(teamId, 10) }),
            });
        };

        client.onStompError = (frame) => {
            console.error("STOMP 오류:", frame);
            setConnectionStatus(`STOMP 오류: ${frame.headers?.message || "unknown"}`);
        };
        client.onWebSocketError = (evt) => {
            console.error("웹소켓 오류:", evt);
            setConnectionStatus(`WS 오류: ${evt.type}`);
        };

        client.activate();
        setStompClient(client);

        // 언마운트 시: leave 알림 + 연결 해제
        return () => {
            if (client.connected) {
                client.publish({
                    destination: "/app/presence/leave",
                    body: JSON.stringify({ userId: auth.userId, teamId: parseInt(teamId, 10) }),
                });
            }
            client.deactivate();
            console.log("웹소켓 연결 해제");
        };
    }, [channelId, teamId, auth.userId]);

    // 메시지 전송
    const sendTestMessage = () => {
        if (!stompClient?.connected || !text.trim()) {
            console.log(
                "메시지를 보낼 수 없습니다:",
                stompClient?.connected ? "텍스트 없음" : "연결 안됨"
            );
            return;
        }
        const payload = {
            sender: { id: auth.userId },
            content: text,
            channelId: parseInt(channelId, 10),
        };
        stompClient.publish({
            destination: `/app/chat/send/${channelId}`,
            body: JSON.stringify(payload),
        });
        setText("");
    };

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown
                        onTeamSelect={handleTeamSelect}
                        disableAutoSelect={true}
                    />
                </div>
            </div>

            <div className="list-tap">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <div className="list-tab-container">
                        <div
                            className={`tab-item ${isMainPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}`)}
                        >
                            메인
                        </div>
                        <div
                            className={`tab-item ${isTodoPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}/todo`)}
                        >
                            팀 Todo
                        </div>
                        <div
                            className={`tab-item ${
                                !isMainPage && !isTodoPage ? "active" : ""
                            }`}
                            onClick={() =>
                                history.push(`/team/${teamId}/community/${channelId}`)
                            }
                        >
                            소통
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert-banner-todo">
                <p className="alert-text">
                    <span className="highlight-text">팀</span>
                    <span className="normal-text">은 공동의 목표를 위해 함께 </span>
                    <span className="highlight-text">소통하고 협업</span>
                    <span className="normal-text">하는 공간입니다.</span>
                </p>
            </div>

            {/* 채팅 UI */}
            <div style={{ padding: 20, border: "1px solid #ddd", marginTop: 20 }}>
                <h3>
                    채널 {channelId} - 채팅 ({connectionStatus})
                </h3>
                <div
                    style={{
                        height: 200,
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        padding: 8,
                        marginBottom: 8,
                    }}
                >
                    {messages.map((m, i) => (
                        <div key={i}>
                            <strong>{m.sender}:</strong> {m.content}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ width: "80%", padding: 8 }}
                    placeholder="메시지를 입력하세요"
                />
                <button
                    onClick={sendTestMessage}
                    style={{
                        padding: "8px 12px",
                        marginLeft: 8,
                        backgroundColor: stompClient?.connected ? "#4CAF50" : "#cccccc",
                    }}
                    disabled={!stompClient?.connected}
                >
                    전송
                </button>
            </div>
        </div>
    );
}

export default ChannelDetailContentPage;
