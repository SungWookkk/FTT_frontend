import React, { useState } from "react";
import axios from "axios";
import "../team/css/TeamTodoCreateModal.css";
import {useAuth} from "../../Auth/AuthContext";

/**
 * 작업 상태를 판별하여 sectionTitle, sectionColor, isRecentlyCreated 등을 반환하는 함수
 * - status === "DONE" → "✅ 완료됨" (녹색)
 * - 마감일(3일 이하 남았을 때) → "⏳ 마감 임박" (빨간색)
 * - 그 외 → "🔥 남은 To Do" (파란색)
 * - createdAt 3일 이내면 isRecentlyCreated = true
 */
function mapSectionInfo(task) {
    let sectionTitle = "🔥 남은 To Do";
    let sectionColor = "#3498db";
    let isRecentlyCreated = false;

    // 완료 여부
    if (task.status === "DONE") {
        sectionTitle = "✅ 완료됨";
        sectionColor = "#27ae60";
    } else {
        // 마감 임박 판단 (3일 이하 남았을 때)
        if (task.dueDate) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);
            const diff = due - now;
            const threeDays = 3 * 24 * 60 * 60 * 1000;
            if (diff <= threeDays && diff >= 0) {
                sectionTitle = "⏳ 마감 임박";
                sectionColor = "#e74c3c";
            }
        }
    }

    // 최근 작성 여부 (createdAt이 3일 이내)
    if (task.createdAt) {
        const now = new Date();
        const createdTime = new Date(task.createdAt);
        const diff = now - createdTime;
        const threeDays = 3 * 24 * 60 * 60 * 1000;
        if (diff <= threeDays && diff >= 0) {
            isRecentlyCreated = true;
        }
    }

    return {
        sectionTitle,
        sectionColor,
        isRecentlyCreated,
    };
}

function TeamTodoCreateModal({ teamId, onClose, onSave }) {
    const { auth } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("중간");
    const [error, setError] = useState("");

    // 미리보기용 D-Day 계산(옵션)
    const [daysLeft, setDaysLeft] = useState(null);

    // 마감일 변경 시 일수 계산
    const handleDueDateChange = (val) => {
        setDueDate(val);
        if (val) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const due = new Date(val);
            due.setHours(0, 0, 0, 0);
            const diffMs = due - now;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            setDaysLeft(diffDays);
        } else {
            setDaysLeft(null);
        }
    };

    // 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();

        // 필수 입력값 검사
        if (!title || !startDate || !dueDate || !priority) {
            setError("제목, 시작일, 마감일, 우선순위는 필수 입력 항목입니다.");
            return;
        }
        setError("");

        // 팀 작업 데이터
        const newTask = {
            title,
            description,
            startDate,
            dueDate,
            priority,
            status: "진행중",
            createdAt: new Date().toISOString(),
            user: {
                username: auth.userName
            }
        };


        // 팀 작업 생성 API 호출
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

    // (1) 미리보기용으로 mapSectionInfo를 적용
    // 아직 DB 저장 전이므로, status="진행중", createdAt=지금 시각(가정), dueDate=사용자 입력
    const previewTask = {
        status: "진행중",
        createdAt: new Date(), // 지금 시각
        dueDate: dueDate ? new Date(dueDate) : null,
    };
    const { sectionTitle, sectionColor, isRecentlyCreated } = mapSectionInfo(previewTask);

    return (
        <div className="team-drawer-modal-overlay" onClick={onClose}>
            <div className="team-drawer-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>새 팀 작업 생성</h2>

                <div className="team-drawer-content-wrapper">
                    {/* ===== 왼쪽: 미리보기 패널 ===== */}
                    <div className="team-preview-panel">
                        <h3>미리보기</h3>
                        <div className="team-section-header" style={{ borderBottom: "4px solid #7869f1" }}>
                            <span className="team-preview-title">{title || "제목 미입력"}</span>
                        </div>

                        {/* (2) 뱃지 컨테이너: 상태 뱃지 + 최근작성 뱃지 */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                            <div
                                className="team-task-section-badge"
                                style={{ backgroundColor: sectionColor }}
                            >
                                {sectionTitle}
                            </div>
                            {isRecentlyCreated && (
                                <div
                                    className="team-task-section-badge"
                                    style={{ backgroundColor: "#f39c12" }}
                                >
                                    🥄 최근 작성
                                </div>
                            )}
                        </div>

                        {/* 작업 설명 */}
                        <div className="team-detail-row">
                            <div className="team-detail-label">설명</div>
                            <div className="team-detail-value">{description || "내용 없음"}</div>
                        </div>

                        {/* 우선순위 */}
                        <div className="team-detail-row">
                            <div className="team-detail-label">우선순위</div>
                            <div className={`team-detail-value team-priority-${priority}`}>
                                {priority}
                            </div>
                        </div>

                        {/* 시작일 + 마감일 */}
                        <div className="team-detail-row">
                            <div className="team-detail-label">시작일</div>
                            <div className="team-detail-value">
                                {startDate ? new Date(startDate).toLocaleDateString() : "미설정"}
                            </div>
                        </div>
                        <div className="team-detail-row">
                            <div className="team-detail-label">마감일</div>
                            <div className="team-detail-value">
                                {dueDate ? new Date(dueDate).toLocaleDateString() : "미설정"}
                                {daysLeft !== null &&
                                    (daysLeft > 0
                                        ? ` (D-${daysLeft})`
                                        : daysLeft === 0
                                            ? " (오늘 마감!)"
                                            : ` (마감 ${Math.abs(daysLeft)}일 지남)`)}
                            </div>
                        </div>
                    </div>

                    {/* ===== 오른쪽: 입력 폼 패널 ===== */}
                    <div className="team-form-panel">
                        <h3>작업 입력</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="team-form-field">
                                <label>제목</label>
                                <input
                                    type="text"
                                    placeholder="작업 제목을 입력하세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="team-form-field">
                                <label>설명</label>
                                <textarea
                                    placeholder="작업 설명을 입력하세요"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="team-form-field">
                                <label>시작일</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className="team-form-field">
                                <label>마감일</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => handleDueDateChange(e.target.value)}
                                />
                            </div>

                            <div className="team-form-field">
                                <label>우선순위</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <option value="높음">높음</option>
                                    <option value="중간">중간</option>
                                    <option value="낮음">낮음</option>
                                </select>
                            </div>

                            {error && <div className="team-create-error">{error}</div>}

                            <div className="team-form-footer">
                                <button type="button" className="team-cancel-btn" onClick={onClose}>
                                    취소
                                </button>
                                <button type="submit" className="team-create-btn">
                                    생성
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamTodoCreateModal;
