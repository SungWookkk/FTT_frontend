import React from "react";
import axios from "axios";
import "../management/css/TeamPromoteMemberModal.css";

export default function TeamPromoteMemberModal({ teamId, members, onClose }) {
    const handlePromote = userId => {
        axios
            .patch(`/api/team-applications/${teamId}/members/${userId}/promote`)
            .then(() => window.location.reload())
            .catch(() => alert("승격 실패"));
    };

    return (
        <div className="team-promote-overlay" onClick={onClose}>
            <div className="team-promote-container" onClick={e => e.stopPropagation()}>
                <h2>멤버 등급 상승</h2>
                <ul className="team-promote-list">
                    {members.map(u => (
                        <li key={u.id} className="team-promote-item">
                            <span>{u.username}</span>
                            <button className="team-promote-btn" onClick={() => handlePromote(u.id)}>
                                승격
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="team-promote-close" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
}
