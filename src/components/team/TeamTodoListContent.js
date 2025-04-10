import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../team/css/TeamTodoListContent.css";
import TeamTodoCreateModal from "./TeamTodoCreateModal"; // 모달 임포트

function TeamTodoListContent({ teamId }) {
    const [tasks, setTasks] = useState([]);
    const initialVisibleCount = 8;
    const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

    // 모달 열림/닫힘 상태
    const [isModalOpen, setIsModalOpen] = useState(false);

    // API로 팀 작업 목록을 불러오는 함수를 useCallback으로 감싸 dependency 문제 해결
    const fetchTasks = useCallback(() => {
        axios
            .get(`/api/team/${teamId}/tasks`)
            .then((res) => {
                console.log("TeamTodoListContent - API 응답:", res.data);
                setTasks(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("팀 작업 로드 오류:", err);
                setTasks([]);
            });
    }, [teamId]);

    useEffect(() => {
        console.log("TeamTodoListContent - teamId:", teamId);
        if (!teamId) return;
        fetchTasks();
    }, [teamId, fetchTasks]);

    // 새 작업 생성 모달 열기
    const openCreateModal = () => {
        setIsModalOpen(true);
    };

    // 새 작업 생성 모달 닫기
    const closeCreateModal = () => {
        setIsModalOpen(false);
    };

    // 모달에서 작업 생성 후 저장될 때 호출되는 함수
    const handleSaveNewTask = (createdTask) => {
        // 새로고침 대신, DB에서 다시 목록 불러오기
        fetchTasks();
        // 모달 닫기
        closeCreateModal();
    };

    const handleToggleVisible = () => {
        console.log("TeamTodoListContent - handleToggleVisible: 현재 visibleCount:", visibleCount);
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
            {/* 헤더 영역: 제목 + "+ 팀 작업 생성하기" 버튼 */}
            <div className="todo-header">
                <h2 className="team-task-title">팀 작업</h2>
                {/* 오른쪽 끝에 버튼 배치 */}
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
                                        <div
                                            className="team-task-section-badge"
                                            style={{ backgroundColor: task.sectionColor }}
                                        >
                                            {task.sectionTitle}
                                        </div>
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
