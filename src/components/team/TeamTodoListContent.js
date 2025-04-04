import React from "react";
import "../team/css/TeamTodoListContent.css";

/**
 * 단순 디자인 시연용 Dummy Task 목록
 * - 실제 로직이나 API 연동은 제거한 상태
 */
function TeamTodoListContent() {
    // 예시로 4개의 Task를 가로로 보여줍니다.
    const dummyTasks = [
        {
            id: 1,
            sectionTitle: "🔥 진행중",
            sectionColor: "#f39c12",
            title: "UI/UX 개선",
            description: "피드백 반영하여 UI 수정",
        },
        {
            id: 2,
            sectionTitle: "✅ 완료됨",
            sectionColor: "#27ae60",
            title: "API 연동",
            description: "백엔드 API와 연동 완료",
        },
        {
            id: 3,
            sectionTitle: "🕓 보류",
            sectionColor: "#3498db",
            title: "DB 스키마 재설계",
            description: "추가 논의 필요",
        },
        {
            id: 4,
            sectionTitle: "⚠ 긴급",
            sectionColor: "#e74c3c",
            title: "서버 이슈 해결",
            description: "서버 다운 문제 해결",
        },
    ];

    return (
        <div className="team-todo-container">
            <h2 className="team-task-title">팀 작업</h2>

            <div className="team-all-tasks-grid">
                {dummyTasks.map((task) => (
                    <div key={task.id} className="team-all-list-task-card">
                        <div
                            className="team-task-section-badge"
                            style={{ backgroundColor: task.sectionColor }}
                        >
                            {task.sectionTitle}
                        </div>
                        <div className="team-all-list-task-title">{task.title}</div>
                        <div className="team-all-list-task-desc">{task.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TeamTodoListContent;
