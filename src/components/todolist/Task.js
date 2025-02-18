import React from "react";
import "../todolist/css/Task.css";

export const Task = ({ title, description }) => {
    return (
        <div className="task">
            {/* 체크박스를 위한 왼쪽 공간 */}
            <div className="task-checkbox-placeholder"></div>

            {/* 작업 내용 */}
            <div className="task-content">
                <div className="task-name">{title}</div>
                <p className="description">{description}</p>
            </div>
        </div>
    );
};
