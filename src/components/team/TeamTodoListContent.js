import React, { useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../team/css/TeamTodoListContent.css";

/**
 * 단순 디자인 시연용 Dummy Task 목록
 * - 실제 로직이나 API 연동은 제거한 상태
 * - dummyTasks가 8개를 초과하면 "더 보기"/"접기" 버튼을 통해 토글합니다.
 * - 추가되는 Task들은 애니메이션 효과로 부드럽게 나타납니다.
 */
function TeamTodoListContent() {
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
        {
            id: 5,
            sectionTitle: "🔥 진행중",
            sectionColor: "#f39c12",
            title: "문서 업데이트",
            description: "최신 기술 문서 정리",
        },
        {
            id: 6,
            sectionTitle: "✅ 완료됨",
            sectionColor: "#27ae60",
            title: "디자인 수정",
            description: "로고 및 컬러 수정",
        },
        {
            id: 7,
            sectionTitle: "🕓 보류",
            sectionColor: "#3498db",
            title: "마케팅 전략",
            description: "SNS 홍보 계획 수립",
        },
        {
            id: 8,
            sectionTitle: "⚠ 긴급",
            sectionColor: "#e74c3c",
            title: "보안 점검",
            description: "취약점 검토 및 수정",
        },
        {
            id: 9,
            sectionTitle: "🔥 진행중",
            sectionColor: "#f39c12",
            title: "프로토타입 제작",
            description: "새 기능 프로토타입 제작",
        },
        {
            id: 10,
            sectionTitle: "✅ 완료됨",
            sectionColor: "#27ae60",
            title: "테스트 자동화",
            description: "CI/CD 파이프라인 구축",
        },
    ];

    const initialVisibleCount = 8;
    const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

    const handleToggleVisible = () => {
        if (visibleCount === dummyTasks.length) {
            setVisibleCount(initialVisibleCount);
        } else {
            setVisibleCount(dummyTasks.length);
        }
    };

    return (
        <div className="team-todo-container">
            <h2 className="team-task-title">팀 작업</h2>

            <div className="team-all-tasks-grid">
                {/* [추가 애니메이션 효과] TransitionGroup과 CSSTransition을 적용 */}
                <TransitionGroup component={null}>
                    {dummyTasks.slice(0, visibleCount).map((task) => (
                        <CSSTransition key={task.id} timeout={500} classNames="task">
                            <div className="team-all-list-task-card">
                                <div
                                    className="team-task-section-badge"
                                    style={{ backgroundColor: task.sectionColor }}
                                >
                                    {task.sectionTitle}
                                </div>
                                <div className="team-all-list-task-title">{task.title}</div>
                                <div className="team-all-list-task-desc">
                                    {task.description}
                                </div>
                            </div>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </div>

            {dummyTasks.length > initialVisibleCount && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button onClick={handleToggleVisible} className="btn btn-edit-all">
                        {visibleCount === dummyTasks.length ? "접기" : "더 보기"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default TeamTodoListContent;
