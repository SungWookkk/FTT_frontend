import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../management/css/TeamLeaveTeamModal.css";

export default function TeamLeaveTeamModal({ teamId, onClose }) {
    const history = useHistory();
    const userId = localStorage.getItem("userId");
    const handleLeave = () => {
        axios
            .delete(`/api/team-applications/${teamId}/members/me`, {
                headers: { "X-User-Id": userId }
            })
            .then(() => history.push("/team"))
            .catch(() => alert("탈퇴 실패"));
    };

    return (
        <div className="team-leave-overlay" onClick={onClose}>
            <div className="team-leave-container" onClick={e => e.stopPropagation()}>
                <h2>팀 탈퇴</h2>
                <p>정말 팀을 탈퇴하시겠습니까?</p>
                <div className="team-leave-buttons">
                    <button className="team-leave-btn" onClick={handleLeave}>탈퇴</button>
                    <button className="team-leave-cancel" onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
}
