// Task.js
import React from "react";
import "../todolist/css/Task.css";

export const Task = ({
                         title,
                         description,
                         onClick,
                         isDeleteMode = false,
                         isSelectedForDelete = false,
                     }) => {
    // 삭제 모드, 선택 여부에 따라 클래스 추가
    const classNames = [
        "task",
        isDeleteMode ? "task-delete-mode" : "",
        isSelectedForDelete ? "task-delete-selected" : "",
    ]
        .join(" ")
        .trim();

    return (
        <div className={classNames} onClick={onClick}>
            <div className="task-content">
                <div className="task-title">{title}</div>
                <div
                    className="task-description"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
        </div>
    );
};
