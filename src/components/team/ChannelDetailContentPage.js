import React, {useEffect, useRef, useState} from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import TeamDropdown from "./TeamDropdown";
import { Client } from "@stomp/stompjs";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";
import "../team/css/ChannelDetailContentPage.css"
import userinfo from "../../Auth/css/img/default-user.svg";
function ChannelDetailContentPage() {
    const { teamId, channelId } = useParams();
    const history = useHistory();
    const location = useLocation();
    const { auth } = useAuth();
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("연결 중...");
    const [members, setMembers] = useState([]);
    const textareaRef = useRef(null);
    const handleTeamSelect = (selectedTeam) => {
        history.push(`/team/${selectedTeam.id}`);
    };

    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;


    // 입력 시마다 높이 자동 조절
    const handleTextChange = (e) => {
        setText(e.target.value);
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';
    };

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


            <div className="channel-detail-wrapper">
                {/* 1) 채널 설명 */}
                <div className="channel-info">
                    <h2># 일반 - ({connectionStatus})</h2>
                    <p>
                        고객님이 이 채널을 생성한 날짜는: 2025년 4월 22일입니다.
                        #일반 채널의 맨 첫 부분입니다. … (채널 설명)
                    </p>
                </div>

                <div className="messages-container">
                    {messages.map((m, i) => {
                        // 현재 메시지 시간 (HH:mm)
                        const time = new Date(m.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        // 이전 메시지
                        const prev = messages[i - 1];
                        const prevTime = prev
                            ? new Date(prev.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : null;

                        // 같은 유저 && 같은 시간(분) 이면 header 숨김
                        const showHeader = !prev || prev.sender !== m.sender || prevTime !== time;

                        return (
                            <div
                                className="message"
                                key={i}
                                onMouseEnter={() => setHoveredMessage(i)}
                                onMouseLeave={() => setHoveredMessage(null)}
                            >
                                {showHeader && (
                                    <img src={userinfo} alt="avatar" className="avatar1" />
                                )}

                                <div className="message-content">
                                    {showHeader && (
                                        <div className="message-header">
                                            <span className="message-username">{m.sender}</span>
                                            <span className="message-timestamp">{time}</span>
                                        </div>
                                    )}

                                    {/* 메시지 본문은 항상 렌더 */}
                                    <div
                                        className={`message-text-block ${showHeader ? "" : "indent"}`}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                                {/* 액션 아이콘 */}
                                {hoveredMessage === i && (
                                    <div className="message-actions">
                                        <button title="확인">✅</button>
                                        <button title="눈">👀</button>
                                        <button title="하이파이브">🙌</button>
                                        <button title="반응">😊</button>
                                        <button title="댓글">💬</button>
                                        <button title="더보기">⋯</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 3) 입력 폼 */}
                <div className="chat-input-container">
                    <div className="chat-input-box">
                        <div className="chat-toolbar">
                            <button className="icon-btn"><b>B</b></button>
                            <button className="icon-btn"><i>I</i></button>
                            <button className="icon-btn"><s>S</s></button>
                            <button className="icon-btn">🔗</button>
                            <button className="icon-btn">• • •</button>
                            <button className="icon-btn"><code>{'</>'}</code></button>
                        </div>

                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={handleTextChange}
                            placeholder={`#일반 채널에 메시지 보내기`}
                        />

                        <div className="chat-actions">
                            <button className="action-btn">Aa</button>
                            <button className="action-btn">😊</button>
                            <button className="action-btn">@</button>
                            <button className="action-btn">📎</button>
                            <button className="action-btn">🎥</button>
                            <button className="action-btn">🎤</button>
                            <button className="action-btn">✏️</button>
                        </div>
                    </div>

                    <button
                        className="send-btn"
                        onClick={sendTestMessage}
                        disabled={!stompClient?.connected || !text.trim()}
                    >
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChannelDetailContentPage;
