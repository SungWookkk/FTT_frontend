import React, { useEffect, useState } from "react";
import axios from "axios";
import "../team/css/TeamCalendarSection.css";
import "../team/css/TeamTodoCalendarModal.css";

const MAX_TASKS_PER_DAY = 2;

/**
 * Task의 섹션 구분 정보 (완료, 마감 임박, 기본)
 */
function getSectionInfo(task) {
    if (task.status === "DONE") {
        return { sectionTitle: "✅ 완료됨", sectionColor: "#27ae60" };
    }
    if (task.dueDate) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const due = new Date(task.dueDate);
        const diff = due - now;
        const threeDays = 3 * 24 * 60 * 60 * 1000;
        if (diff <= threeDays && diff >= 0) {
            return { sectionTitle: "⏳ 마감 임박", sectionColor: "#e74c3c" };
        }
    }
    return { sectionTitle: "🔥 남은 To Do", sectionColor: "#3498db" };
}

/**
 * 날짜 문자열(YYYY-MM-DD)이 startDate ~ endDate 범위 내에 있는지 체크
 */
function isDateInRange(dateStr, startStr, endStr) {
    if (!startStr || !endStr) return false;
    const date = new Date(dateStr);
    const s = new Date(startStr);
    const e = new Date(endStr);
    return date >= s && date <= e;
}

/**
 * Date 객체를 로컬 "YYYY-MM-DD" 문자열로 변환
 */
function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * 팀 달력 모달 컴포넌트
 *
 * Props:
 * - team: 팀 정보를 담은 객체 (team.id 포함)
 * - onClose: 모달 닫기 함수
 */
