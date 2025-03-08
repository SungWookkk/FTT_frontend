import React, { useState, useRef } from "react";
import "../todolist/css/TodoListContent.css";
import { useHistory } from "react-router-dom";
import { Task } from "./Task";

import TodoCreateModal from "./TodoCreateModal";
import "../todolist/css/TodoCreateModal.css";

const TodoListContent = () => {
    const history = useHistory();

    // ========== (새로 추가) 생성 모달 열림 상태 ==========
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // 모달 열기/닫기 함수
    const handleOpenCreateModal = () => setIsCreateModalOpen(true);
    const handleCloseCreateModal = () => setIsCreateModalOpen(false);

    // -------------------------------------------------------
    // 기존 섹션/작업 목록 데이터
    const sections = [
        {
            title: "📍 최근 작성",
            color: "#ffa500",
            tasks: [
                { id: 1, title: "어서 마무리를 하자", description: "이거 빨리 디자인을 마무리해야 해..." },
                { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
                // ...
                { id: 3, title: "근데 아마 이걸로 할 거 같은데", description: "이번 디자인으로 끝내자" }
            ]
        },
        {
            title: "⏳ 마감 임박",
            color: "#e74c3c",
            tasks: [
                { id: 4, title: "프레젠테이션 준비", description: "내일까지 발표 자료 완성" },
                // ...
                { id: 6, title: "서류 제출", description: "업무 보고서 제출 기한 체크" }
            ]
        },
        {
            title: "🔥 남은 To Do",
            color: "#3498db",
            tasks: [
                { id: 7, title: "새로운 기능 개발", description: "API 설계 및 구현 진행" },
                // ...
                { id: 9, title: "성능 최적화", description: "페이지 로딩 속도 개선" }
            ]
        },
        {
            title: "✅ 완료됨",
            color: "#27ae60",
            tasks: [
                { id: 10, title: "배포 완료", description: "최신 버전 배포 완료" },
                // ...
                { id: 12, title: "코드 리팩토링", description: "불필요한 코드 정리" }
            ]
        }
    ];

    // "더보기" 상태
    const [expandedSections, setExpandedSections] = useState({});
    const moreTasksRefs = useRef({});

    // 선택된 섹션 인덱스
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
    // 선택된 섹션(객체) & 해당 섹션의 Task 배열
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedSectionTasks, setSelectedSectionTasks] = useState([]);

    // 애니메이션 클래스
    const [transitionClass, setTransitionClass] = useState("");

    // 수정 기능
    const [isEditMode, setIsEditMode] = useState(false);

    // "더보기" 버튼
    const handleToggleTasks = (index) => {
        setExpandedSections((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // 특정 섹션 + 특정 Task 클릭 => 오른쪽에 "그 Task만" 표시
    const handleSelectSection = (section, task) => {
        if (isEditMode) {
            alert(`"${section.title}" - "${task.title}" 작업을 수정합니다!`);
            return;
        }
        const idx = sections.findIndex((s) => s.title === section.title);
        setSelectedSectionIndex(idx);
        setSelectedSection(section);
        setSelectedSectionTasks([task]);
    };

    // 뒤로 가기
    const handleBackToAll = () => {
        setSelectedSectionIndex(null);
        setSelectedSection(null);
        setSelectedSectionTasks([]);
        setTransitionClass("");
    };

    // "이전" 섹션 (무한 반복)
    const handlePrevSection = () => {
        if (selectedSectionIndex === null) return;
        const newIndex = (selectedSectionIndex - 1 + sections.length) % sections.length;
        animateSectionChange(newIndex, "prev");
    };

    // "다음" 섹션 (무한 반복)
    const handleNextSection = () => {
        if (selectedSectionIndex === null) return;
        const newIndex = (selectedSectionIndex + 1) % sections.length;
        animateSectionChange(newIndex, "next");
    };

    const [detailTransitionClass, setDetailTransitionClass] = useState("");

    // 부드러운 섹션 전환
    const animateSectionChange = (newIndex, direction) => {
        setTransitionClass(direction === "next" ? "slide-out-left" : "slide-out-right");
        setDetailTransitionClass(direction === "next" ? "slide-out-left-detail" : "slide-out-right-detail");

        setTimeout(() => {
            setSelectedSectionIndex(newIndex);
            setSelectedSection(sections[newIndex]);
            setSelectedSectionTasks([sections[newIndex].tasks[0]]);

            setTransitionClass(direction === "next" ? "slide-in-right" : "slide-in-left");
            setDetailTransitionClass(direction === "next" ? "slide-in-right-detail" : "slide-in-left-detail");

            setTimeout(() => {
                setTransitionClass("");
                setDetailTransitionClass("");
            }, 300);
        }, 300);
    };

    // "전체 목록" 버튼 클릭 시 페이지 이동
    const handleAllListViewClick = () => {
        history.push("/todo/list-all");
    };

    // "작업 추가 생성" 버튼 (기존 이동 -> 이제 사용 안 할 수도 있음)
    const handleAddTask = () => {
        // history.push("/todo/write");
        alert("이 버튼은 이제 사용 안 해요! (예시)");
    };

    // 수정 모드
    const handleEditClick = () => {
        setIsEditMode((prev) => !prev);
    };

    return (
        <div className="dashboard-content">
            {/* 작업공간 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">To Do List - 작업 공간</span>
                </div>
                <div className="header-button-group">
                    {/* (중요) "생성하기" -> 모달 열기 */}
                    <button
                        className="btn btn-create"
                        onClick={handleOpenCreateModal}
                    >
                        생성하기
                    </button>

                    <button className="btn btn-edit" onClick={handleEditClick}>
                        {isEditMode ? "수정 취소" : "수정"}
                    </button>
                    <button className="btn btn-delete">삭제</button>
                </div>
            </div>

            {/* 목록 선택 탭 */}
            <div className="list-tap">
                <div className="list-tab-container">
                    <div className="tab-item active">내 목록</div>
                    <div className="tab-item" onClick={handleAllListViewClick}>전체 목록</div>
                    <div className="tab-item">팀</div>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text-todo">
                    <span className="highlight-text">효율적인 하루</span>
                    <span className="normal-text">를 설계하세요! 우리의 </span>
                    <span className="highlight-text">To-Do List 서비스</span>
                    <span className="normal-text">
                        를 통해 목표를 정리하고 실천하세요. 지금 바로 시작해보세요!
                    </span>
                </p>
            </div>

            {/* 수정 모드 배너 */}
            {isEditMode && (
                <div className="edit-mode-banner">
                    <p>수정할 작업을 선택하세요!</p>
                </div>
            )}

            {/* 작업 리스트 & 상세 정보 표시 */}
            <div className={`task-view-container ${transitionClass} ${isEditMode ? "edit-mode" : ""}`}>
                {/* 왼쪽 목록 */}
                <div className={`task-sections ${transitionClass} ${isEditMode ? "edit-mode" : ""}`}>
                    {sections.map((section, index) => {
                        // 선택된 섹션이 있다면, title이 다른 섹션은 숨김
                        if (selectedSection && section.title !== selectedSection.title) {
                            return null;
                        }

                        const visibleTasks = expandedSections[index]
                            ? section.tasks
                            : section.tasks.slice(0, 6);

                        return (
                            <div className="task-section" key={index}>
                                <div
                                    className="section-header"
                                    style={{ borderBottom: `5px solid ${section.color}` }}
                                >
                                    <div className="section-header-content">
                                        <span className="section-title">
                                            {section.title} {section.tasks.length}
                                        </span>

                                        {/* 인디케이터 - 현재 섹션 위치 표시 */}
                                        {selectedSection && selectedSection.title === section.title && (
                                            <div className="indicator-container">
                                                {sections.map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={
                                                            "indicator-dot " +
                                                            (selectedSectionIndex === i ? "active" : "")
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* 기존 "작업 추가 생성" 버튼 */}
                                        <span className="add-task" onClick={handleAddTask}>
                                            + 작업 추가 생성
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={`task-list ${expandedSections[index] ? "expanded" : ""}`}
                                    ref={(el) => (moreTasksRefs.current[index] = el)}
                                >
                                    {visibleTasks.map((task) => (
                                        <Task
                                            key={task.id}
                                            title={task.title}
                                            description={task.description}
                                            onClick={() => handleSelectSection(section, task)}
                                        />
                                    ))}
                                </div>

                                {section.tasks.length > 6 && (
                                    <div
                                        className="more-tasks-btn"
                                        onClick={() => handleToggleTasks(index)}
                                    >
                                        {expandedSections[index] ? "▲ 접기" : "▼ 더보기"}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 오른쪽 상세 영역: 단일 Task 정보 */}
                {selectedSection && selectedSectionTasks.length > 0 && (
                    <div className={`selected-task-details ${detailTransitionClass}`}>
                        <button className="btn-back-top-right" onClick={handleBackToAll}>
                            ← 뒤로 가기
                        </button>

                        <div
                            className="section-header"
                            style={{
                                borderBottom: `5px solid ${selectedSection.color}`,
                                width: "100%",
                                marginBottom: "20px"
                            }}
                        >
                            <div className="section-header-content">
                                <span className="section-title">
                                    {selectedSection.title} - Task 상세
                                </span>
                            </div>
                        </div>

                        <ul>
                            {selectedSectionTasks.map((task) => (
                                <li key={task.id}>
                                    <strong>제목:</strong> {task.title} <br/>
                                    <strong>설명:</strong> {task.description} <br/>
                                    <br/>
                                    <strong>이 하위는 백엔드 설계 후 추가 예정</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 이전/다음 섹션 화살표 */}
                {selectedSection && (
                    <>
                        <button className="arrow-nav-left" onClick={handlePrevSection}>◀</button>
                        <button className="arrow-nav-right" onClick={handleNextSection}>▶</button>
                    </>
                )}
            </div>

            {/* (중요) "생성하기" 모달 - 열려 있을 때만 표시 */}
            {isCreateModalOpen && (
                <TodoCreateModal onClose={handleCloseCreateModal} />
            )}
        </div>
    );
};

export default TodoListContent;
