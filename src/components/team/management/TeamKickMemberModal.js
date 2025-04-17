import React from "react";
import axios from "axios";
import "../management/css/TeamKickMemberModal.css";

export default function TeamKickMemberModal({ teamId, members, onClose, onKicked }) {
    const handleKick = userId => {
        axios
            .delete(`/api/team-applications/${teamId}/members/${userId}`)
            .then(() => onKicked())
            .catch(() => alert("추방 실패"));
    };

    return (
        <div className="team-kick-overlay" onClick={onClose}>
            <div className="team-kick-container" onClick={e => e.stopPropagation()}>
                <h2>멤버 추방</h2>
                <ul className="team-kick-list">
                    {members.map(u => (
                        <li key={u.id} className="team-kick-item">
                            <span>{u.username}</span>
                            <button className="team-kick-btn" onClick={() => handleKick(u.id)}>
                                추방
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="team-kick-close" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
}
