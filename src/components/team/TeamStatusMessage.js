import React, { useEffect, useState } from "react";
import axios from "axios";
import "../team/css/TeamStatusMessage.css";

function TeamStatusMessage({ teamId }) {
    const [message, setMessage] = useState("팀 상태메시지를 불러오는 중...");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempMessage, setTempMessage] = useState("");
    const MAX_LENGTH = 50;

    useEffect(() => {
        console.log("TeamStatusMessage useEffect - teamId:", teamId);
        if (!teamId) return;
        axios
            .get(`/api/team/${teamId}/statusMessage`)
            .then((res) => {
                console.log("TeamStatusMessage - API 응답:", res.data);
                if (typeof res.data === "string") {
                    setMessage(res.data);
                } else {
                    setMessage(res.data?.message || "");
                }
            })
            .catch((err) => {
                console.error("팀 상태메시지 불러오기 오류:", err);
                setMessage("팀 상태메시지가 없습니다. 팀 상태메시지를 생성하여 팀 작업에 기여해봐요!");
            });
    }, [teamId, tempMessage]);

    const openModal = () => {
        console.log("TeamStatusMessage - 모달 열기, 현재 메시지:", message);
        setTempMessage(message);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        console.log("TeamStatusMessage - 모달 닫기");
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        if (e.target.value.length <= MAX_LENGTH) {
            setTempMessage(e.target.value);
        }
    };

    const handleSave = () => {
        axios
            .put(`/api/team/${teamId}/statusMessage`, tempMessage, {
                headers: { "Content-Type": "text/plain" }
            })
            .then(() => {
                console.log("TeamStatusMessage - 저장 성공, 새 메시지:", tempMessage);
                setMessage(tempMessage);
                closeModal();
            })
            .catch((err) => {
                console.error("팀 상태메시지 저장 오류:", err);
            });
    };

    return (
        <div className="team-status-message-container">
            <div
                className="status-content clickable"
                onClick={openModal}
            >
                <span className="status-text">{message}</span>
            </div>
            {isModalOpen && (
                <div className="status-modal-overlay" onClick={closeModal}>
                    <div className="status-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>
                            ×
                        </button>
                        <h3>팀 상태메시지 수정</h3>
                        <textarea
                            className="status-textarea"
                            value={tempMessage}
                            onChange={handleChange}
                            maxLength={MAX_LENGTH}
                        />
                        <div className="char-counter">
                            {tempMessage.length} / {MAX_LENGTH}
                        </div>
                        <div className="modal-actions">
                            <button className="save-btn" onClick={handleSave}>
                                저장
                            </button>
                            <button className="cancel-btn" onClick={closeModal}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeamStatusMessage;
