import React, { useEffect, useState } from "react";
import axios from "axios";
import "../team/css/TeamDetailModal.css";

const TeamDetailModal = ({ isOpen, onClose, teamId }) => {
    const [team, setTeam] = useState(null);

    useEffect(() => {
        if (!isOpen || !teamId) return;
        axios.get(`/api/teams/${teamId}/detail`)
            .then(res => setTeam(res.data))
            .catch(console.error);
    }, [isOpen, teamId]);

    if (!isOpen || !team) return null;

    return (
        <div className="detail-modal-overlay2" onClick={onClose}>
            <div className="detail-modal-container2" onClick={e => e.stopPropagation()}>
                <button className="detail-close-button2" onClick={onClose}>×</button>
                <h2 className="detail-modal-title2">팀 상세 정보</h2>

                <div className="detail-field2">
                    <label>팀 이름</label>
                    <div className="detail-value2">{team.teamName}</div>
                </div>

                <div className="detail-field2">
                    <label>팀 설명</label>
                    <div className="detail-value2">{team.description}</div>
                </div>

                <div className="detail-field2">
                    <label>팀 공지사항</label>
                    <div className="detail-value2">{team.announcement}</div>
                </div>

                <div className="detail-field2">
                    <label>팀 인원수</label>
                    <div className="detail-value2">{team.memberUsernames.length}명</div>
                </div>

                <div className="detail-field2">
                    <label>카테고리</label>
                    <div className="detail-value2">{team.category}</div>
                </div>

                <div className="detail-field2">
                    <label>팀장</label>
                    <div className="detail-value2">{team.leaderUsername}</div>
                </div>
            </div>
        </div>
    );
};

export default TeamDetailModal;
