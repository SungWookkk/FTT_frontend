import React, { useState, useEffect } from "react";
import "../team/css/TeamCreateModal.css";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import { useHistory } from "react-router-dom";

const TeamCreateModal = ({ isOpen, onClose, onTeamCreated }) => {
    const { auth } = useAuth();
    const history = useHistory();
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        if (isOpen) {
            setTeamName("");
            setDescription("");
            setAnnouncement("");
            setCategory("");
        }
    }, [isOpen]);

    const handleCreate = async () => {
        if (!auth || !auth.userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        const teamData = {
            teamName,
            description,
            announcement,
            category,
            teamLeader: auth.userId,
        };

        try {
            const response = await axios.post("/api/teams/create", teamData, {
                headers: { "X-User-Id": auth.userId },
            });
            console.log("팀 생성 성공:", response.data);
            alert(`팀 생성 성공!\n팀 이름: ${response.data.teamName}`);
            onClose();
            history.push("/team");

            // 새 팀 생성 후, 콜백(onTeamCreated)이 전달되면 호출해 teamsData를 재갱신하도록 함.
            if (onTeamCreated) {
                onTeamCreated(response.data);
            }
        } catch (error) {
            console.error("팀 생성 오류:", error);
            alert("팀 생성 중 오류가 발생했습니다.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="create-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <h2 className="modal-title">팀 생성</h2>
                <div className="create-modal-field">
                    <label>팀 이름</label>
                    <input
                        type="text"
                        placeholder="팀 이름을 입력하세요"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                </div>
                <div className="create-modal-field">
                    <label>팀 설명</label>
                    <textarea
                        placeholder="팀 설명을 입력하세요"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="create-modal-field">
                    <label>팀 공지사항</label>
                    <textarea
                        placeholder="팀 공지사항을 입력하세요"
                        rows={2}
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                    />
                </div>
                <div className="create-modal-field">
                    <label>팀 카테고리 주제</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">선택하세요</option>
                        <option value="코딩">코딩</option>
                        <option value="취업">취업</option>
                        <option value="공부">공부</option>
                        <option value="운동">운동</option>
                        <option value="AI">AI</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <button className="create-submit-btn" onClick={handleCreate}>
                    팀 생성 신청
                </button>
            </div>
        </div>
    );
};

export default TeamCreateModal;
