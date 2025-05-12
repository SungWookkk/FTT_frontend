import React, { useState, useEffect, useRef } from "react";
import "../todolist/css/TodoListContent.css";
import { useHistory } from "react-router-dom";
import "../todolist/css/TodoListAllListView.css";
import PriorityDropdown from "../todolist/PriorityDropdown.js";
import TodoCreateModal from "../todolist/TodoCreateModal";

// axios 임포트 (백엔드 통신)
import axios from "axios";

/* Quill, DatePicker 필요한 라이브러리 */
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
import { TransitionGroup, CSSTransition } from "react-transition-group";

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

    // ---------------------- 백엔드에서 가져온 전체 Task 상태 ----------------------
    const [allTasks, setAllTasks] = useState([]);

    // (1) 페이지 로딩 시, 서버로부터 Task 목록 불러오기
    useEffect(() => {
        const token = localStorage.getItem("token"); // 토큰 사용시
        axios
            .get("/api/tasks/my-tasks", {
                headers: {
                    Authorization: `Bearer ${token}`, // 필요에 따라 수정
                    params: { userId: localStorage.getItem("userId") },
                },
            })
            axios.get("/api/tasks", {
                headers: { Authorization: `Bearer ${token}`}
            })
            .then((res) => {
                // 서버 응답 구조에 맞게 파싱
                const tasksData = Array.isArray(res.data) ? res.data : res.data.tasks;
                // 가져온 Task마다 sectionTitle/sectionColor 매핑 (UI에서 쓰고 있으므로)
                const mapped = tasksData.map((task) => mapSectionInfo(task));
                setAllTasks(mapped);
            })
            .catch((err) => {
                console.error("Task 목록 불러오기 실패:", err);
            });
    }, []);

    /**
     * (참고) 서버의 Task 필드에 따라 sectionTitle, sectionColor를 매핑하는 함수 예시
     * - status === "DONE" => "✅ 완료됨"
     * - 마감임박 => "⏳ 마감 임박"
     * - 나머지 => "🔥 남은 To Do"
     */
    const mapSectionInfo = (task) => {
        let sectionTitle = "🔥 남은 To Do";
        let sectionColor = "#3498db";
        let isRecentlyCreated = false; // ← 새 필드

        // 완료 여부
        if (task.status === "DONE") {
            sectionTitle = "✅ 완료됨";
            sectionColor = "#27ae60";
        } else {
            // 마감임박 판별 (예: 3일 이하 남았을 때)
            if (task.dueDate) {
                const now = new Date();
                const due = new Date(task.dueDate);
                const diff = due - now;
                const threeDays = 3 * 24 * 60 * 60 * 1000;
                if (diff <= threeDays && diff >= 0) {
                    sectionTitle = "⏳ 마감 임박";
                    sectionColor = "#e74c3c";
                }
            }
        }

        // (새로 추가) "최근 작성" 판별
        // createdAt 필드가 있고, 3일 이내면 true
        if (task.createdAt) {
            const now = new Date();
            const createdTime = new Date(task.createdAt);
            const diff = now - createdTime;
            const threeDays = 3 * 24 * 60 * 60 * 1000;
            if (diff <= threeDays && diff >= 0) {
                isRecentlyCreated = true;
            }
        }

        return {
            ...task,
            sectionTitle,
            sectionColor,
            isRecentlyCreated, // 추가
        };
    };

    // ---------------------- 수정 모드, Task 선택 ----------------------
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Task 카드 클릭 시 (수정모드가 아닐 때는 단순 상세보기, 수정모드면 수정 폼)
    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setSelectedTask(null);
        resetEditForm();
    };

    // 수정 버튼
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
    const [editContent, setEditContent] = useState("");
    const [editDueDate, setEditDueDate] = useState(null);
    const [editDaysLeft, setEditDaysLeft] = useState(null);
    const [editPriority, setEditPriority] = useState("보통");
    const [editAssignee, setEditAssignee] = useState("");
    const [editMemo, setEditMemo] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const fileInputRef = useRef(null);

    // ---------------------- 삭제 모드 ----------------------
    //  삭제 모드 상태
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    //  삭제 대상 Task 목록
    const [selectedDeleteTasks, setSelectedDeleteTasks] = useState([]);

    // "삭제" 버튼 클릭 → 삭제 모드 on/off
    const handleDeleteModeClick = () => {
        // 만약 수정 모드 중이라면, 우선 수정 모드 끄기
        if (isEditMode) {
            setIsEditMode(false);
            setSelectedTask(null);
            resetEditForm();
        }

        // 그 다음 삭제 모드 토글
        if (isDeleteMode) {
            // 이미 삭제 모드였다면 → 일반 모드로 돌아가기
            setIsDeleteMode(false);
            setSelectedDeleteTasks([]);
        } else {
            // 일반 모드였다면 → 삭제 모드 on
            setIsDeleteMode(true);
        }

    };


