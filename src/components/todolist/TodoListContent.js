import React, { useState, useRef, useEffect } from "react";
import "../todolist/css/TodoListContent.css";
import { Task } from "./Task";

const TodoListContent = () => {
    //  작업 목록 데이터
    const tasks = [
        { id: 1, title: "어서 마무리를 하자", description: "이거 빨리 디자인을 마무리해야 해..." },
        { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
        { id: 3, title: "근데 아마 이걸로 할 거 같은데", description: "이번 디자인으로 끝내자" },
        { id: 4, title: "개발 기간은 아마", description: "개발 기간은 3개월 예상" },
        { id: 5, title: "프로젝트 리팩토링", description: "코드를 정리하고 개선 작업" },
        { id: 6, title: "데이터베이스 최적화", description: "쿼리 성능 개선 및 인덱스 추가" },
        { id: 7, title: "프론트엔드 성능 개선", description: "React 최적화 작업 진행" },
        { id: 8, title: "배포 환경 구성", description: "AWS 환경 구성 완료" },
        { id: 9, title: "테스트 코드 작성", description: "단위 및 통합 테스트 코드 작성" }
    ];

    //  "더보기" 버튼 상태 관리
    const [showAll, setShowAll] = useState(false);
    const moreTasksRef = useRef(null);

    //  표시할 작업 목록
    const visibleTasks = showAll ? tasks : tasks.slice(0, 6);

    //  "더보기" 버튼 클릭 이벤트
    const handleToggleTasks = () => {
        setShowAll((prev) => !prev);
    };

    //  "더보기" 클릭 시 부드럽게 스크롤
    useEffect(() => {
        if (showAll && moreTasksRef.current) {
            moreTasksRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [showAll]);

    return (
        <div className="dashboard-content">
            {/* 작업공간 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">작업공간</span>
                </div>
                <div className="header-button-group">
                    <button className="btn btn-create">생성하기</button>
                    <button className="btn btn-edit">수정</button>
                    <button className="btn btn-delete">삭제</button>
                </div>
            </div>

            {/* 목록 선택 탭 */}
            <div className="list-tap">
                <div className="list-tab-container">
                    <div className="tab-item active">목록</div>
                    <div className="tab-item">내용</div>
                    <div className="tab-item">팀</div>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text-todo">
                    <span className="highlight-text">효율적인 하루</span>
                    <span className="normal-text">를 설계하세요! 우리의 </span>
                    <span className="highlight-text">To-Do List 서비스</span>
                    <span className="normal-text">를 통해 목표를 정리하고 실천하세요. 지금 바로 시작해보세요!</span>
                </p>
            </div>

            {/* 작업 리스트 */}
            <div className="task-sections">
                <div className="task-section">
                    <div className="section-header recent-header">
                        <span className="section-title">📍 최근 작성 {tasks.length}</span>
                    </div>

                    {/* 🔹 동적 렌더링 */}
                    <div className={`task-list ${showAll ? "expanded" : ""}`} ref={moreTasksRef}>
                        {visibleTasks.map(task => (
                            <Task key={task.id} title={task.title} description={task.description} />
                        ))}
                    </div>

                    {/* "더보기" 버튼 */}
                    {tasks.length > 6 && (
                        <div className="more-tasks-btn" onClick={handleToggleTasks}>
                            {showAll ? "▲ 접기" : "▼ 더보기"}
                        </div>
                    )}

                    <div className="add-task">+ 작업 추가 생성</div>
                </div>
            </div>
        </div>
    );
};

export default TodoListContent;
