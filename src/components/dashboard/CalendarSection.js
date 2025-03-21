import React, { useState } from "react";
import "../dashboard/css/CalendarSection.css";

// 예시 Task 구조
const sampleTasks = [
    { id: 1, title: "프로젝트 기획", start: "2023-07-03", end: "2023-07-05" },
    { id: 2, title: "디자인 작업", start: "2023-07-07", end: "2023-07-07" },
    { id: 3, title: "개발 작업", start: "2023-07-12", end: "2023-07-15" },
];

function CalendarSection() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [tasks, setTasks] = useState(sampleTasks);
    // direction state: 'next' 또는 'prev'
    const [direction, setDirection] = useState("next");

    // "오늘의 일정" 필터 (우측 패널)
    const todayISO = today.toISOString().slice(0, 10);
    const todayTasks = tasks.filter((t) => {
        const date = new Date(todayISO);
        const start = new Date(t.start);
        const end = new Date(t.end);
        return date >= start && date <= end;
    });

    // 이전 달로 이동 (방향: 'prev')
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

    // 다음 달로 이동 (방향: 'next')
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

    // Today 버튼
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

    const isWithinRange = (dateStr, startStr, endStr) => {
        const date = new Date(dateStr);
        const start = new Date(startStr);
        const end = new Date(endStr);
        return date >= start && date <= end;
    };

    const titleString = `${year}. ${month + 1}`;

    return (
        <div className="calendar-container">
            {/* 왼쪽: 달력 섹션 */}
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

                {/* 달력 본체: direction 상태에 따라 애니메이션 클래스 적용 */}
                <div className={`dates-grid ${direction === "prev" ? "slide-left" : "slide-right"}`}>
                    {calendarCells.map((dateObj, idx) => {
                        if (!dateObj) {
                            return <div key={idx} className="date-cell empty"></div>;
                        }
                        const dayNum = dateObj.getDate();
                        const isoStr = dateObj.toISOString().slice(0, 10);
                        const isToday = isoStr === todayISO;
                        const dayTasks = tasks.filter((t) =>
                            isWithinRange(isoStr, t.start, t.end)
                        );

                        return (
                            <div
                                key={idx}
                                className={`date-cell ${isToday ? "today-highlight" : ""}`}
                            >
                                <div className="date-number">{dayNum}</div>
                                {dayTasks.length > 0 && (
                                    <div className="task-list">
                                        {dayTasks.map((t) => (
                                            <div key={t.id} className="task-item">
                                                {t.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 오른쪽: 일정 알림 패널 */}
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
        </div>
    );
}

export default CalendarSection;