// "삭제하기" 버튼 클릭 → 실제 삭제 요청
    const handleDeleteConfirm = () => {
        // 1) 선택된 Task가 없는 경우
        if (selectedDeleteTasks.length === 0) {
            alert("1개 이상의 Task를 선택 해주세요!");
            return;
        }

        const token = localStorage.getItem("token");
        // 2) 여러 건 동시 삭제
        Promise.all(
            selectedDeleteTasks.map((task) =>
                axios.delete(`/api/tasks/${task.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            )
        )
            .then(() => {
                alert("선택된 작업이 삭제되었습니다!");
                // 3) 프론트엔드 상태에서도 제거
                setAllTasks((prev) =>
                    prev.filter((t) => !selectedDeleteTasks.some((sel) => sel.id === t.id))
                );
                // 4) 삭제 모드 종료 & 선택 목록 초기화
                setSelectedDeleteTasks([]);
                setIsDeleteMode(false);
            })
            .catch((err) => {
                console.error("삭제 실패:", err);
            });
    };

    // ---------------------- Quill 에디터 모달 ----------------------
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [tempHTML, setTempHTML] = useState(editContent);

    // (2) 특정 Task가 선택될 때마다, 수정 폼에 해당 Task 정보 로드
    useEffect(() => {
        if (selectedTask) {
            setEditTaskName(selectedTask.title || "");
            setEditContent(selectedTask.description || "");
            setEditDueDate(selectedTask.dueDate ? new Date(selectedTask.dueDate) : null);
            // D-Day 계산
            if (selectedTask.dueDate) {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const due = new Date(selectedTask.dueDate);
                due.setHours(0, 0, 0, 0);
                const diff = Math.floor((due - now) / (1000 * 60 * 60 * 24));
                setEditDaysLeft(diff);
            } else {
                setEditDaysLeft(null);
            }
            setEditPriority(selectedTask.priority || "보통");
            setEditAssignee(selectedTask.assignee || "");
            setEditMemo(selectedTask.memo || "");
            // 만약 서버에서 기존 첨부파일 목록을 주면, uploadedFiles에 넣어둘 수도 있음
            setUploadedFiles([]);
            setTempHTML(selectedTask.description || "");
        }
    }, [selectedTask]);

    // 폼 초기화
    const resetEditForm = () => {
        setEditTaskName("");
        setEditContent("");
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

    // ---------------------- 수정 폼 저장 (PUT) ----------------------
    const handleSaveEditForm = () => {
        if (!selectedTask) {
            alert("선택된 작업이 없습니다.");
            return;
        }
        const token = localStorage.getItem("token");
        axios
            .put(
                `/api/tasks/${selectedTask.id}`,
                {
                    title: editTaskName,
                    description: editContent,
                    dueDate: editDueDate,
                    priority: editPriority,
                    assignee: editAssignee,
                    memo: editMemo,
                    // status 등 필요한 필드가 있다면 추가
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((response) => {
                alert("수정 내용이 저장되었습니다!");
                const updated = response.data;

                // UI 갱신: allTasks에서 해당 Task만 교체
                setAllTasks((prev) =>
                    prev.map((t) => (t.id === updated.id ? mapSectionInfo(updated) : t))
                );
                handleCloseModal();
            })
            .catch((error) => {
                console.error("수정 실패:", error);
            });
    };

    // ---------------------- 생성하기 모달 ----------------------
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // 생성하기 버튼 클릭 => 모달 열기
    const handleCreateClick = () => {
        setIsCreateModalOpen(true);
    };

    //  새 Task 생성 후 리스트에 반영하기
    const handleTaskCreated = (newTask) => {
        // 서버에서 생성된 Task 응답받아온 후, UI 갱신
        setAllTasks((prev) => [...prev, mapSectionInfo(newTask)]);
    };

    // ---------------------- 필터 & 검색 ----------------------
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

    // 필터 및 검색 로직
    let displayTasks = [...allTasks];
    if (filterOption === "completed") {
        displayTasks = displayTasks.filter((task) => task.sectionTitle === "✅ 완료됨");
    } else if (filterOption === "dueSoon") {
        displayTasks = displayTasks.filter((task) => task.sectionTitle === "⏳ 마감 임박");
    } else if (filterOption === "remainingTodo") {
        displayTasks = displayTasks.filter((task) => task.sectionTitle === "🔥 남은 To Do");
    }

    if (searchQuery.trim() !== "") {
        const query = searchQuery.trim().toLowerCase();
        if (searchOption === "title") {
            displayTasks = displayTasks.filter((task) =>
                task.title.toLowerCase().includes(query)
            );
        } else if (searchOption === "description") {
            displayTasks = displayTasks.filter((task) =>
                task.description.toLowerCase().includes(query)
            );
        } else {
            displayTasks = displayTasks.filter(
                (task) =>
                    task.title.toLowerCase().includes(query) ||
                    task.description.toLowerCase().includes(query)
            );
        }
    }

    // ---------------------- Load More & 접기 ----------------------
    const initialVisibleCount = 10;
    const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
    const visibleTasks = displayTasks.slice(0, visibleCount);
    const handleToggleVisible = () => {
        if (visibleCount === displayTasks.length) {
            setVisibleCount(initialVisibleCount);
        } else {
            setVisibleCount(displayTasks.length);
        }
    };

    // ---------------------- fade in 애니메이션 ----------------------
    const [gridClass, setGridClass] = useState("");
    useEffect(() => {
        setGridClass("visible");
        const timer = setTimeout(() => {
            setGridClass("");
        }, 500);
        return () => clearTimeout(timer);
    }, [visibleCount]);

    // ---------------------- 버튼 이벤트 ----------------------
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
                        <button className="btn btn-delete" onClick={handleDeleteModeClick}>
                            {isDeleteMode ? "삭제 취소" : "삭제"}
                        </button>

                        {isDeleteMode && (
                            <button
                                className="btn btn-delete-confirm"
                                onClick={handleDeleteConfirm}
                                style={{marginLeft: "8px"}}
                            >
                                삭제하기
                            </button>
                        )}
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

                {isDeleteMode && (
                    <div className="edit-mode-banner">
                        <p>삭제할 작업을 선택하세요!</p>
                    </div>
                )}


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
                <div className={`all-tasks-grid ${gridClass} ${isEditMode ? "edit-mode" : ""}`}>
                    {visibleTasks.length > 0 ? (
                        <TransitionGroup component={null}>
                            {visibleTasks.map((task) => {
                                const isCompleted = task.sectionTitle === "✅ 완료됨";
                                const isSelectedForDelete = selectedDeleteTasks.some(
                                    (sel) => sel.id === task.id
                                );

                                return (
                                    <CSSTransition key={task.id} timeout={500} classNames="task">
                                        <div
                                            className={`
                all-list-task-card
                ${isCompleted ? "completed-task-card" : ""}
                ${isDeleteMode ? "task-delete-mode" : ""}
                ${isSelectedForDelete ? "task-delete-selected" : ""}
              `}
                                            onClick={() => {
                                                if (isDeleteMode) {
                                                    if (isSelectedForDelete) {
                                                        setSelectedDeleteTasks((prev) =>
                                                            prev.filter((sel) => sel.id !== task.id)
                                                        );
                                                    } else {
                                                        setSelectedDeleteTasks((prev) => [...prev, task]);
                                                    }
                                                } else if (isEditMode) {
                                                    setSelectedTask(task);
                                                } else {
                                                    handleTaskClick(task);
                                                }
                                            }}
                                        >
                                            {/* 기존 섹션 배지 */}
                                            <div
                                                className="task-section-badge"
                                                style={{ backgroundColor: task.sectionColor }}
                                            >
                                                {task.sectionTitle}
                                            </div>

                                            {/* (새로 추가) "최근 작성" 배지 */}
                                            {task.isRecentlyCreated && (
                                                <div
                                                    className="task-section-badge"
                                                    style={{ backgroundColor: "#ffa500", marginLeft: "5px" }}
                                                >
                                                    📍 최근 작성
                                                </div>
                                            )}

                                            <div className="all-list-task-title">{task.title}</div>
                                            <div
                                              className="all-list-task-desc"
                                              dangerouslySetInnerHTML={{
                                                __html: task.description.replace(/^<p>([\s\S]*)<\/p>$/, "$1")
                                              }}
                                            />

                                        </div>
                                    </CSSTransition>
                                );
                            })}
                        </TransitionGroup>
                    ) : (
                        /* visibleTasks가 0개이면 이 문구 렌더링 */
                        <div className="no-tasks-msg1">이 섹션에 작업이 없습니다.</div>
                    )}
                </div>

                {displayTasks.length > initialVisibleCount && (
                    <div style={{textAlign: "center", marginTop: "20px"}}>
                        <button onClick={handleToggleVisible} className="btn btn-edit-all">
                            {visibleCount === displayTasks.length ? "접기" : "더 보기"}
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

                        {/* 섹션 */}
                        <div className="detail-row">
                            <div className="detail-icon">
                                <i className="fas fa-folder-open"/>
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
                                    <span className="detail-value">
                                      {
                                          selectedTask.description
                                            .replace(/^<p>([\s\S]*)<\/p>$/, "$1")
                                            .replace(/<\/?p>/g, "")
                                        }
                                    </span>
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
                    {selectedTask.dueDate
                        ? new Date(selectedTask.dueDate).toLocaleDateString()
                        : "미설정"}
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
                                    <span className={`detail-value priority-${selectedTask.priority}`}>
                    {selectedTask.priority || "보통"}
                  </span>
                                </div>
                            </div>

                            {/* 담당자 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="fas fa-user" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">담당자</span>
                                    <span className="detail-value">{selectedTask.assignee || "미지정"}</span>
                                </div>
                            </div>

                            {/* 메모 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="far fa-sticky-note" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">메모</span>
                                    <span className="detail-value">{selectedTask.memo || "메모 없음"}</span>
                                </div>
                            </div>

                            {/* 첨부파일 (서버에서 내려주는 경우에 맞춰 로직 추가) */}
                            {/* 필요시 selectedTask.files 등으로 렌더링 */}
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
                                {/* 섹션 */}
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <i className="fas fa-folder-open" />
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">섹션</span>
                                        <span className="detail-value">{selectedTask.sectionTitle}</span>
                                    </div>
                                </div>

                                {/* 제목 */}
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <i className="fas fa-file-alt" />
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">제목</span>
                                        <span className="detail-value">{editTaskName}</span>
                                    </div>
                                </div>

                                {/* 설명 */}
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <i className="fas fa-info-circle" />
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">설명</span>
                                        <span
                                            className="detail-value"
                                            dangerouslySetInnerHTML={{ __html: editContent }}
                                        />
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
                                        <span className={`detail-value priority-${editPriority}`}>
                      {editPriority}
                    </span>
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

                                {/* 첨부파일 (수정 모달) */}
                                {uploadedFiles.length > 0 && (
                                    <div className="detail-row">
                                        <div className="detail-icon">
                                            <i className="fas fa-paperclip" />
                                        </div>
                                        <div className="detail-text">
                                            <span className="detail-label">등록된 파일 목록</span>
                                            <div className="file-thumbnails-preview">
                                                {uploadedFiles.map((file, idx) => {
                                                    const isImage = file.type.startsWith("image/");
                                                    const extension = file.name.split(".").pop().toLowerCase();
                                                    // 확장자별 아이콘
                                                    const fileIconMap = {
                                                        pdf: "fa-file-pdf",
                                                        doc: "fa-file-word",
                                                        docx: "fa-file-word",
                                                        xls: "fa-file-excel",
                                                        xlsx: "fa-file-excel",
                                                        ppt: "fa-file-powerpoint",
                                                        pptx: "fa-file-powerpoint",
                                                        zip: "fa-file-archive",
                                                        rar: "fa-file-archive",
                                                        default: "fa-file",
                                                    };
                                                    const iconClass = fileIconMap[extension] || fileIconMap.default;
                                                    const fileUrl = isImage ? URL.createObjectURL(file) : null;

                                                    return (
                                                        <div className="file-thumbnail" key={idx}>
                                                            <button
                                                                className="file-remove-btn"
                                                                onClick={() => handleRemoveFile(idx)}
                                                            >
                                                                X
                                                            </button>
                                                            {isImage ? (
                                                                <img
                                                                    src={fileUrl}
                                                                    alt={file.name}
                                                                    className="file-thumbnail-image"
                                                                />
                                                            ) : (
                                                                <div className="file-icon">
                                                                    <i className={`fas ${iconClass}`} />
                                                                </div>
                                                            )}
                                                            <div className="file-thumbnail-info">
                                <span className="file-thumbnail-name" title={file.name}>
                                  {file.name}
                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
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

                            {/* 파일 첨부 영역 */}
                            <div className="form-field">
                                <label>파일 첨부</label>
                                <div
                                    className="file-drop-area"
                                    onClick={() => fileInputRef.current.click()}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <p className="file-instruction">
                                        이 영역을 드래그하거나 <span>클릭</span>하여 업로드
                                    </p>
                                    <input
                                        type="file"
                                        multiple
                                        className="file-input"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
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

            {/* Quill 에디터 모달*/}
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
                               onChange={(html) => {
                                 // 외곽에만 감싸진 <p>…</p> 태그만 제거
                                     const stripped = html.replace(/^<p>(.*)<\/p>$/g, "$1");
                                 setTempHTML(stripped);
                               }}
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

            {/* 생성 모달 */}
            {isCreateModalOpen && (
                <TodoCreateModal
                    onClose={() => setIsCreateModalOpen(false)}
                    // 예: 새로 생성된 Task를 받아서 allTasks에 추가
                    onTaskCreated={handleTaskCreated}
                />
            )}
        </>
    );
}

export default TodoListAllListView;
