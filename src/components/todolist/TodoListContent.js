import React, { useState, useRef } from "react";
import "../todolist/css/TodoListContent.css";
import { Task } from "./Task";

const TodoListContent = () => {
    //  작업 목록 데이터
    const sections = [
        {
            title: "📍 최근 작성",
            color: "#ffa500",
            tasks: [
                { id: 1, title: "어서 마무리를 하자", description: "이거 빨리 디자인을 마무리해야 해..." },
                { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
                { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
                { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
                { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
                { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
                { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
                { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
                { id: 3, title: "근데 아마 이걸로 할 거 같은데", description: "이번 디자인으로 끝내자" }
            ]
        },
        {
            title: "⏳ 마감 임박",
            color: "#e74c3c",
            tasks: [
                { id: 4, title: "프레젠테이션 준비", description: "내일까지 발표 자료 완성" },
                { id: 5, title: "코드 리뷰", description: "PR 코드 리뷰 마감일 준수" },
                { id: 6, title: "서류 제출", description: "업무 보고서 제출 기한 체크" }
            ]
        },
        {
            title: "🔥 남은 To Do",
            color: "#3498db",
            tasks: [
                { id: 7, title: "새로운 기능 개발", description: "API 설계 및 구현 진행" },
                { id: 8, title: "UI 리팩토링", description: "디자인 개선 사항 적용" },
                { id: 9, title: "성능 최적화", description: "페이지 로딩 속도 개선" }
            ]
        },
        {
            title: "✅ 완료됨",
            color: "#27ae60",
            tasks: [
                { id: 10, title: "배포 완료", description: "최신 버전 배포 완료" },
                { id: 11, title: "버그 수정 완료", description: "긴급 수정 사항 반영" },
                { id: 12, title: "코드 리팩토링", description: "불필요한 코드 정리" }
            ]
        }
    ];

    //  상태 관리
    const [expandedSections, setExpandedSections] = useState({});
    const moreTasksRefs = useRef({});
    const [selectedSection, setSelectedSection] = useState(null); // 특정 섹션 선택 상태
    const [selectedSectionTasks, setSelectedSectionTasks] = useState([]); // 선택한 섹션의 Task 리스트

    //  "더보기" 버튼 클릭 이벤트
    const handleToggleTasks = (index) => {
        setExpandedSections((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    //  "특정 섹션 보기" 기능
    const handleSelectSection = (sectionTitle) => {
        const foundSection = sections.find((section) => section.title === sectionTitle);
        if (foundSection) {
            setSelectedSection(sectionTitle);
            setSelectedSectionTasks(foundSection.tasks); // 해당 섹션의 Task 저장
        }
    };

    //  "전체 보기로 돌아가기" 기능
    const handleBackToAll = () => {
        setSelectedSection(null);
        setSelectedSectionTasks([]);
    };

    return (
        <div className="dashboard-content">
            {/* 작업공간 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">To Do List - 작업 공간</span>
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
                    <div className="tab-item active">내 목록</div>
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

            {/* 작업 리스트 & 상세 정보 표시 */}
            <div className="task-view-container">
                {/* 작업 리스트 (왼쪽) */}
                <div className="task-sections">
                    {sections.map((section, index) => {
                        if (selectedSection && section.title !== selectedSection) {
                            return null; // 선택된 섹션만 표시
                        }

                        const visibleTasks = expandedSections[index] ? section.tasks : section.tasks.slice(0, 6);

                        return (
                            <div className="task-section" key={index}>
                                <div className="section-header" style={{ borderBottom: `5px solid ${section.color}`}}>
                                    <div className="section-header-content">
                                        <span className="section-title">{section.title} {section.tasks.length}</span>
                                        <span className="add-task">+ 작업 추가 생성</span>
                                    </div>
                                </div>

                                {/* 동적 렌더링 */}
                                <div className={`task-list ${expandedSections[index] ? "expanded" : ""}`}
                                     ref={el => moreTasksRefs.current[index] = el}>
                                    {visibleTasks.map(task => (
                                        <Task key={task.id} title={task.title} description={task.description} onClick={() => handleSelectSection(section.title)} />
                                    ))}
                                </div>

                                {/* "더보기" 버튼 */}
                                {section.tasks.length > 6 && (
                                    <div className="more-tasks-btn" onClick={() => handleToggleTasks(index)}>
                                        {expandedSections[index] ? "▲ 접기" : "▼ 더보기"}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 선택된 섹션 Task 리스트 (오른쪽) */}
                {selectedSection && (
                    <div className="selected-task-details">
                        {/* 뒤로 가기 버튼 */}
                        {selectedSection && (
                            <div className="back-button-container">
                                <button className="btn-back" onClick={handleBackToAll}>← 뒤로 가기</button>
                            </div>
                        )}
                        <h3>{selectedSection} - Task 리스트</h3>
                        <ul>
                            {selectedSectionTasks.map((task) => (
                                <li key={task.id}>
                                    <strong>제목:</strong> {task.title} <br />
                                    <strong>설명:</strong> {task.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoListContent;
