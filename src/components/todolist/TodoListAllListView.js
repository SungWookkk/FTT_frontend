import React, { useState, useEffect } from "react";
import "../todolist/css/TodoListContent.css";
import { useHistory } from "react-router-dom";
import "../todolist/css/TodoListAllListView.css";
import PriorityDropdown from "../todolist/PriorityDropdown.js";

/* Quill, DatePicker 필요한 라이브러리 */
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

// Quill 설정
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

registerLocale("ko", ko);

function TodoListAllListView() {
    const history = useHistory();

    // ---------------------- (1) 수정 모드, Task 선택 ----------------------
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };
    const handleCloseModal = () => {
        setSelectedTask(null);
        resetEditForm();
    };
    const handleEditClick = () => {
        setIsEditMode((prev) => !prev);
        // 수정 모드 끌 때, 폼 초기화
        if (isEditMode) {
            resetEditForm();
            setSelectedTask(null);
        }
    };

    // ---------------------- 수정 폼 상태 ----------------------
    const [editTaskName, setEditTaskName] = useState("");
    const [editContent, setEditContent] = useState("<p>작업 내용을 입력하세요...</p>");
    const [editDueDate, setEditDueDate] = useState(null);
    const [editDaysLeft, setEditDaysLeft] = useState(null);
    const [editPriority, setEditPriority] = useState("보통");
    const [editAssignee, setEditAssignee] = useState("");
    const [editMemo, setEditMemo] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // ---------------------- Quill 에디터 모달 ----------------------
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [tempHTML, setTempHTML] = useState(editContent);

    // 폼 초기화
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

    // ---------------------- 파일 첨부 핸들러 ----------------------
    const handleFileChange = (e) => {
        if (!e.target.files) return;
        const newFiles = [...uploadedFiles, ...Array.from(e.target.files)];
        setUploadedFiles(newFiles);
    };
    const handleRemoveFile = (idx) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
    };
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
        }
    };

    // ----------------------  마감일 계산 ----------------------
    const handleDueDateChange = (date) => {
        setEditDueDate(date);
        if (!date) {
            setEditDaysLeft(null);
            return;
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const picked = new Date(date);
        picked.setHours(0, 0, 0, 0);

        const diff = Math.floor((picked - now) / (1000 * 60 * 60 * 24));
        setEditDaysLeft(diff);
    };

    // ---------------------- Quill 에디터 ----------------------
    const openEditor = () => {
        setTempHTML(editContent);
        setIsEditorOpen(true);
    };
    const closeEditor = () => setIsEditorOpen(false);
    const saveEditorContent = () => {
        setEditContent(tempHTML);
        setIsEditorOpen(false);
    };

    // ---------------------- 수정 폼 저장 ----------------------
    const handleSaveEditForm = () => {
        console.log("=== 수정 폼 저장 ===");
        console.log("작업 이름:", editTaskName);
        console.log("작업 내용(HTML):", editContent);
        console.log("마감일:", editDueDate);
        console.log("우선순위:", editPriority);
        console.log("담당자:", editAssignee);
        console.log("메모:", editMemo);
        console.log("업로드된 파일:", uploadedFiles);

        alert("수정 내용이 저장되었습니다! (실제로는 백엔드로 전송)");
        handleCloseModal();
    };

    // ---------------------- 더미 섹션 / Task 데이터 ----------------------
    const sections = [
        {
            title: "📍 최근 작성",
            color: "#ffa500",
            tasks: [
                { id: 1, title: "어서 마무리를 하자", description: "이거 빨리 디자인을 마무리해야 해..." },
                { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
                // ... (가상의 Task들)
                { id: 3, title: "근데 아마 이걸로 할 거 같은데", description: "이번 디자인으로 끝내자" }
            ]
        },
        {
            title: "⏳ 마감 임박",
            color: "#e74c3c",
            tasks: [
                { id: 4, title: "프레젠테이션 준비", description: "내일까지 발표 자료 완성" },
                { id: 5, title: "코드 리뷰", description: "PR 코드 리뷰 마감일 준수" },
                { id: 5, title: "코드 리뷰", description: "PR 코드 리뷰 마감일 준수" },
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

    // 모든 섹션의 task들을 하나의 배열로 병합
    const allTasks = sections.reduce((acc, section) => {
        const tasksWithSection = section.tasks.map((task) => ({
            ...task,
            sectionTitle: section.title,
            sectionColor: section.color,
        }));
        return acc.concat(tasksWithSection);
    }, []);

    // ---------------------- 필터  검색 ----------------------
    const [filterOption, setFilterOption] = useState("all");
    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [searchOption, setSearchOption] = useState("both");
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleSearchOptionChange = (e) => {
        setSearchOption(e.target.value);
    };

    let displayTasks = [...allTasks];

    // 필터 적용
    if (filterOption === "completed") {
        displayTasks = displayTasks.filter((task) => task.sectionTitle === "✅ 완료됨");
    } else if (filterOption === "dueSoon") {
        displayTasks = displayTasks.filter((task) => task.sectionTitle === "⏳ 마감 임박");
    } else if (filterOption === "remainingTodo") {
        displayTasks = displayTasks.filter((task) => task.sectionTitle === "🔥 남은 To Do");
    }

    // 검색 적용
    if (searchQuery.trim() !== "") {
        const query = searchQuery.trim().toLowerCase();
        if (searchOption === "title") {
            displayTasks = displayTasks.filter((task) => task.title.toLowerCase().includes(query));
        } else if (searchOption === "description") {
            displayTasks = displayTasks.filter((task) => task.description.toLowerCase().includes(query));
        } else {
            displayTasks = displayTasks.filter(
                (task) =>
                    task.title.toLowerCase().includes(query) ||
                    task.description.toLowerCase().includes(query)
            );
        }
    }

    // ---------------------- 더보기 상태저장 ----------------------
    // 1) 보이는 개수를 관리할 state
    const [visibleCount, setVisibleCount] = useState(12);

    // 2) 실제 렌더링할 Task 목록
    const visibleTasks = displayTasks.slice(0, visibleCount);

    // 3) 더 보기 버튼 클릭 시
    const handleLoadMore = () => {
        // 예: 한 번에 10개씩 더 보여주기
        setVisibleCount((prev) => prev + 10);
    };

    // ---------------------- 버튼 이벤트 ----------------------
    const handleCreateClick = () => {
        history.push("/todo/write");
    };
    const handleAllListViewClick = () => {
        history.push("/todo/list-all");
    };
    const handleMyListClick = () => {
        history.push("/todo");
    };

    return (
        <>
            <div className="dashboard-content">
                {/* 작업공간 헤더 */}
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <span className="title-text">To Do List - 작업 공간</span>
                    </div>
                    <div className="header-button-group">
                        <button className="btn btn-create" onClick={handleCreateClick}>
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
                        <div className="tab-item" onClick={handleMyListClick}>
                            내 목록
                        </div>
                        <div className="tab-item active" onClick={handleAllListViewClick}>
                            전체 목록
                        </div>
                        <div className="tab-item">팀</div>
                    </div>
                </div>

                {/* 알림 배너 */}
                <div className="alert-banner-todo">
                    <p className="alert-text-todo1">
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

                {/* 필터 & 검색 컨트롤 */}
                <div className="filter-container">
                    <div className="filter-item">
                        <label htmlFor="filterSelect">필터:</label>
                        <select id="filterSelect" value={filterOption} onChange={handleFilterChange}>
                            <option value="all">전체 작업 보기</option>
                            <option value="completed">완료된 작업만 보기</option>
                            <option value="dueSoon">마감 임박 작업 보기</option>
                            <option value="remainingTodo">남은 To Do 보기</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label htmlFor="searchQuery">검색:</label>
                        <input
                            type="text"
                            id="searchQuery"
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            placeholder="검색어 입력"
                        />
                        <select value={searchOption} onChange={handleSearchOptionChange}>
                            <option value="title">제목만 검색</option>
                            <option value="description">내용만 검색</option>
                            <option value="both">제목+내용 검색</option>
                        </select>
                    </div>
                </div>

                {/* 실제 렌더링할 Task 목록: visibleTasks */}
                <div className={`all-tasks-grid ${isEditMode ? "edit-mode" : ""}`}>
                    {visibleTasks.map((task) => {
                        // 완료됨 여부 확인
                        const isCompleted = task.sectionTitle === "✅ 완료됨";
                        return (
                            <div
                                key={task.id}
                                className={`all-list-task-card ${isCompleted ? "completed-task-card" : ""}`}
                                onClick={() => {
                                    if (isEditMode) {
                                        // 수정 모드 => 수정 모달 열기
                                        setSelectedTask(task);
                                    } else {
                                        // 일반 모드 => 상세 모달 열기
                                        handleTaskClick(task);
                                    }
                                }}
                            >
                                <div className="task-section-badge" style={{ backgroundColor: task.sectionColor }}>
                                    {task.sectionTitle}
                                </div>
                                <div className="all-list-task-title">{task.title}</div>
                                <div className="all-list-task-desc">{task.description}</div>
                            </div>
                        );
                    })}
                </div>

                {visibleCount < displayTasks.length && (
                    <div style={{ textAlign: "center", marginTop: "10px", marginRight:"200px" }}>
                        <button onClick={handleLoadMore} className="btn btn-edit">
                            더 보기
                        </button>
                    </div>
                )}
            </div>

            {/* ---------------------- 일반 모달 (상세 보기) ---------------------- */}
            {selectedTask && !isEditMode && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div
                            className="section-header1"
                            style={{
                                borderBottom: `4px solid ${selectedTask.sectionColor}`,
                                marginTop: "1px",
                                width: "500px",
                            }}
                        >
                            <div className="section-header-content">
                                <h2 className="modal-title">작업 상세 정보</h2>
                            </div>
                        </div>

                        {/* 섹션 (섹션 색상 적용) */}
                        <div className="detail-row">
                            <div className="detail-icon">
                                <i className="fas fa-folder-open" />
                            </div>
                            <div className="detail-text">
                                <span className="detail-label">섹션</span>
                                <div
                                    className="task-section-badge section-pill"
                                    style={{
                                        backgroundColor: selectedTask.sectionColor,
                                    }}
                                >
                                    {selectedTask.sectionTitle}
                                </div>
                            </div>
                        </div>

                        <div className="detail-items-container">
                            {/* 제목 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="fas fa-file-alt" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">제목</span>
                                    <span className="detail-value">{selectedTask.title}</span>
                                </div>
                            </div>

                            {/* 설명 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="fas fa-info-circle" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">설명</span>
                                    <span className="detail-value">{selectedTask.description}</span>
                                </div>
                            </div>

                            {/* 마감일 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="far fa-calendar-alt" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">마감일</span>
                                    <span className="detail-value">
                    {editDueDate ? new Date(editDueDate).toLocaleDateString() : "미설정"}
                  </span>
                                </div>
                            </div>

                            {/* 우선순위 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="fas fa-exclamation-circle" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">우선순위</span>
                                    <span className={`detail-value priority-${editPriority}`}>{editPriority}</span>
                                </div>
                            </div>

                            {/* 담당자 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="fas fa-user" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">담당자</span>
                                    <span className="detail-value">{editAssignee || "미지정"}</span>
                                </div>
                            </div>

                            {/* 메모 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="far fa-sticky-note" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">메모</span>
                                    <span className="detail-value">{editMemo || "메모 없음"}</span>
                                </div>
                            </div>
                        </div>

                        <button className="modal-close-button" onClick={handleCloseModal}>
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* ---------------------- 수정 모달 (좌: 상세 / 우: 폼) ---------------------- */}
            {selectedTask && isEditMode && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-edit-content" onClick={(e) => e.stopPropagation()}>
                        {/* 좌측: 상세 정보 (실시간 미리보기) */}
                        <div className="edit-left-panel">
                            <div
                                className="section-header1"
                                style={{
                                    borderBottom: `5px solid ${selectedTask.sectionColor}`,
                                    marginTop: "1px",
                                }}
                            >
                                <div className="section-header-content">
                                    <h2 className="modal-title">작업 상세 (미리보기)</h2>
                                </div>
                            </div>

                            <div className="modal-body">
                                <p>
                                    <strong>섹션:</strong> {selectedTask.sectionTitle}
                                </p>
                                <p>
                                    <strong>제목:</strong> {editTaskName}
                                </p>
                                <p>
                                    <strong>설명:</strong>
                                    <span dangerouslySetInnerHTML={{ __html: editContent }} />
                                </p>
                                <p>
                                    <strong>마감일:</strong>
                                    {editDueDate ? new Date(editDueDate).toLocaleDateString() : "미설정"}
                                </p>
                                <p>
                                    <strong>우선순위:</strong> {editPriority}
                                </p>
                                <p>
                                    <strong>담당자:</strong> {editAssignee}
                                </p>
                                <p>
                                    <strong>메모:</strong> {editMemo}
                                </p>
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
                                    onChange={handleDueDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="연도-월-일"
                                    locale="ko"
                                    className="custom-date-input1"
                                />
                                {editDaysLeft !== null && (
                                    <div className="due-remaining1">
                                        {editDaysLeft > 0
                                            ? `남은 일수: ${editDaysLeft}일 (D-${editDaysLeft})`
                                            : editDaysLeft === 0
                                                ? "오늘이 마감일입니다."
                                                : `마감일이 ${Math.abs(editDaysLeft)}일 지났습니다 (D+${Math.abs(editDaysLeft)})`}
                                    </div>
                                )}
                            </div>

                            {/* 우선순위 */}
                            <div className="form-field1">
                                <label>우선순위</label>
                                <PriorityDropdown priority={editPriority} onChange={(val) => setEditPriority(val)} />
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
                                <div className="file-drop-area" onDragOver={handleDragOver} onDrop={handleDrop}>
                                    <p className="file-instruction1">
                                        이 영역을 드래그하거나 <span>클릭</span>하여 업로드
                                    </p>
                                    <input type="file" multiple className="file-input" onChange={handleFileChange} />
                                </div>
                                <div className="file-list1">
                                    {uploadedFiles.map((file, idx) => (
                                        <div className="file-item" key={idx}>
                                            <span className="file-name">{file.name}</span>
                                            <button className="file-remove-btn" onClick={() => handleRemoveFile(idx)}>
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 하단 버튼 */}
                            <div className="drawer-footer">
                                <button className="btn btn-delete" onClick={handleCloseModal}>
                                    취소
                                </button>
                                <button className="btn btn-create" onClick={handleSaveEditForm}>
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quill 에디터 모달 (수정 폼에서 "에디터 열기" 클릭 시) */}
            {isEditorOpen && (
                <div className="editor-modal-overlay">
                    <div className="editor-modal">
                        <div className="editor-header">
                            <h2>사용자 커스텀 편집</h2>
                            <button onClick={closeEditor} className="editor-close-btn">
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
                        <div className="editor-footer">
                            <button className="btn btn-edit" onClick={closeEditor}>
                                취소
                            </button>
                            <button className="btn btn-create" onClick={saveEditorContent}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TodoListAllListView;
