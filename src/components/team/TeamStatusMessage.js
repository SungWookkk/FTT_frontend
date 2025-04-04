import React, { useState } from "react";
import "../team/css/TeamStatusMessage.css";

function TeamStatusMessage() {
    // 팀 상태메시지 (임시)
    const [message, setMessage] = useState("임시 팀 상태메시지 입니다.");
    // 모달 열림/닫힘
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 최대 글자 수 제한
    const MAX_LENGTH = 50;

    // 모달 열기
    const openModal = () => {
        setIsModalOpen(true);
    };
    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // textarea 변경 핸들러
    const handleChange = (e) => {
        // 입력값이 MAX_LENGTH를 넘지 않도록
        if (e.target.value.length <= MAX_LENGTH) {
            setMessage(e.target.value);
        }
    };

    return (
        <div className="team-status-message-container">
            <div className="status-content">
                {/* 화면에 표시할 상태메시지 (한 줄 + 말줄임 처리) */}
                <span className="status-text">{message}</span>

                {/* 톱니바퀴 아이콘 (클릭 시 모달 열림) */}
                <i className="fas fa-cog status-gear-icon" onClick={openModal} />
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div className="status-modal-overlay" onClick={closeModal}>
                    <div
                        className="status-modal-content"
                        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭은 닫힘 방지
                    >
                        {/* 닫기(X) 버튼 */}
                        <button className="modal-close-btn" onClick={closeModal}>
                            ×
                        </button>
                        <h3>팀 상태메시지 수정</h3>
                        {/* 입력 폼 (maxLength 적용) */}
                        <textarea
                            className="status-textarea"
                            value={message}
                            onChange={handleChange}
                            maxLength={MAX_LENGTH}
                        />
                        {/* 현재 글자수/최대 글자수 안내 */}
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
