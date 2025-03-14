import React from "react";
import "../todolist/css/Task.css";

export const Task = ({ title, description, onClick }) => {
    return (
        <div className="task" onClick={onClick}>
            <div className="task-checkbox-placeholder"></div>
            <div className="task-content">
                <div className="task-name">{title}</div>

                {/* description을 HTML로 렌더링 */}
                <div
                    className="description"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
        </div>
    );
};
