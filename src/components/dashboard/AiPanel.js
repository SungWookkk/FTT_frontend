import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../dashboard/css/AiPanel.css";

function AiPanel() {
    const [mode, setMode] = useState("chat"); // 'chat' or 'task'
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef();

    // 1) 모드 변경 또는 마운트 시: 로컬스토리지에서 불러오기
    useEffect(() => {
        const key = `aiMessages_${mode}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            setMessages(JSON.parse(saved));
        } else {
            const systemMsg =
                mode === "chat"
                    ? { from: "ai", text: "무엇을 도와드릴까요?" }
                    : { from: "ai", text: "어떤 작업을 생성할까요? 예: 내일 오전 9시 팀 회의 준비할 작업 만들어줘" };
            setMessages([systemMsg]);
        }
    }, [mode]);

    // 2) messages 변경 시: 로컬스토리지에 저장
    useEffect(() => {
        const key = `aiMessages_${mode}`;
        localStorage.setItem(key, JSON.stringify(messages));
    }, [messages, mode]);

    // 3) 새 메시지가 추가될 때마다 스크롤
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const clearHistory = () => {
        const key = `aiMessages_${mode}`;
        localStorage.removeItem(key);
        const systemMsg =
            mode === "chat"
                ? { from: "ai", text: "무엇을 도와드릴까요?" }
                : { from: "ai", text: "어떤 작업을 생성할까요? 예: 내일 오전 9시 팀 회의 준비할 작업 만들어줘" };
        setMessages([systemMsg]);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        setMessages((m) => [...m, { from: "user", text: input }]);
        const prompt = input;
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("로그인 정보가 없습니다.");

            const endpoint =
                mode === "chat" ? "/api/tasks/chat" : "/api/tasks/ai-create";

            const res = await axios.post(
                endpoint,
                { prompt },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            let aiText;
            if (mode === "chat") {
                aiText = res.data.message;
            } else {
                const dto = res.data;
                aiText = `[Task "${dto.title}" 생성됨]\n마감: ${dto.dueDate}\n우선순위: ${dto.priority}`;
            }

            setMessages((m) => [...m, { from: "ai", text: aiText }]);
        } catch (err) {
            console.error("AI 요청 실패:", err);
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
                <div className="ai-tabs">
                    <div
                        className={`ai-tab ${mode === "chat" ? "ai-tab-active" : ""}`}
                        onClick={() => setMode("chat")}
                    >
                        Chat
                    </div>
                    <div
                        className={`ai-tab ${mode === "task" ? "ai-tab-active" : ""}`}
                        onClick={() => setMode("task")}
                    >
                        To-Do 생성
                    </div>
                </div>
                <button className="ai-clear-btn" onClick={clearHistory}>
                    비우기
                </button>
            </div>

            <div className="ai-content">
                <div className="ai-chat-history">
                    {messages.map((m, i) => (
                        <div key={i} className={`ai-msg ai-${m.from}-msg`}>
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
              placeholder={
                  mode === "chat"
                      ? "예: 오늘 날씨 어때?"
                      : "예: 내일 오전 9시 팀 회의 준비할 작업 만들어줘"
              }
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
