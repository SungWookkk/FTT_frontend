import React, { useState, useRef } from "react";
import "../todolist/css/TodoListContent.css";
import { useHistory } from "react-router-dom";
import { Task } from "./Task";
import TodoCreateModal from "./TodoCreateModal";
import "../todolist/css/TodoCreateModal.css";

// (추가) 우선순위 드롭다운 & Quill, DatePicker 등
import PriorityDropdown from "../todolist/PriorityDropdown.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
registerLocale("ko", ko);

// Quill 설정 (툴바 등)
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
    ],
};
const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
];

const TodoListContent = () => {
    const history = useHistory();

    // ========== (1) 생성 모달 ========== //
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const handleOpenCreateModal = () => setIsCreateModalOpen(true);
    const handleCloseCreateModal = () => setIsCreateModalOpen(false);

    // ========== (2) 수정 모드 & 수정 모달 ========== //
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null); // 수정할 Task 선택 시 여기에 저장

    // 수정 폼 상태
    const [editTaskName, setEditTaskName] = useState("");
    const [editContent, setEditContent] = useState("<p>작업 내용을 입력하세요...</p>");
    const [editDueDate, setEditDueDate] = useState(null);
    const [editDaysLeft, setEditDaysLeft] = useState(null);
    const [editPriority, setEditPriority] = useState("보통");
    const [editAssignee, setEditAssignee] = useState("");
    const [editMemo, setEditMemo] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Quill 에디터 모달 (수정 폼 안에서 "에디터 열기" 클릭 시)
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [tempHTML, setTempHTML] = useState(editContent);

    // "수정" 버튼
    const handleEditClick = () => {
        setIsEditMode((prev) => !prev);
        // 만약 수정 모드를 끌 때는, 선택 Task/폼 초기화
        if (isEditMode) {
            setSelectedTask(null);
            resetEditForm();
        }
    };

    // 특정 Task 클릭 => 수정 모드라면 수정 모달 열기
    const openEditModalWithTask = (task) => {
        // 여기에 Task 정보를 폼에 세팅
        setEditTaskName(task.title || "");
        setEditContent(task.description || "<p></p>");
        setEditDueDate(null);  // 실제로는 task.dueDate가 있다면 세팅
        setEditDaysLeft(null);
        setEditPriority("보통"); // 실제로는 task.priority
        setEditAssignee("");
        setEditMemo("");
        setUploadedFiles([]);

        setSelectedTask(task);
    };

    // 수정 모달 닫기
    const handleCloseEditModal = () => {
        setSelectedTask(null);
        resetEditForm();
    };

    // 수정 폼 "저장"
    const handleSaveEditForm = () => {
        console.log("=== 수정 폼 저장 ===");
        console.log("작업 이름:", editTaskName);
        console.log("작업 내용(HTML):", editContent);
        console.log("마감일:", editDueDate);
        console.log("우선순위:", editPriority);
        console.log("담당자:", editAssignee);
        console.log("메모:", editMemo);
        console.log("업로드된 파일:", uploadedFiles);

        alert(`"${editTaskName}" 작업이 수정되었습니다! (실제로는 백엔드로 전송)`);
        handleCloseEditModal();
    };

    // 수정 폼 초기화
    const resetEditForm = () => {
        setEditTaskName("");
        setEditContent("<p>작업 내용을 입력하세요...</p>");
        setEditDueDate(null);
        setEditDaysLeft(null);
        setEditPriority("보통");
        setEditAssignee("");
        setEditMemo("");
        setUploadedFiles([]);
        setIsEditorOpen(false);
    };

    // 파일 첨부 (수정 모달)
    const handleFileChangeEdit = (e) => {
        if (!e.target.files) return;
        const newFiles = [...uploadedFiles, ...Array.from(e.target.files)];
        setUploadedFiles(newFiles);
    };
    const handleRemoveFileEdit = (idx) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
    };
    const handleDragOverEdit = (e) => e.preventDefault();
    const handleDropEdit = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
        }
    };

    // 마감일 계산 (수정 모달)
    const handleDueDateChangeEdit = (date) => {
        setEditDueDate(date);
        if (!date) {
            setEditDaysLeft(null);
            return;
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const diff = Math.floor((date - now) / (1000 * 60 * 60 * 24));
        setEditDaysLeft(diff);
    };

    // Quill 에디터 열기/닫기 (수정 모달)
    const openEditor = () => {
        setTempHTML(editContent);
        setIsEditorOpen(true);
    };
    const saveEditorContent = () => {
        setEditContent(tempHTML);
        setIsEditorOpen(false);
    };

    // -------------------------------------------------------
    // 기존 섹션/작업 목록 데이터
    const sections = [
        {
            title: "📍 최근 작성",
            color: "#ffa500",
            tasks: [
                { id: 1, title: "어서 마무리를 하자", description: "이거 빨리 디자인을 마무리해야 해..." },
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

    // "더보기" 상태
    const [expandedSections, setExpandedSections] = useState({});
    const moreTasksRefs = useRef({});

    // "더보기" 버튼
    const handleToggleTasks = (index) => {
        setExpandedSections((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // 특정 섹션 + 특정 Task 클릭 => 수정 모드면 수정 모달 열기, 아니면 알림/일반동작
    const handleSelectSection = (section, task) => {
        // 우선 섹션 인덱스를 찾음
        const idx = sections.findIndex((s) => s.title === section.title);

        if (isEditMode) {
            // 수정 모드 → 수정 모달 열기
            openEditModalWithTask({
                ...task,
                sectionColor: section.color,
                sectionTitle: section.title
            });
        } else {
            // 일반 모드 → 우측 상세 표시
            setSelectedSectionIndex(idx);
            setSelectedSection(section);
            setSelectedSectionTasks([task]);
        }
    };

    // 뒤로 가기(섹션)
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedSectionTasks, setSelectedSectionTasks] = useState([]);
    const [transitionClass, setTransitionClass] = useState("");
    const [detailTransitionClass, setDetailTransitionClass] = useState("");

    const handleBackToAll = () => {
        setSelectedSectionIndex(null);
        setSelectedSection(null);
        setSelectedSectionTasks([]);
        setTransitionClass("");
    };

    // "이전" 섹션
    const handlePrevSection = () => {
        if (selectedSectionIndex === null) return;
        const newIndex = (selectedSectionIndex - 1 + sections.length) % sections.length;
        animateSectionChange(newIndex, "prev");
    };

    // "다음" 섹션
    const handleNextSection = () => {
        if (selectedSectionIndex === null) return;
        const newIndex = (selectedSectionIndex + 1) % sections.length;
        animateSectionChange(newIndex, "next");
    };

    // 부드러운 섹션 전환 (예시)
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

    // "전체 목록" 버튼
    const handleAllListViewClick = () => {
        history.push("/todo/list-all");
    };


    return (
        <div className="dashboard-content">
            {/* 작업공간 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">To Do List - 작업 공간</span>
                </div>
                <div className="header-button-group">
                    {/* 생성 모달 열기 */}
                    <button
                        className="btn btn-create"
                        onClick={handleOpenCreateModal}
                    >
                        생성하기
                    </button>

                    {/* 수정 버튼 */}
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

                                        {/* 작업 추가 생성 버튼 */}
                                        <span className="add-task" onClick={handleOpenCreateModal}>
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

            {/* ---------------------- 수정 모달 (좌: 미리보기 / 우: 폼) ---------------------- */}
            {/** selectedTask && isEditMode => 수정 모달 표시 */}
            {selectedTask && isEditMode && (
                <div className="modal-overlay" onClick={handleCloseEditModal}>
                    <div className="modal-edit-content" onClick={(e) => e.stopPropagation()}>
                        {/* 좌측: 상세 정보 (실시간 미리보기) */}
                        <div className="edit-left-panel">
                            <div
                                className="section-header1"
                                style={{
                                    borderBottom: `5px solid ${selectedTask.sectionColor || "#000"}`,
                                    marginTop: "1px"
                                }}
                            >
                                <div className="section-header-content">
                                    <h2 className="modal-title">작업 상세 (미리보기)</h2>
                                </div>
                            </div>


                            <div className="modal-body">
                                <p><strong>섹션:</strong> {selectedTask.sectionTitle}</p>
                                <p><strong>작업 이름:</strong> {editTaskName}</p>
                                <p><strong>작업 내용:</strong></p>
                                <div
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: 8,
                                        minHeight: 80,
                                        background: "#fff",
                                    }}
                                    dangerouslySetInnerHTML={{__html: editContent}}
                                />
                                <p><strong>마감일:</strong> {editDueDate ? editDueDate.toLocaleDateString() : "미설정"}</p>
                                <p><strong>우선순위:</strong> {editPriority}</p>
                                <p><strong>담당자:</strong> {editAssignee}</p>
                                <p><strong>메모:</strong> {editMemo}</p>
                                <p><strong>첨부파일:</strong> {uploadedFiles.map((f) => f.name).join(", ")}</p>
                            </div>
                        </div>

                        {/* 우측: 수정 폼 */}
                        <div className="form-panel1">
                            <h3>작업 수정 폼</h3>

                            {/* 작업 이름 */}
                            <div className="form-field1">
                                <label>작업 이름</label>
                                <input
                                    type="text"
                                    placeholder="작업 이름"
                                    value={editTaskName}
                                    onChange={(e) => setEditTaskName(e.target.value)}
                                />
                            </div>

                            {/* 작업 내용 */}
                            <div className="form-field1">
                                <label>작업 내용</label>
                                <div
                                    className="content-preview form-preview1"
                                    style={{ minHeight: 60 }}
                                    dangerouslySetInnerHTML={{ __html: editContent }}
                                />
                                <button className="editor-open-btn" onClick={openEditor}>
                                    에디터 열기
                                </button>
                            </div>

                            {/* 마감일 */}
                            <div className="form-field1">
                                <label>마감일</label>
                                <DatePicker
                                    selected={editDueDate}
                                    onChange={handleDueDateChangeEdit}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="연도-월-일"
                                    locale="ko"
                                    className="custom-date-input1"
                                />
                                {editDaysLeft !== null && (
                                    <div style={{ marginTop: 4, color: "green" }}>
                                        {editDaysLeft > 0
                                            ? `D-${editDaysLeft}`
                                            : editDaysLeft === 0
                                                ? "오늘이 마감일입니다!"
                                                : `마감일이 ${Math.abs(editDaysLeft)}일 지났습니다 (D+${Math.abs(editDaysLeft)})`}
                                    </div>
                                )}
                            </div>

                            {/* 우선순위 */}
                            <div className="form-field1">
                                <label>우선순위</label>
                                <PriorityDropdown
                                    priority={editPriority}
                                    onChange={(val) => setEditPriority(val)}
                                />
                            </div>

                            {/* 담당자 */}
                            <div className="form-field1">
                                <label>담당자</label>
                                <input
                                    type="text"
                                    placeholder="담당자 이름"
                                    value={editAssignee}
                                    onChange={(e) => setEditAssignee(e.target.value)}
                                />
                            </div>

                            {/* 메모 */}
                            <div className="form-field1">
                                <label>메모</label>
                                <textarea
                                    rows={3}
                                    placeholder="추가 메모를 입력하세요"
                                    value={editMemo}
                                    onChange={(e) => setEditMemo(e.target.value)}
                                />
                            </div>

                            {/* 파일 첨부 */}
                            <div className="form-field1">
                                <label>파일 첨부</label>
                                <div
                                    className="file-drop-area"
                                    onDragOver={handleDragOverEdit}
                                    onDrop={handleDropEdit}
                                >
                                    <p className="file-instruction1">
                                        이 영역을 드래그하거나 <span>클릭</span>하여 업로드
                                    </p>
                                    <input
                                        type="file"
                                        multiple
                                        className="file-input"
                                        onChange={handleFileChangeEdit}
                                    />
                                </div>
                                <div className="file-list1">
                                    {uploadedFiles.map((file, idx) => (
                                        <div className="file-item" key={idx}>
                                            <span className="file-name">{file.name}</span>
                                            <button
                                                className="file-remove-btn"
                                                onClick={() => handleRemoveFileEdit(idx)}
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 하단 버튼 */}
                            <div className="drawer-footer" style={{ marginTop: 16, textAlign: "right" }}>
                                <button className="btn btn-delete" onClick={handleCloseEditModal} style={{ marginRight: 8 }}>
                                    취소
                                </button>
                                <button className="btn btn-create" onClick={handleSaveEditForm}>
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quill 에디터 모달 */}
                    {isEditorOpen && (
                        <div
                            className="editor-modal-overlay"
                            onClick={() => setIsEditorOpen(false)}
                            style={{
                                position: "fixed",
                                top: 0, left: 0,
                                width: "100%", height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                zIndex: 9999,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <div
                                className="editor-modal"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: "#fff",
                                    width: 600,
                                    maxWidth: "90%",
                                    borderRadius: 8,
                                    padding: 20,
                                    position: "relative"
                                }}
                            >
                                <div className="editor-header" style={{ marginBottom: 10 }}>
                                    <h2>사용자 커스텀 편집</h2>
                                    <button onClick={() => setIsEditorOpen(false)} style={{ float: "right", fontSize: 20 }}>
                                        ×
                                    </button>
                                </div>
                                <ReactQuill
                                    theme="snow"
                                    value={tempHTML}
                                    onChange={setTempHTML}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    style={{ height: "300px", marginBottom: "20px" }}
                                />
                                <div className="editor-footer" style={{ textAlign: "right" }}>
                                    <button onClick={() => setIsEditorOpen(false)} style={{ marginRight: 8 }}>
                                        취소
                                    </button>
                                    <button onClick={saveEditorContent}>
                                        확인
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TodoListContent;