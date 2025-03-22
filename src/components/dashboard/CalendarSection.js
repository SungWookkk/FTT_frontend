import React, { useEffect, useState } from "react";
import axios from "axios";
import "../dashboard/css/CalendarSection.css";

/**
 * Task 엔티티 (백엔드)
 * {
 *   id: number,
 *   title: string,
 *   startDate: "YYYY-MM-DD",
 *   dueDate: "YYYY-MM-DD",
 *   status: "TODO" | "DONE" | ...
 *   ...
 * }
 */

// 테스트용 예시 Task
const sampleTasks = [
    {
        id: 1,
        title: "프로젝트 기획",
        startDate: "2025-03-20",
        dueDate: "2025-03-24",
        status: "TODO"
    },
    {
        id: 2,
        title: "디자인 작업",
        startDate: "2025-03-22",
        dueDate: "2025-03-23",
        status: "TODO"
    },
    {
        id: 3,
        title: "개발 작업",
        startDate: "2025-03-15",
        dueDate: "2025-03-30",
        status: "DONE"
    }
];

// 하루 셀에 최대 표시할 Task 개수
const MAX_TASKS_PER_DAY = 2;

/** Task 색상 로직 */
function getTaskColor(task) {
    // 1) 완료된 작업 => 초록
    if (task.status === "DONE") {
        return "#27ae60";
    }

    // 2) 마감 임박: 오늘 ~ 3일 이내 (status !== DONE)
    if (task.dueDate) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const due = new Date(task.dueDate);
        const diff = due - now;
        const threeDays = 3 * 24 * 60 * 60 * 1000;
        if (diff <= threeDays && diff >= 0) {
            return "#e74c3c"; // 빨강
        }
    }

    // 3) 기본 => 파랑
    return "#3498db";
}

/** '시작일 <= date <= 마감일' 범위인지 체크 */
function isDateInRange(dateObj, startStr, endStr) {
    if (!startStr || !endStr) return false;
    const date = new Date(dateObj);
    const s = new Date(startStr);
    const e = new Date(endStr);
    return date >= s && date <= e;
}

function CalendarSection() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [tasks, setTasks] = useState(sampleTasks);
    const [direction, setDirection] = useState("next");

    // 모달에 표시할 Task 목록
    const [modalTasks, setModalTasks] = useState(null);

    const todayISO = today.toISOString().slice(0, 10);

    // 백엔드에서 Task 목록 불러오기
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        axios
            .get("/api/tasks/my-tasks", {
                params: { userId },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setTasks(res.data);
            })
            .catch((err) => {
                console.error("Task 불러오기 실패:", err);
            });
    }, []);

    // 오늘의 일정
    const todayTasks = tasks.filter((t) =>
        isDateInRange(todayISO, t.startDate, t.dueDate)
    );

    // 달 이동
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

    // 달력 계산
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

    // 날짜별 Task
    const getTasksForDate = (dateObj) => {
        if (!dateObj) return [];
        const isoStr = dateObj.toISOString().slice(0, 10);
        return tasks.filter((t) => isDateInRange(isoStr, t.startDate, t.dueDate));
    };

    // 모달 열기: 해당 날짜의 전체 Task
    const openTaskModal = (dayTasks) => {
        setModalTasks(dayTasks);
    };
    // 모달 닫기
    const closeTaskModal = () => {
        setModalTasks(null);
    };

    const titleString = `${year}. ${month + 1}`;

    return (
        <div className="calendar-container">
            <div className="calendar-section">
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

                <div className="weekday-row">
                    <div className="weekday-cell">SUN</div>
                    <div className="weekday-cell">MON</div>
                    <div className="weekday-cell">TUE</div>
                    <div className="weekday-cell">WED</div>
                    <div className="weekday-cell">THU</div>
                    <div className="weekday-cell">FRI</div>
                    <div className="weekday-cell">SAT</div>
                </div>

                <div
                    className={`dates-grid ${direction === "prev" ? "slide-left" : "slide-right"}`}
                >
                    {calendarCells.map((dateObj, idx) => {
                        if (!dateObj) {
                            // 이전달 공백
                            return <div key={idx} className="date-cell empty"></div>;
                        }

                        const isoStr = dateObj.toISOString().slice(0, 10);
                        const dayNum = dateObj.getDate();
                        const isToday = isoStr === todayISO;

                        // 해당 날짜 Task
                        const dayTasks = getTasksForDate(dateObj);

                        // 최대 N개만 표시
                        const tasksToShow = dayTasks.slice(0, MAX_TASKS_PER_DAY);
                        const moreCount = dayTasks.length - MAX_TASKS_PER_DAY;

                        return (
                            <div
                                key={idx}
                                className={`date-cell ${isToday ? "today-highlight" : ""}`}
                            >
                                <div className="date-number">{dayNum}</div>

                                {tasksToShow.map((task) => {
                                    const color = getTaskColor(task);
                                    return (
                                        <div
                                            key={task.id}
                                            className="task-item"
                                            style={{ backgroundColor: color, color: "#fff" }}
                                        >
                                            {task.title}
                                        </div>
                                    );
                                })}

                                {/* "more" 링크 */}
                                {moreCount > 0 && (
                                    <div
                                        className="more-link"
                                        onClick={() => openTaskModal(dayTasks)}
                                    >
                                        +{moreCount} more
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 오른쪽 패널 (오늘 일정 + AI 기능) */}
            <div className="right-panels">
                <div className="schedule-sidebar">
                    <h3 className="sidebar-title">오늘의 일정</h3>
                    <div className="sidebar-list">
                        {todayTasks.length === 0 ? (
                            <div className="no-tasks">오늘은 일정이 없습니다.</div>
                        ) : (
                            todayTasks.map((task) => (
                                <div key={task.id} className="sidebar-task">
                                    <div className="sidebar-task-title">{task.title}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="ai-panel">
                    <h3 className="ai-panel-title">AI 기능</h3>
                    <div className="ai-panel-content">
                        <p>AI 기능이 들어갈 영역입니다.</p>
                    </div>
                </div>
            </div>

            {/* 날짜별 전체 Task 모달 */}
            {modalTasks && (
                <DayTasksModal tasks={modalTasks} onClose={closeTaskModal} />
            )}
        </div>
    );
}

/** "해당 날짜 전체 Task" 모달 */
function DayTasksModal({ tasks, onClose }) {
    return (
        <div className="day-tasks-modal-overlay" onClick={onClose}>
            <div
                className="day-tasks-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 닫기(X) 버튼 */}
                <button className="modal-close-btn" onClick={onClose}>
                    ×
                </button>

                <h2 className="modal-title">전체 작업 목록</h2>

                <ul className="modal-task-list">
                    {tasks.map((t) => (
                        <li key={t.id}>
                            <strong>{t.title}</strong> <span>(status: {t.status})</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CalendarSection;
