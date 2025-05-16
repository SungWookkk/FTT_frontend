import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../dashboard/css/AiPanel.css";

function AiPanel() {
    const [messages, setMessages] = useState([
        { from: "ai", text: "무엇을 도와드릴까요?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        setMessages((m) => [...m, { from: "user", text: input }]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "/api/tasks/ai-create",
                { prompt: input },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const aiText = res.data.summary || JSON.stringify(res.data, null, 2);
            setMessages((m) => [...m, { from: "ai", text: aiText }]);
        } catch {
            setMessages((m) => [
                ...m,
                { from: "error", text: "AI 요청 중 오류가 발생했습니다." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="ai-panel">
            <div className="ai-header">
                <span className="ai-header-title">AI 비서</span>
            </div>

            <div className="ai-content">
                <div className="ai-chat-history">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`ai-msg ai-${m.from}-msg`}
                        >
                            {m.text}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div className="ai-input-area">
          <textarea
              className="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="예: 내일 오전 9시 팀 회의 준비할 작업 만들어줘"
          />
                    <button
                        className="ai-send-btn"
                        onClick={sendMessage}
                        disabled={loading}
                    >
                        {loading ? "…" : "전송"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AiPanel;
