import React, {useEffect, useState} from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import TeamDropdown from "./TeamDropdown";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function ChannelDetailContentPage() {
    const { teamId } = useParams();
    const history = useHistory();
    const location = useLocation();

    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const handleTeamSelect = (selectedTeam) => {
        history.push(`/team/${selectedTeam.id}`);
    };

    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;



    useEffect(() => {
        // 1) STOMP 클라이언트 생성
        const client = new Client({
            // SockJS 팩토리 지정
            webSocketFactory: () => new SockJS("/ws"),
            // 자동 재접속
            reconnectDelay: 5000,
        });

        // 2) 연결 성공 시 구독
        client.onConnect = () => {
            client.subscribe("/topic/chat", (msg) => {
                const body = JSON.parse(msg.body);
                setMessages((prev) => [...prev, body]);
            });
        };

        // 3) 활성화
        client.activate();
        setStompClient(client);

        // 4) 언마운트 시 연결 해제
        return () => {
            client.deactivate();
        };
    }, []);

    const sendTestMessage = () => {
        if (stompClient && stompClient.connected && text.trim()) {
            stompClient.publish({
                destination: "/app/chat/send",
                body: JSON.stringify({
                    sender: "테스트사용자",
                    content: text,
                }),
            });
            setText("");
        }
    };

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown onTeamSelect={handleTeamSelect} disableAutoSelect={true} />
                </div>
            </div>
            <div className="list-tap">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div className="list-tab-container">
                        <div className={`tab-item ${isMainPage ? "active" : ""}`} onClick={() => history.push(`/team/${teamId}`)}>
                            메인
                        </div>
                        <div className={`tab-item ${isTodoPage ? "active" : ""}`} onClick={() => history.push(`/team/${teamId}/todo`)}>
                            팀 Todo
                        </div>
                        <div className={`tab-item ${isTodoPage ? "active" : ""}`} onClick={() => history.push(`/team/${teamId}/community`)}>
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
                    <span className="normal-text">하는 공간입니다. 서로의 아이디어와 역량을 모아 </span>
                    <span className="highlight-text">시너지를 발휘</span>
                    <span className="normal-text">하며, 매일의 과제를 함께 해결해 보세요. 작지만 꾸준한 노력들이 모여 </span>
                    <span className="highlight-text">팀의 성장</span>
                    <span className="normal-text">을 이끌어냅니다!</span>
                </p>
            </div>
            {/* 테스트 채팅 UI */}
            <div style={{ padding: 20, border: "1px solid #ddd", marginTop: 20 }}>
                <h3>WebSocket Chat Test</h3>
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
                <button onClick={sendTestMessage} style={{ padding: "8px 12px", marginLeft: 8 }}>
                    전송
                </button>
            </div>
        </div>
    );
}
export default ChannelDetailContentPage;
