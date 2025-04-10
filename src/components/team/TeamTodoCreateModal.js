import React, { useState } from "react";
import axios from "axios";
import "../team/css/TeamTodoCreateModal.css";

function TeamTodoCreateModal({ teamId, onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("중간"); // 기본값 "중간"
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // 필수 입력값 체크
        if (!title || !startDate || !dueDate || !priority) {
            setError("제목, 시작일, 마감일, 우선순위는 필수 입력 항목입니다.");
            return;
        }
        setError("");

        // 백엔드의 TeamTask 엔티티에 맞게 새 작업 데이터를 구성합니다.
        const newTask = {
            title,
            description,
            startDate,  // "YYYY-MM-DD" 형식 (HTML input date 사용 시)
            dueDate,    // "YYYY-MM-DD" 형식
            priority,
            status: "진행중"  // 새 작업의 기본 상태를 "진행중"으로 설정 (필요에 따라 수정)
            // memo나 files는 추가 입력이 필요하지 않은 경우 생략 가능
        };

        axios
            .post(`/api/team/${teamId}/tasks`, newTask)
            .then((res) => {
                if (onSave) onSave(res.data);
                onClose();
            })
            .catch((err) => {
                console.error("팀 작업 생성 오류:", err);
                setError("팀 작업 생성에 실패했습니다.");
            });
    };

    return (
        <div className="todo-create-modal-overlay" onClick={onClose}>
            <div className="todo-create-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    ×
                </button>
                <h3>새 팀 작업 생성</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group1">
                        <label htmlFor="title">제목</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="작업 제목을 입력하세요"
                        />
                    </div>
                    <div className="form-group1">
                        <label htmlFor="description">설명</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="작업 설명을 입력하세요"
                        />
                    </div>
                    <div className="form-group1">
                        <label htmlFor="startDate">시작일</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group1">
                        <label htmlFor="dueDate">마감일</label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group1">
                        <label htmlFor="priority">우선순위</label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="높음">높음</option>
                            <option value="중간">중간</option>
                            <option value="낮음">낮음</option>
                        </select>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="modal-actions">
                        <button type="submit" className="save-btn">
                            생성
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TeamTodoCreateModal;
