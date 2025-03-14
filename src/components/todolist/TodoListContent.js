import React, { useState, useEffect, useRef } from "react";
import "../todolist/css/TodoListContent.css";
import { useHistory } from "react-router-dom";
import { Task } from "./Task";
import TodoCreateModal from "./TodoCreateModal";
import "../todolist/css/TodoCreateModal.css";
import axios from "axios";

// 우선순위 드롭다운 & Quill, DatePicker 등
import PriorityDropdown from "../todolist/PriorityDropdown.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
registerLocale("ko", ko);

// Quill 설정 (툴바 등) - 디자인은 그대로 유지
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

// ─────────────────────────────────────────────────────────
//   섹션 동적 분류 함수
// ─────────────────────────────────────────────────────────

const TodoListContent = () => {
    const history = useHistory();

    // ========== 생성 모달 ==========
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const handleOpenCreateModal = () => setIsCreateModalOpen(true);
    const handleCloseCreateModal = () => setIsCreateModalOpen(false);

    // ==========  수정 모드 & 수정 모달 ==========
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null); // 수정할 Task 선택 시 저장

    // 수정 폼 상태
    const [editTaskName, setEditTaskName] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editDueDate, setEditDueDate] = useState(null);
    const [editDaysLeft, setEditDaysLeft] = useState(null);
    const [editPriority, setEditPriority] = useState("보통");
    const [editAssignee, setEditAssignee] = useState("");
    const [editMemo, setEditMemo] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Quill 에디터 모달
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [tempHTML, setTempHTML] = useState(editContent);

    // ─────────────────────────────────────────────────────────
    //  백엔드에서 가져온 Task 전체 목록
    // ─────────────────────────────────────────────────────────
    const [allTasks, setAllTasks] = useState([]);

    // "더보기" 상태 (각 섹션별 확장 여부)
    const [expandedSections, setExpandedSections] = useState({});
    const moreTasksRefs = useRef({});

    // 특정 섹션 선택/Task 상세 표시
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedSectionTasks, setSelectedSectionTasks] = useState([]);
    const [transitionClass, setTransitionClass] = useState("");
    const [detailTransitionClass, setDetailTransitionClass] = useState("");

    // ─────────────────────────────────────────────────────────
    //  4개 섹션(📍, ⏳, 🔥, ✅)으로 분류하기 위한 함수
    // ─────────────────────────────────────────────────────────
    const getSections = () => {
        const now = new Date();
        // 마감임박을 3일로 설정 (예: 3일 이하이면 마감 임박)
        const threeDays = 3 * 24 * 60 * 60 * 1000;

        // 1) "✅ 완료됨": status === "DONE"
        const doneTasks = allTasks.filter((t) => t.status === "DONE");

        // 2) "⏳ 마감 임박":
        //    - status !== "DONE"
        //    - dueDate가 존재
        //    - 남은 시간이 threeDays 이하
        const dueSoonTasks = allTasks.filter(
            (t) =>
                t.status !== "DONE" &&
                t.dueDate &&
                new Date(t.dueDate) - now <= threeDays
        );

        // 3) "📍 최근 작성":
        //    - 일단 완료된(DONE) 작업은 제외
        //    - 마감 임박(dueSoon)에 포함된 작업도 제외 (중복 방지)
        //    - ID 내림차순 정렬 후 상위 5개
        const usedInAbove = new Set([...doneTasks, ...dueSoonTasks]);
        const recentCandidates = allTasks.filter(
            (t) => !usedInAbove.has(t) && t.status !== "DONE"
        );

        const recentTasks = recentCandidates
            .sort((a, b) => b.id - a.id)
            .slice(0, 5);

        // 4) "🔥 남은 To Do":
        //    - 이미 위 섹션(완료됨, 마감임박, 최근작성)에 포함되지 않은 나머지
        const usedInAbove2 = new Set([...doneTasks, ...dueSoonTasks, ...recentTasks]);
        const todoTasks = allTasks.filter((t) => !usedInAbove2.has(t));

        return [
            { title: "📍 최근 작성", color: "#ffa500", tasks: recentTasks },
            { title: "⏳ 마감 임박", color: "#e74c3c", tasks: dueSoonTasks },
            { title: "🔥 남은 To Do", color: "#3498db", tasks: todoTasks },
            { title: "✅ 완료됨", color: "#27ae60", tasks: doneTasks },
        ];
    };

    // ─────────────────────────────────────────────────────────
    //  백엔드에서 Task 목록을 가져옴
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("/api/tasks", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const tasksData = Array.isArray(response.data)
                    ? response.data
                    : response.data.tasks;
                setAllTasks(tasksData || []);
            })
            .catch((error) => {
                console.error("Task 목록 불러오기 실패:", error);
            });
    }, []);

    // ─────────────────────────────────────────────────────────
    //  Task 클릭 (수정 모드/일반 모드)
    // ─────────────────────────────────────────────────────────
    const handleSelectSection = (section, task) => {
        // 섹션 인덱스 찾기
        const currentSections = getSections();
        const idx = currentSections.findIndex((s) => s.title === section.title);

        if (isEditMode) {
            // 수정 모드 → 수정 모달 열기
            openEditModalWithTask({
                ...task,
                sectionColor: section.color,
                sectionTitle: section.title,
            });
        } else {
            // 일반 모드 → 우측 상세 표시
            setSelectedSectionIndex(idx);
            setSelectedSection(section);
            setSelectedSectionTasks([task]);
        }
    };

    // ─────────────────────────────────────────────────────────
    //  "수정" 버튼
    // ─────────────────────────────────────────────────────────
    const handleEditClick = () => {
        setIsEditMode((prev) => !prev);
        if (isEditMode) {
            setSelectedTask(null);
            resetEditForm();
        }
    };

    // ─────────────────────────────────────────────────────────
    //  수정 모달 열기
    // ─────────────────────────────────────────────────────────
    const openEditModalWithTask = (task) => {
        setEditTaskName(task.title || "");
        setEditContent(task.description || "");
        if (task.dueDate) {
            const due = new Date(task.dueDate);
            setEditDueDate(due);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const diff = Math.floor((due - now) / (1000 * 60 * 60 * 24));
            setEditDaysLeft(diff);
        } else {
            setEditDueDate(null);
            setEditDaysLeft(null);
        }
        setEditPriority(task.priority || "보통");
        setEditAssignee(task.assignee || "");
        setEditMemo(task.memo || "");
        setUploadedFiles([]);
        setSelectedTask(task);
    };

    // ─────────────────────────────────────────────────────────
    //  수정 모달 닫기
    // ─────────────────────────────────────────────────────────
    const handleCloseEditModal = () => {
        setSelectedTask(null);
        resetEditForm();
    };

    // ─────────────────────────────────────────────────────────
    //  수정 폼 저장 (백엔드로 전송 - PUT)
    // ─────────────────────────────────────────────────────────
    const handleSaveEditForm = () => {
        console.log("=== 수정 폼 저장 ===");
        console.log("작업 이름:", editTaskName);
        console.log("작업 내용(HTML):", editContent);
        console.log("마감일:", editDueDate);
        console.log("우선순위:", editPriority);
        console.log("담당자:", editAssignee);
        console.log("메모:", editMemo);
        console.log("업로드된 파일:", uploadedFiles);

        if (!selectedTask) {
            alert("선택된 Task가 없습니다.");
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
                    // 파일 첨부 로직은 추후 구현
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((response) => {
                alert(`"${editTaskName}" 작업이 수정되었습니다!`);
                // 수정된 Task를 allTasks 상태에 반영
                const updated = response.data;
                setAllTasks((prev) =>
                    prev.map((t) => (t.id === updated.id ? updated : t))
                );
                handleCloseEditModal();
            })
            .catch((error) => {
                console.error("Task 수정 실패:", error);
            });
    };

    // ─────────────────────────────────────────────────────────
    //  수정 폼 초기화
    // ─────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────
    //  파일 첨부 (수정 모달)
    // ─────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────
    //  마감일 계산 (수정 모달)
    // ─────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────
    //  Quill 에디터 (수정 모달 내)
    // ─────────────────────────────────────────────────────────
    const openEditor = () => {
        setTempHTML(editContent);
        setIsEditorOpen(true);
    };
    const saveEditorContent = () => {
        setEditContent(tempHTML);
        setIsEditorOpen(false);
    };

    // ─────────────────────────────────────────────────────────
    //  생성 모달에서 새 Task 생성 시
    // ─────────────────────────────────────────────────────────
    const handleTaskCreated = (newTask) => {
        // 백엔드에서 생성된 Task를 allTasks에 추가
        setAllTasks((prev) => [...prev, newTask]);
    };

    // ─────────────────────────────────────────────────────────
    //  뒤로 가기(섹션)
    // ─────────────────────────────────────────────────────────
    const handleBackToAll = () => {
        setSelectedSectionIndex(null);
        setSelectedSection(null);
        setSelectedSectionTasks([]);
        setTransitionClass("");
    };

    // "전체 목록" 버튼
    const handleAllListViewClick = () => {
        history.push("/todo/list-all");
    };

    // "더보기" 버튼
    const handleToggleTasks = (index) => {
        setExpandedSections((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // 섹션 간 애니메이션
    const animateSectionChange = (newIndex, direction) => {
        setTransitionClass(direction === "next" ? "slide-out-left" : "slide-out-right");
        setDetailTransitionClass(direction === "next" ? "slide-out-left-detail" : "slide-out-right-detail");

        setTimeout(() => {
            const updatedSections = getSections();
            setSelectedSectionIndex(newIndex);
            setSelectedSection(updatedSections[newIndex]);

              const newTasks = updatedSections[newIndex].tasks;
               if (newTasks && newTasks.length > 0) {
                     setSelectedSectionTasks([newTasks[0]]);
                   } else {
                     setSelectedSectionTasks([]); // 섹션에 Task가 없으면 빈 배열
                   }

            setTransitionClass(direction === "next" ? "slide-in-right" : "slide-in-left");
            setDetailTransitionClass(direction === "next" ? "slide-in-right-detail" : "slide-in-left-detail");

            setTimeout(() => {
                setTransitionClass("");
                setDetailTransitionClass("");
            }, 300);
        }, 300);
    };

    const handlePrevSection = () => {
        if (selectedSectionIndex === null) return;
        const updatedSections = getSections();
        const newIndex = (selectedSectionIndex - 1 + updatedSections.length) % updatedSections.length;
        animateSectionChange(newIndex, "prev");
    };

    const handleNextSection = () => {
        if (selectedSectionIndex === null) return;
        const updatedSections = getSections();
        const newIndex = (selectedSectionIndex + 1) % updatedSections.length;
        animateSectionChange(newIndex, "next");
    };


    // ─────────────────────────────────────────────────────────
    //  "완료" 버튼 클릭 → status="DONE"으로 변경
    // ─────────────────────────────────────────────────────────
    const handleMarkDone = () => {
        // 선택된 섹션의 첫 번째 Task (상세 보기 중인 Task)
        if (!selectedSectionTasks || selectedSectionTasks.length === 0) {
            alert("완료할 작업이 없습니다.");
            return;
        }
        const targetTask = selectedSectionTasks[0];

        const token = localStorage.getItem("token");
        axios
            .put(
                `/api/tasks/${targetTask.id}`,
                {
                    ...targetTask,
                    status: "DONE", // 상태를 DONE으로 변경
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((res) => {
                const updated = res.data;
                // 전체 목록에서도 해당 Task를 갱신
                setAllTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                alert(`"${updated.title}" 작업이 완료되었습니다!`);
                // 우측 상세 보기에서도 갱신
                setSelectedSectionTasks([updated]);
            })
            .catch((err) => {
                console.error("완료 설정 실패:", err);
            });
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
                    <button className="btn btn-create" onClick={handleOpenCreateModal}>
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
                    <div className="tab-item" onClick={handleAllListViewClick}>
                        전체 목록
                    </div>
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
                    {getSections().map((section, index) => {
                        // 선택된 섹션이 있으면, title이 다른 섹션은 숨김
                        if (selectedSection && section.title !== selectedSection.title) {
                            return null;
                        }

                        // "더보기" 기능
                        const visibleTasks = expandedSections[index]
                            ? section.tasks
                            : section.tasks.slice(0, 6);

                        return (
                            <div className="task-section" key={index}>
                                <div
                                    className="section-header"
                                    style={{borderBottom: `5px solid ${section.color}`}}>
                                    <div className="section-header-content"><span
                                        className="section-title">{section.title} {section.tasks.length}</span>

                                        {/* 인디케이터 - 현재 섹션 위치 표시 */}
                                        {selectedSection && selectedSection.title === section.title && (
                                            <div className="indicator-container">
                                                {getSections().map((_, i) => (
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
                                        <span className="add-task" onClick={handleOpenCreateModal}>+ 작업 추가 생성</span>
                                    </div>
                                </div>

                                <div
                                    className={`task-list ${expandedSections[index] ? "expanded" : ""}`}
                                    ref={(el) => (moreTasksRefs.current[index] = el)}
                                >
                                     {visibleTasks.length > 0 ? (
                                      visibleTasks.map((task) => (
                                        <Task
                                            key={task.id}
                                            title={task.title}
                                            description={task.description}
                                            onClick={() => handleSelectSection(section, task)}
                                          />
                                        ))
                                      ) : (
                                        <p className="no-tasks-msg">이 섹션에 작업이 없습니다.</p>
                                      )}
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

                {/* 오른쪽 상세 영역 */}
                {selectedSection && selectedSectionTasks.length > 0 && (
                    <div className={`selected-task-details ${detailTransitionClass}`}>
                        {/* 버튼 간격 넉넉히: gap: 20px, marginBottom: 20px */}
                        <div style={{display: "flex", gap: "20px", marginBottom: "20px"}}>
                            <button className="btn-back-top-right" onClick={handleBackToAll}>
                                ← 뒤로 가기
                            </button>
                            <button
                                className="btn-back-top-right"
                                style={{ backgroundColor: "#f2f9f2", color: "#2a2e34" }}
                                onClick={handleMarkDone}
                            >
                                완료
                            </button>
                        </div>

                        <div
                            className="section-header"
                            style={{
                                borderBottom: `5px solid ${selectedSection.color}`,
                                width: "100%",
                                marginBottom: "20px",
                            }}
                        >
                            <div className="section-header-content">
                                <span className="section-title">{selectedSection.title} - Task 상세</span>
                            </div>
                        </div>

                        <ul>
                            {selectedSectionTasks.map((task) => (
                                <li key={task.id}>
                                    <strong>제목:</strong> {task.title} <br />

                                    {/* 설명은 Quill HTML일 수 있으므로 dangerouslySetInnerHTML로 렌더링 */}
                                    <strong>설명:</strong>{" "}
                                    <div
                                        style={{ margin: "4px 0" }}
                                        dangerouslySetInnerHTML={{ __html: task.description }}
                                    />

                                    {/* 우선순위 */}
                                    <strong>우선순위:</strong> {task.priority || "없음"} <br />

                                    {/* 마감일 */}
                                    <strong>마감일:</strong>{" "}
                                    {task.dueDate
                                        ? new Date(task.dueDate).toLocaleDateString()
                                        : "미설정"}
                                    <br />

                                    {/* 담당자 */}
                                    <strong>담당자:</strong> {task.assignee || "미지정"} <br />

                                    {/* 메모 */}
                                    <strong>메모:</strong> {task.memo || "없음"} <br />
                                    <br />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 이전/다음 섹션 화살표 */}
                {selectedSection && (
                    <>
                        <button className="arrow-nav-left" onClick={handlePrevSection}>
                            ◀
                        </button>
                        <button className="arrow-nav-right" onClick={handleNextSection}>
                            ▶
                        </button>
                    </>
                )}
            </div>

            {/* 생성하기 모달 - 열려 있을 때만 표시 */}
            {isCreateModalOpen && (
                <TodoCreateModal onClose={handleCloseCreateModal} onTaskCreated={handleTaskCreated} />
            )}

            {/* 수정 모달 (좌: 미리보기 / 우: 폼) */}
            {selectedTask && isEditMode && (
                <div className="modal-overlay" onClick={handleCloseEditModal}>
                    <div className="modal-edit-content" onClick={(e) => e.stopPropagation()}>
                        {/* 좌측: 상세 정보 (실시간 미리보기) */}
                        <div className="edit-left-panel">
                            <div
                                className="section-header1"
                                style={{
                                    borderBottom: `5px solid ${selectedTask.sectionColor || "#000"}`,
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
                                    <strong>작업 이름:</strong> {editTaskName}
                                </p>
                                <p>
                                    <strong>작업 내용:</strong>
                                </p>
                                <div
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: 8,
                                        minHeight: 80,
                                        background: "#fff",
                                    }}
                                    dangerouslySetInnerHTML={{ __html: editContent }}
                                />
                                <p>
                                    <strong>마감일:</strong>{" "}
                                    {editDueDate ? editDueDate.toLocaleDateString() : "미설정"}
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
                                <p>
                                    <strong>첨부파일:</strong>{" "}
                                    {uploadedFiles.map((f) => f.name).join(", ")}
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
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                zIndex: 9999,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
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
                                    position: "relative",
                                }}
                            >
                                <div className="editor-header" style={{ marginBottom: 10 }}>
                                    <h2>사용자 커스텀 편집</h2>
                                    <button
                                        onClick={() => setIsEditorOpen(false)}
                                        style={{ float: "right", fontSize: 20 }}
                                    >
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
                                    <button onClick={saveEditorContent}>확인</button>
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
