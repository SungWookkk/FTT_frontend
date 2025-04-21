import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../Auth/AuthContext";

export default function TeamLeaveTeamModal({ teamId, onClose }) {
    const history = useHistory();
    const { auth } = useAuth();
    const userId = auth.userId;

    const handleLeave = () => {
        if (!window.confirm("정말 팀을 탈퇴하시겠습니까?")) return;

        axios
            .post(
                `/api/teams/${teamId}/leave`,
                null,
                { headers: { "X-User-Id": userId } }
            )
            .then(() => {
                onClose();
                history.push("/");
            })
            .catch((err) => {
                console.error("팀 탈퇴 실패:", err);
                alert("팀 탈퇴 중 오류가 발생했습니다.");
            });
    };

    return (
        <div className="team-leave-overlay" onClick={onClose}>
            <div className="team-leave-container" onClick={(e) => e.stopPropagation()}>
                <h2 className="team-leave-title">팀 탈퇴</h2>
                <p className="team-leave-message">정말 팀을 탈퇴하시겠습니까?</p>
                <div className="team-leave-buttons">
                    <button className="team-leave-btn" onClick={handleLeave}>
                        탈퇴
                    </button>
                    <button className="team-leave-cancel" onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
