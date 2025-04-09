import React, { useState, useEffect } from "react";
import axios from "axios";
import "../team/css/TeamStatusMessage.css";

function TeamStatusMessage({ teamId }) {
    const [message, setMessage] = useState("팀 상태메시지를 불러오는 중...");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempMessage, setTempMessage] = useState("");
    const MAX_LENGTH = 50;

    useEffect(() => {
        if (!teamId) return;
        axios
            .get(`/api/team/${teamId}/statusMessage`)
            .then((res) => {
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

    // 모달 열기/닫기
    const openModal = () => {
        setTempMessage(message);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // textarea 변경 핸들러
    const handleChange = (e) => {
        if (e.target.value.length <= MAX_LENGTH) {
            setTempMessage(e.target.value);
        }
    };

    // 저장 버튼 클릭 -> PUT 요청
    const handleSave = () => {
        axios
            .put(`/api/team/${teamId}/statusMessage`, tempMessage, {
                headers: { "Content-Type": "text/plain" }
            })
            .then(() => {
                setMessage(tempMessage);
                closeModal();
            })
            .catch((err) => {
                console.error("팀 상태메시지 저장 오류:", err);
            });
    };


    return (
        <div className="team-status-message-container">
            {/* 전체 박스에 onClick을 걸어 클릭 시 모달 열기 */}
            <div
                className="status-content clickable"
                onClick={openModal}
            >
                <span className="status-text">{message}</span>
            </div>

            {/* 모달 */}
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
