import React from "react";
import "../team/css/TeamDetailModal.css";

const TeamDetailModal = ({ isOpen, onClose, team }) => {
    if (!isOpen || !team) return null;

    return (
        <div className="detail-modal-overlay" onClick={onClose}>
            <div className="detail-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="detail-close-button" onClick={onClose}>
                    ×
                </button>
                <h2 className="detail-modal-title">팀 상세 정보</h2>

                <div className="detail-field">
                    <label>팀 이름</label>
                    <div className="detail-value">{team.teamName}</div>
                </div>

                <div className="detail-field">
                    <label>팀 설명</label>
                    <div className="detail-value">{team.description}</div>
                </div>

                <div className="detail-field">
                    <label>팀 공지사항</label>
                    <div className="detail-value">{team.notice}</div>
                </div>

                <div className="detail-field">
                    <label>팀 인원수</label>
                    <div className="detail-value">{team.members?.length ?? 0}명</div>
                </div>

                <div className="detail-field">
                    <label>카테고리</label>
                    <div className="detail-value">{team.category}</div>
                </div>


                <div className="detail-field">
                    <label>팀장</label>
                    <div className="detail-value">{team.leaderNickname}</div>
                </div>
            </div>
        </div>
    );
};

export default TeamDetailModal;
