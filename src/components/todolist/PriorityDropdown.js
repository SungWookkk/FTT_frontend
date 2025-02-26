import React, { useState } from "react";
import "./css/PriorityDropdown.css";

const priorityOptions = [
    { value: "높음",  label: "매우 중요", color: "#F6C1B5" },
    { value: "보통",  label: "중요",     color: "#F6F0B5" },
    { value: "낮음",  label: "보통",     color: "#D1F6B5" },
];

const PriorityDropdown = ({ priority, onChange }) => {
    const [open, setOpen] = useState(false);

    // 현재 선택된 우선순위 객체 (없으면 기본값)
    const current = priorityOptions.find((opt) => opt.value === priority) || priorityOptions[1];

    // 드롭다운 열기/닫기
    const toggleDropdown = (e) => {
        e.stopPropagation(); // 상위 클릭 이벤트 방지 (필요 시)
        setOpen((prev) => !prev);
    };

    // 우선순위 변경
    const handleSelect = (val) => {
        onChange(val);
        setOpen(false);
    };

    return (
        <div className="priority-dropdown" onClick={toggleDropdown}>
            <div className="priority-pill" style={{ backgroundColor: current.color }}>
                {current.label}
            </div>

            {/* 펼쳐진 메뉴 */}
            {open && (
                <div className="priority-menu">
                    {priorityOptions.map((opt) => (
                        <div
                            key={opt.value}
                            className="priority-menu-item"
                            style={{ backgroundColor: opt.color }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(opt.value);
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PriorityDropdown;