function TeamTodoCalendarModal({ team, onClose }) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [tasks, setTasks] = useState([]);
    const [direction, setDirection] = useState("next");

    const [modalTasks, setModalTasks] = useState(null);
    const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);
    const todayLocalStr = getLocalDateString(today);

    useEffect(() => {
        if (!team || !team.id) return;
        const token = localStorage.getItem("token");
        axios
            .get(`/api/teams/${team.id}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setTasks(res.data);
            })
            .catch((err) => {
                console.error("팀 일정 불러오기 오류:", err);
            });
    }, [team]);

    const todayTasks = tasks.filter((t) => isDateInRange(todayLocalStr, t.startDate, t.dueDate));

    const handlePrevMonth = () => {
        setDirection("prev");
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth < 0) {
            newMonth = 11;
            newYear = year - 1;
        }
        setYear(newYear);
        setMonth(newMonth);
    };

    const handleNextMonth = () => {
        setDirection("next");
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth > 11) {
            newMonth = 0;
            newYear = year + 1;
        }
        setYear(newYear);
        setMonth(newMonth);
    };

    const handleToday = () => {
        const now = new Date();
        setYear(now.getFullYear());
        setMonth(now.getMonth());
    };

    // 달력 로직
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const totalDays = lastDate.getDate();
    const startDay = firstDate.getDay();
    const calendarCells = [];
    for (let i = 0; i < startDay; i++) {
        calendarCells.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
        calendarCells.push(new Date(year, month, d));
    }


    const getTasksForDate = (dateObj) => {
        if (!dateObj) return [];
        const isoStr = getLocalDateString(dateObj);
        return tasks.filter((t) => isDateInRange(isoStr, t.startDate, t.dueDate));
    };

    const openTaskModal = (dayTasks) => {
        setModalTasks(dayTasks);
    };

    const closeTaskModal = () => {
        setModalTasks(null);
    };

    const openTaskDetail = (task) => {
        setSelectedTaskDetail(task);
    };

    const closeTaskDetail = () => {
        setSelectedTaskDetail(null);
    };

    const titleString = `${year}. ${month + 1}`;

    return (
        <div className="team-calendar-modal-overlay" onClick={onClose}>
            <div
                className="team-calendar-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close-button1" onClick={onClose}>×</button>
                <h2 className="calendar-section-title">Calendar</h2>

                <div className="calendar-section">
                    {/* 달력 헤더 */}
                    <div className="calendar-header">
                        <div className="calendar-title">{titleString}</div>
                        <div className="calendar-controls">
                            <button className="control-button" onClick={handleToday}>
                                Today
                            </button>
                            <button className="control-button" onClick={handlePrevMonth}>
                                &lt;
                            </button>
                            <button className="control-button" onClick={handleNextMonth}>
                                &gt;
                            </button>
                        </div>
                    </div>

                    {/* 요일 헤더 */}
                    <div className="weekday-row">
                        <div className="weekday-cell">SUN</div>
                        <div className="weekday-cell">MON</div>
                        <div className="weekday-cell">TUE</div>
                        <div className="weekday-cell">WED</div>
                        <div className="weekday-cell">THU</div>
                        <div className="weekday-cell">FRI</div>
                        <div className="weekday-cell">SAT</div>
                    </div>

                    {/* 날짜 칸 */}
                    <div key={`${year}-${month}`} className={`dates-grid ${direction === "prev" ? "slide-left" : "slide-right"}`}>
                        {calendarCells.map((dateObj, idx) => {
                            if (!dateObj) {
                                return <div key={idx} className="date-cell empty"></div>;
                            }
                            const isoStr = getLocalDateString(dateObj);
                            const dayNum = dateObj.getDate();
                            const isToday = isoStr === todayLocalStr;
                            const dayTasks = getTasksForDate(dateObj);
                            const tasksToShow = dayTasks.slice(0, MAX_TASKS_PER_DAY);
                            const moreCount = dayTasks.length - MAX_TASKS_PER_DAY;

                            return (
                                <div
                                    key={idx}
                                    className={`date-cell ${isToday ? "today-highlight" : ""}`}
                                    onClick={() => openTaskModal(dayTasks)}
                                >
                                    <div className="date-number">{dayNum}</div>
                                    {tasksToShow.map((task) => {
                                        const { sectionColor } = getSectionInfo(task);
                                        return (
                                            <div
                                                key={task.id}
                                                className="task-item"
                                                style={{ backgroundColor: sectionColor, color: "#fff" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openTaskDetail(task);
                                                }}
                                            >
                                                {task.title}
                                            </div>
                                        );
                                    })}
                                    {moreCount > 0 && (
                                        <div
                                            className="more-link"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openTaskModal(dayTasks);
                                            }}
                                        >
                                            +{moreCount} more
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 오른쪽 패널: 오늘의 팀 일정 */}
                <div className="right-panels">
                    <div className="schedule-sidebar">
                        <h3 className="sidebar-title">오늘의 팀 일정</h3>
                        <div className="sidebar-list">
                            {todayTasks.length === 0 ? (
                                <div className="no-tasks">오늘은 일정이 없습니다.</div>
                            ) : (
                                todayTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="sidebar-task"
                                        onClick={() => openTaskDetail(task)}
                                    >
                                        <div className="sidebar-task-title">{task.title}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* "+N more" 모달 */}
                {modalTasks && (
                    <DayTasksModal
                        tasks={modalTasks}
                        onClose={closeTaskModal}
                        onTaskClick={(task) => {
                            closeTaskModal();
                            openTaskDetail(task);
                        }}
                    />
                )}

                {/* Task 상세 모달 */}
                {selectedTaskDetail && (
                    <TaskDetailModal task={selectedTaskDetail} onClose={closeTaskDetail} />
                )}
            </div>
        </div>
    );
}

/** 날짜별 전체 목록 모달 */
function DayTasksModal({ tasks, onClose, onTaskClick }) {
    return (
        <div className="day-tasks-modal-overlay" onClick={onClose}>
            <div className="day-tasks-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    ×
                </button>
                <h2 className="modal-title">전체 작업 목록</h2>
                <ul className="modal-task-list">
                    {tasks.map((task) => {
                        const { sectionColor } = getSectionInfo(task);
                        return (
                            <li
                                key={task.id}
                                style={{ marginBottom: "8px", cursor: "pointer" }}
                                onClick={() => onTaskClick(task)}
                            >
                <span
                    style={{
                        display: "inline-block",
                        width: "14px",
                        height: "14px",
                        backgroundColor: sectionColor,
                        borderRadius: "4px",
                        marginRight: "8px",
                    }}
                />
                                <strong>{task.title}</strong>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

/** Task 상세 모달 */
function TaskDetailModal({ task, onClose }) {
    const { sectionTitle, sectionColor } = getSectionInfo(task);
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div
                    className="section-header"
                    style={{
                        borderBottom: `4px solid ${sectionColor}`,
                        marginTop: "1px",
                        width: "500px",
                    }}
                >
                    <div className="section-header-content">
                        <h2 className="modal-title">작업 상세 정보</h2>
                    </div>
                </div>
                <div className="detail-row">
                    <div className="detail-icon">
                        <i className="fas fa-folder-open" />
                    </div>
                    <div className="detail-text">
                        <span className="detail-label">섹션</span>
                        <div
                            className="task-section-badge section-pill"
                            style={{ backgroundColor: sectionColor }}
                        >
                            {sectionTitle}
                        </div>
                    </div>
                </div>
                {/* ... 상세 정보 표시 ... */}
                <button className="modal-close-button" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
}

export default TeamTodoCalendarModal;