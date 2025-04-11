import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../team/css/TeamTodoListContent.css";
import TeamTodoCreateModal from "./TeamTodoCreateModal"; // 모달 임포트

// (1) 작업 상태를 분석하고, 뱃지 정보를 부여하는 함수
function mapSectionInfo(task) {
    let sectionTitle = "🔥 남은 To Do";
    let sectionColor = "#3498db";
    let isRecentlyCreated = false;

    // 완료 여부
    if (task.status === "DONE") {
        sectionTitle = "✅ 완료됨";
        sectionColor = "#27ae60";
    } else {
        // 마감 임박 판별 (3일 이하 남았을 때)
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

    // 최근 작성 (createdAt 필드 기준 3일 이내)
    if (task.createdAt) {
        const now = new Date();
        const createdTime = new Date(task.createdAt);
        const diffMs = now - createdTime;
        const threeDays = 3 * 24 * 60 * 60 * 1000;
        if (diffMs <= threeDays && diffMs >= 0) {
            isRecentlyCreated = true;
        }
    }

    return {
        ...task,
        sectionTitle,
        sectionColor,
        isRecentlyCreated,
    };
}

function TeamTodoListContent({ teamId }) {
    const [tasks, setTasks] = useState([]);
    const initialVisibleCount = 8;
    const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

    // 모달 열림/닫힘 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    // (2) 팀 작업 목록 불러오기, mapSectionInfo 적용
    const fetchTasks = useCallback(() => {
        axios
            .get(`/api/team/${teamId}/tasks`)
            .then((res) => {
                console.log("TeamTodoListContent - API 응답:", res.data);
                // 배열이면 mapSectionInfo를 적용
                if (Array.isArray(res.data)) {
                    const mapped = res.data.map(mapSectionInfo);
                    setTasks(mapped);
                } else {
                    setTasks([]);
                }
            })
            .catch((err) => {
                console.error("팀 작업 로드 오류:", err);
                setTasks([]);
            });
    }, [teamId]);

    // teamId 변경 시 목록 재불러오기
    useEffect(() => {
        console.log("TeamTodoListContent - teamId:", teamId);
        if (!teamId) return;
        fetchTasks();
    }, [teamId, fetchTasks]);

    // 모달 열기/닫기
    const openCreateModal = () => setIsModalOpen(true);
    const closeCreateModal = () => setIsModalOpen(false);

    // 새 작업 생성 후 목록 갱신
    const handleSaveNewTask = () => {
        fetchTasks();
        closeCreateModal();
    };

    // "더 보기" / "접기"
    const handleToggleVisible = () => {
        if (visibleCount === tasks.length) {
            setVisibleCount(initialVisibleCount);
        } else {
            setVisibleCount(tasks.length);
        }
    };

    useEffect(() => {
        console.log("TeamTodoListContent - tasks 상태 업데이트:", tasks);
    }, [tasks]);

    return (
        <div className="team-todo-container">
            {/* 상단 헤더: 제목 + "+ 팀 작업 생성하기" 버튼 */}
            <div className="todo-header">
                <h2 className="team-task-title">팀 작업</h2>
                <button className="add-todo-btn" onClick={openCreateModal}>
                    + 팀 작업 생성하기
                </button>
            </div>

            {/* 작업 목록 */}
            {tasks.length === 0 ? (
                <div className="team-all-tasks-grid">
                    <div className="team-all-list-task-card team-empty-task-card">
                        아직 팀 작업이 없습니다. 팀 작업을 생성하여 팀 작업에 기여해봐요!
                    </div>
                </div>
            ) : (
                <>
                    <div className="team-all-tasks-grid">
                        <TransitionGroup component={null}>
                            {tasks.slice(0, visibleCount).map((task) => (
                                <CSSTransition key={task.id} timeout={500} classNames="task">
                                    <div className="team-all-list-task-card">
                                        {/* (3) 왼쪽 상단 뱃지 컨테이너: 상태 뱃지 + '최근 작성' 뱃지 */}
                                        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                            <div
                                                className="team-task-section-badge"
                                                style={{ backgroundColor: task.sectionColor }}
                                            >
                                                {task.sectionTitle}
                                            </div>
                                            {task.isRecentlyCreated && (
                                                <div
                                                    className="team-task-section-badge"
                                                    style={{ backgroundColor: "#f39c12" }}
                                                >
                                                    🥄 최근 작성
                                                </div>
                                            )}
                                        </div>

                                        {/* 작업 제목 + 설명 */}
                                        <div className="team-all-list-task-title">{task.title}</div>
                                        <div className="team-all-list-task-desc">{task.description}</div>
                                    </div>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </div>

                    {tasks.length > initialVisibleCount && (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <button onClick={handleToggleVisible} className="btn btn-edit-all">
                                {visibleCount === tasks.length ? "접기" : "더 보기"}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* 새 작업 생성 모달 */}
            {isModalOpen && (
                <TeamTodoCreateModal
                    teamId={teamId}
                    onClose={closeCreateModal}
                    onSave={handleSaveNewTask}
                />
            )}
        </div>
    );
}

export default TeamTodoListContent;
