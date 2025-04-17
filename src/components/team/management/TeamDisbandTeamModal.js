import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../management/css/TeamDisbandTeamModal.css";

export default function TeamDisbandTeamModal({ teamId, onClose }) {
    const history = useHistory();

    const handleDisband = () => {
        axios
            .delete(`/api/team-applications/${teamId}`)
            .then(() => history.push("/team"))
            .catch(() => alert("해체 실패"));
    };

    return (
        <div className="team-disband-overlay" onClick={onClose}>
            <div className="team-disband-container" onClick={e => e.stopPropagation()}>
                <h2>팀 해체</h2>
                <p>팀을 완전히 해체하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다.</p>
                <div className="team-disband-buttons">
                    <button className="team-disband-btn" onClick={handleDisband}>해체</button>
                    <button className="team-disband-cancel" onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
}
