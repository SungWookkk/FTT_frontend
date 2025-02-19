import React from "react";
import "../todolist/css/Task.css";

export const Task = ({ title, description, onClick }) => {
    return (
        <div className="task" onClick={onClick}> {/* 클릭하면 해당 섹션 보기 */}
            <div className="task-checkbox-placeholder"></div>
            <div className="task-content">
                <div className="task-name">{title}</div>
                <p className="description">{description}</p>
            </div>
        </div>
    );
};
