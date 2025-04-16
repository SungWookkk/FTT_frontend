import React, { useState } from "react";
import axios from "axios";
import "../team/css/TeamApplyModal.css";

const TeamApplyModal = ({ isOpen, onClose, team, userId }) => {
    // 훅은 항상 최상위에서 호출
    const [reason, setReason] = useState("");
    const [goal, setGoal] = useState("");

    // isOpen이 false이면 null 반환
    if (!isOpen) return null;

    const handleApply = async () => {
        try {
            // teamId 대신 팀 정보를 team: { id: team.id } 형태로 전송
            const requestData = {
                team: { id: team.id },
                reason,
                goal,
            };
            // userId가 반드시 존재 (헤더에 전달)
            const response = await axios.post("/api/team-applications", requestData, {
                headers: { "X-User-Id": userId },
            });
            alert(`신청이 완료되었습니다! 신청 ID: ${response.data.id}`);
            onClose();
        } catch (error) {
            console.error("팀 신청 중 오류:", error);
            // 서버에서 반환된 오류 메시지가 "이미 가입되어 있는 팀입니다!"이면 해당 문구를 alert로 노출
            if (error.response && error.response.data === "이미 가입되어 있는 팀입니다!") {
                alert("이미 가입되어 있는 팀입니다!");
            } else {
                alert("팀 신청에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };

    return (
        <div className="apply-modal-overlay" onClick={onClose}>
            <div className="apply-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="apply-modal-close-button" onClick={onClose}>
                    X
                </button>
                <h2 className="apply-modal-title">팀 신청하기</h2>
                <p className="apply-modal-team-info">
                    <strong>팀:</strong> {team.teamName}
                </p>
                <div className="apply-modal-field">
                    <label>신청 사유</label>
                    <textarea
                        placeholder="신청하는 이유를 입력하세요"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <div className="apply-modal-field">
                    <label>목표</label>
                    <textarea
                        placeholder="목표를 입력하세요"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                </div>
                <div className="apply-modal-button-group">
                    <button className="apply-btn" onClick={handleApply}>
                        신청하기
                    </button>
                    <button className="cancel-btn" onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamApplyModal;
