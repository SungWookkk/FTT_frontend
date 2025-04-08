import React, { useEffect, useRef } from 'react';

/**
 * props:
 * - tasks: 작업 배열 (각 task: { startDate, dueDate, status, title, ... })
 * - year: 달력의 연도
 * - month: 달력의 월 (0 ~ 11)
 */
function CalendarRangeBars({ tasks, year, month }) {
    const overlayRef = useRef(null);

    // 'YYYY-MM-DD' 형식 문자열로 변환
    const getLocalDateString = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const getSectionColor = (task) => {
        if (task.status === 'DONE') {
            return '#27ae60';
        }
        if (task.dueDate) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const due = new Date(task.dueDate);
            const diff = due - now;
            const threeDays = 3 * 24 * 60 * 60 * 1000;
            if (diff <= threeDays && diff >= 0) {
                return '#e74c3c';
            }
        }
        return '#3498db'; // 기본
    };

    useEffect(() => {
        // tasks 또는 달이 바뀔 때마다 기존 막대를 지움
        if (overlayRef.current) {
            overlayRef.current.innerHTML = '';
        }
        // 현재 렌더된 달력의 날짜 셀(.date-cell)을 모두 선택함
        const dateCells = document.querySelectorAll('.dates-grid .date-cell');
        if (!dateCells || dateCells.length === 0) return;

        const cellMap = new Map();
        dateCells.forEach((cell) => {
            const dayNumEl = cell.querySelector('.date-number');
            if (!dayNumEl) return;
            const dayNum = parseInt(dayNumEl.textContent, 10);
            const cellDate = new Date(year, month, dayNum);
            const cellDateStr = getLocalDateString(cellDate);
            cellMap.set(cellDateStr, cell);
        });

        // 각 task마다 시작 셀부터 종료 셀까지 가로 막대 그리기
        tasks?.forEach((task) => {
            if (!task.startDate || !task.dueDate) return;

            const start = new Date(task.startDate);
            const end = new Date(task.dueDate);

            // 현재 달 범위(년/월)의 시작, 종료 날짜 계산
            const firstOfMonth = new Date(year, month, 1);
            const lastOfMonth = new Date(year, month + 1, 0);
            if (end < firstOfMonth || start > lastOfMonth) {
                return; // 완전히 벗어나면 스킵
            }

            // 교집합: 달력에 실제로 표시할 시작/종료 날짜
            const rangeStart = start < firstOfMonth ? firstOfMonth : start;
            const rangeEnd = end > lastOfMonth ? lastOfMonth : end;

            const startStr = getLocalDateString(rangeStart);
            const endStr = getLocalDateString(rangeEnd);
            const startCell = cellMap.get(startStr);
            const endCell = cellMap.get(endStr);
            if (!startCell || !endCell) return;

            // overlay의 좌표 기준으로 각 셀의 좌표 계산
            const overlayRect = overlayRef.current.getBoundingClientRect();
            const startRect = startCell.getBoundingClientRect();
            const endRect = endCell.getBoundingClientRect();
            const left = startRect.left - overlayRect.left;
            const right = endRect.right - overlayRect.left;
            // 날짜 셀 내 '일자' 텍스트 바로 아래 22px 위치에서 그리도록
            const top = startRect.top - overlayRect.top + 22;
            const height = 8; // 막대 높이

            // 막대 엘리먼트 생성
            const bar = document.createElement('div');
            bar.style.position = 'absolute';
            bar.style.left = left + 'px';
            bar.style.top = top + 'px';
            bar.style.width = (right - left) + 'px';
            bar.style.height = height + 'px';
            bar.style.backgroundColor = getSectionColor(task);
            bar.style.borderRadius = '4px';
            bar.style.opacity = 0.85;
            bar.style.pointerEvents = 'none';

            overlayRef.current.appendChild(bar);
        });
    }, [tasks, year, month]);

    return (
        <div
            ref={overlayRef}
            style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        />
    );
}

export default CalendarRangeBars;
