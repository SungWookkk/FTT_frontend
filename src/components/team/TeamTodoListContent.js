import React, { useEffect, useState } from "react";
import axios from "axios";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../team/css/TeamTodoListContent.css";

function TeamTodoListContent({ teamId }) {
    const [tasks, setTasks] = useState([]);
    const initialVisibleCount = 8;
    const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

    useEffect(() => {
        if (!teamId) return;
        axios
            .get(`/api/teams/${teamId}/tasks`)
            .then((res) => {
                setTasks(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("팀 작업 로드 오류:", err);
                setTasks([]);
            });
    }, [teamId]);

    const handleToggleVisible = () => {
        if (visibleCount === tasks.length) {
            setVisibleCount(initialVisibleCount);
        } else {
            setVisibleCount(tasks.length);
        }
    };

    return (
        <div className="team-todo-container">
            {/* 기존 레이아웃 타이틀 유지 */}
            <h2 className="team-task-title">팀 작업</h2>

            {/* 작업이 비어 있으면 안내 카드 노출, 아니면 기존 목록 표시 */}
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
                                <CSSTransition
                                    key={task.id}
                                    timeout={500}
                                    classNames="task"
                                >
                                    <div className="team-all-list-task-card">
                                        <div
                                            className="team-task-section-badge"
                                            style={{ backgroundColor: task.sectionColor }}
                                        >
                                            {task.sectionTitle}
                                        </div>
                                        <div className="team-all-list-task-title">
                                            {task.title}
                                        </div>
                                        <div className="team-all-list-task-desc">
                                            {task.description}
                                        </div>
                                    </div>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </div>

                    {/* '더 보기' / '접기' 버튼 */}
                    {tasks.length > initialVisibleCount && (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <button
                                onClick={handleToggleVisible}
                                className="btn btn-edit-all"
                            >
                                {visibleCount === tasks.length ? "접기" : "더 보기"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default TeamTodoListContent;
