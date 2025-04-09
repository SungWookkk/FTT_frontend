import React, { useState, useEffect } from "react";
import axios from "axios";
import "../team/css/TeamStatusMessage.css";

function TeamStatusMessage({ teamId }) {
    const [message, setMessage] = useState("팀 상태메시지를 불러오는 중...");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const MAX_LENGTH = 50;

    useEffect(() => {
        if (!teamId) return;
        axios
            .get(`/api/teams/${teamId}/statusMessage`)
            .then((res) => {
                // API 응답에 값이 없으면 안내 메시지 표시
                setMessage(res.data?.message || "팀 상태메시지가 없습니다. 팀 상태메시지를 생성하여 팀 작업에 기여해봐요!");
            })
            .catch((err) => {
                console.error("팀 상태메시지 불러오기 오류:", err);
                setMessage("팀 상태메시지가 없습니다. 팀 상태메시지를 생성하여 팀 작업에 기여해봐요!");
            });
    }, [teamId]);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleChange = (e) => {
        if (e.target.value.length <= MAX_LENGTH) {
            setMessage(e.target.value);
        }
    };

    return (
        <div className="team-status-message-container">
            <div className="status-content">
                <span className="status-text">{message}</span>
                <i className="fas fa-cog status-gear-icon" onClick={openModal} />
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
                            value={message}
                            onChange={handleChange}
                            maxLength={MAX_LENGTH}
                        />
                        <div className="char-counter">
                            {message.length} / {MAX_LENGTH}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeamStatusMessage;
