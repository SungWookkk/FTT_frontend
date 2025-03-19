import React, { useState, useEffect, useRef } from "react";
import "../todolist/css/TodoListContent.css";
import { useHistory, useLocation } from "react-router-dom";
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

const TodoListContent = () => {
    const history = useHistory();
    const location = useLocation();

    // ─────────────────────────────────────────────────────────
    // 생성 모달 열림/닫힘
    // ─────────────────────────────────────────────────────────
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const handleOpenCreateModal = () => setIsCreateModalOpen(true);
    const handleCloseCreateModal = () => setIsCreateModalOpen(false);

    // ─────────────────────────────────────────────────────────
    // 수정 모드 & 수정 모달
    // ─────────────────────────────────────────────────────────
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null); // 수정할 Task 선택
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
    // 삭제 모드 상태
    // ─────────────────────────────────────────────────────────
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedDeleteTasks, setSelectedDeleteTasks] = useState([]);

    // ─────────────────────────────────────────────────────────
    // 백엔드에서 가져온 Task 전체 목록
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
    // 섹션 분류 함수 (📍, ⏳, 🔥, ✅)
    // ─────────────────────────────────────────────────────────
    // 기존 getSections 함수 대신
    const getSections = () => {
        const now = new Date();
        const threeDays = 3 * 24 * 60 * 60 * 1000; // 3일 기준

        // "완료됨" 섹션: status === "DONE"
        const doneTasks = allTasks.filter((t) => t.status === "DONE");

        //  "마감 임박" 섹션: status !== "DONE" + dueDate가 3일 이하 남음
        const dueSoonTasks = allTasks.filter((t) => {
            if (t.status === "DONE") return false;
            if (!t.dueDate) return false;
            return new Date(t.dueDate) - now <= threeDays;
        });

        // "최근 작성" 섹션: status !== "DONE" + createdAt으로부터 3일 이내
        const recentTasks = allTasks.filter((t) => {
            if (t.status === "DONE") return false;
            if (!t.createdAt) return false;
            const createdTime = new Date(t.createdAt);
            return now - createdTime <= threeDays; // 3일 이내
        });

        // "남은 To Do" 섹션: status !== "DONE"
        const todoTasks = allTasks.filter((t) => t.status !== "DONE");

        return [
            { title: "📍 최근 작성", color: "#ffa500", tasks: recentTasks },
            { title: "⏳ 마감 임박", color: "#e74c3c", tasks: dueSoonTasks },
            { title: "🔥 남은 To Do", color: "#3498db", tasks: todoTasks },
            { title: "✅ 완료됨", color: "#27ae60", tasks: doneTasks },
        ];
    };

    // ─────────────────────────────────────────────────────────
    // 백엔드에서 Task 목록 가져오기
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        axios
            .get("/api/tasks/my-tasks", {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId },
            })
            .then((response) => {
                const tasksData = Array.isArray(response.data)
                    ? response.data
                    : response.data.tasks;

                // 병합 로직
                setAllTasks((prevAllTasks) => {
                    return tasksData.map((serverTask) => {
                        const localTask = prevAllTasks.find((t) => t.id === serverTask.id);
                        if (!localTask) return serverTask;
                        return {
                            ...localTask,
                            ...serverTask,
                            files:
                                serverTask.files && serverTask.files.length > 0
                                    ? serverTask.files
                                    : localTask.files || [],
                        };
                    });
                });
            })
            .catch((error) => {
                console.error("Task 목록 불러오기 실패:", error);
            });
    }, [location.pathname]);

    useEffect(() => {
        // selectedSectionTasks가 비어있지 않다면 갱신
        if (selectedSectionTasks.length > 0) {
            const currentTaskId = selectedSectionTasks[0].id;
            const updatedTask = allTasks.find((t) => t.id === currentTaskId);
            if (updatedTask && updatedTask !== selectedSectionTasks[0]) {
                setSelectedSectionTasks([updatedTask]);
            }
        }
    }, [allTasks, selectedSectionTasks]);

    // ─────────────────────────────────────────────────────────
    // Task 클릭 시 (수정모드/일반모드)
    // ─────────────────────────────────────────────────────────
    const handleSelectSection = (section, task) => {
        const currentSections = getSections();
        const idx = currentSections.findIndex((s) => s.title === section.title);
        if (isDeleteMode) {
            // 삭제 모드에서는, 클릭 시 "선택/해제"를 토글
            const alreadySelected = selectedDeleteTasks.some((t) => t.id === task.id);
            if (alreadySelected) {
                // 이미 선택된 Task라면 해제
                setSelectedDeleteTasks((prev) => prev.filter((t) => t.id !== task.id));
            } else {
                // 선택되지 않았다면 추가
                setSelectedDeleteTasks((prev) => [...prev, task]);
            }
        }
        else if (isEditMode) {
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
    // "수정" 버튼
    // ─────────────────────────────────────────────────────────
    const handleEditClick = () => {
        // 만약 이미 '삭제 모드'였다면, 먼저 삭제 모드를 꺼준다
        if (isDeleteMode) {
            setIsDeleteMode(false);
            setSelectedDeleteTasks([]);
        }

        // 그 다음 수정 모드 on/off
        setIsEditMode((prev) => !prev);

        // 수정 모드가 꺼질 때는 선택된 Task나 폼 상태도 리셋
        if (isEditMode) {
            setSelectedTask(null);
            resetEditForm();
        }
    };


    // ─────────────────────────────────────────────────────────
    // 수정 모달 열기
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
        setUploadedFiles([]); // 새로 업로드할 파일 목록
        setSelectedTask(task);
    };

    // ─────────────────────────────────────────────────────────
    // 수정 모달 닫기
    // ─────────────────────────────────────────────────────────
    const handleCloseEditModal = () => {
        setSelectedTask(null);
        resetEditForm();
    };

    // ─────────────────────────────────────────────────────────
    // 수정 폼 저장 (PUT)
    // ─────────────────────────────────────────────────────────
    const handleSaveEditForm = () => {
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
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((response) => {
                alert(`"${editTaskName}" 작업이 수정되었습니다!`);
                const updated = response.data;
                setAllTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                handleCloseEditModal();
            })
            .catch((error) => {
                console.error("Task 수정 실패:", error);
            });
    };

    // ─────────────────────────────────────────────────────────
    // 수정 폼 초기화
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
    // 파일 첨부 (수정 모달)
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
    // 마감일 계산 (수정 모달)
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
    // Quill 에디터 (수정 모달 내)
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
    // 생성 모달에서 새 Task 생성 시
    // ─────────────────────────────────────────────────────────
    const handleTaskCreated = (newTask) => {
        setAllTasks((prev) => [...prev, newTask]);
    };

    // ─────────────────────────────────────────────────────────
    // 뒤로 가기(섹션)
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

    // 섹션 애니메이션
    const animateSectionChange = (newIndex, direction) => {
        setTransitionClass(direction === "next" ? "slide-out-left" : "slide-out-right");
        setDetailTransitionClass(
            direction === "next" ? "slide-out-left-detail" : "slide-out-right-detail"
        );

        setTimeout(() => {
            const updatedSections = getSections();
            setSelectedSectionIndex(newIndex);
            setSelectedSection(updatedSections[newIndex]);

            const newTasks = updatedSections[newIndex].tasks;
            if (newTasks && newTasks.length > 0) {
                setSelectedSectionTasks([newTasks[0]]);
            } else {
                setSelectedSectionTasks([]);
            }

            setTransitionClass(direction === "next" ? "slide-in-right" : "slide-in-left");
            setDetailTransitionClass(
                direction === "next" ? "slide-in-right-detail" : "slide-in-left-detail"
            );

            setTimeout(() => {
                setTransitionClass("");
                setDetailTransitionClass("");
            }, 300);
        }, 300);
    };

    const handlePrevSection = () => {
        if (selectedSectionIndex === null) return;
        const updatedSections = getSections();
        const newIndex =
            (selectedSectionIndex - 1 + updatedSections.length) % updatedSections.length;
        animateSectionChange(newIndex, "prev");
    };
    const handleNextSection = () => {
        if (selectedSectionIndex === null) return;
        const updatedSections = getSections();
        const newIndex = (selectedSectionIndex + 1) % updatedSections.length;
        animateSectionChange(newIndex, "next");
    };

    // ─────────────────────────────────────────────────────────
    // "완료" 버튼 클릭 → status="DONE"
    // ─────────────────────────────────────────────────────────
    const handleMarkDone = () => {
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
                    status: "DONE",
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((res) => {
                const updated = res.data;
                setAllTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                alert(`"${updated.title}" 작업이 완료되었습니다!`);
                setSelectedSectionTasks([updated]);
            })
            .catch((err) => {
                console.error("완료 설정 실패:", err);
            });
    };

    // ─────────────────────────────────────────────────────────
    // 파일 삭제 (이미 서버에 있는 파일)
    // ─────────────────────────────────────────────────────────
    const handleFileRemove = (taskId, fileId) => {
        const token = localStorage.getItem("token");
        axios
            .delete(`/api/tasks/${taskId}/files/${fileId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                // 서버 삭제 성공 시, allTasks에서 해당 파일만 제거
                setAllTasks((prevTasks) =>
                    prevTasks.map((t) => {
                        if (t.id === taskId) {
                            return {
                                ...t,
                                files: t.files.filter((file) => file.id !== fileId),
                            };
                        }
                        return t;
                    })
                );
            })
            .catch((err) => {
                console.error("파일 삭제 실패:", err);
            });
    };

    // ─────────────────────────────────────────────────────────
    // 삭제 모드 로직
    // ─────────────────────────────────────────────────────────
    // 삭제 버튼 클릭 시 호출될 핸들러
    const handleDeleteModeClick = () => {
        // 만약 이미 '수정 모드'였다면, 먼저 수정 모드를 꺼준다
        if (isEditMode) {
            setIsEditMode(false);
            setSelectedTask(null);
            resetEditForm();
        }

        // 그 다음 삭제 모드 on/off
        if (isDeleteMode) {
            // 이미 삭제 모드라면 → 취소 (일반 모드)
            setIsDeleteMode(false);
            setSelectedDeleteTasks([]);
        } else {
            // 일반 모드라면 → 삭제 모드
            setIsDeleteMode(true);
        }
    };
    const handleDeleteConfirm = () => {
        // 선택된 Task가 없는 경우
        if (selectedDeleteTasks.length === 0) {
            alert("1개 이상의 Task를 선택 해주세요!");
            return;
        }

        // 선택된 Task가 있으면, 서버에 DELETE 요청
        const token = localStorage.getItem("token");

        // Promise.all: 여러 건 동시 삭제
        Promise.all(
            selectedDeleteTasks.map((task) =>
                axios.delete(`/api/tasks/${task.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            )
        )
            .then(() => {
                alert("선택된 작업이 삭제되었습니다!");

                //  프론트엔드 상태에서도 삭제
                setAllTasks((prev) =>
                    prev.filter(
                        (t) => !selectedDeleteTasks.some((sel) => sel.id === t.id)
                    )
                );

                //  삭제 모드 종료 + 선택 목록 초기화
                setSelectedDeleteTasks([]);
                setIsDeleteMode(false);
            })
            .catch((error) => {
                console.error("삭제 실패:", error);
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
                    <button className="btn btn-create" onClick={handleOpenCreateModal}>
                        생성하기
                    </button>
                    <button className="btn btn-edit" onClick={handleEditClick}>
                        {isEditMode ? "수정 취소" : "수정"}
                    </button>

                    {/* 삭제/삭제 취소 토글 버튼 */}
                    <button className="btn btn-delete" onClick={handleDeleteModeClick}>
                        {isDeleteMode ? "삭제 취소" : "삭제"}
                    </button>

                    {/*  삭제 모드일 때만 '삭제하기' 버튼 노출 */}
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
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                    <div className="list-tab-container">
                        <div className="tab-item active">내 목록</div>
                        <div className="tab-item" onClick={handleAllListViewClick}>
                            전체 목록
                        </div>
                        <div className="tab-item">팀</div>
                    </div>

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
            {/*삭제모드 배너*/}
            {isDeleteMode && (
                <div className="edit-mode-banner">
                    <p>삭제할 작업을 선택하세요!</p>
                </div>
            )}

            {/* 작업 리스트 & 상세 정보 표시 */}
            <div className={`task-view-container ${transitionClass} ${isEditMode ? "edit-mode" : ""}`}>
                {/* 왼쪽 목록 */}
                <div className={`task-sections ${transitionClass} ${isEditMode ? "edit-mode" : ""}`}>
                    {getSections().map((section, index) => {
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
                                    style={{borderBottom: `5px solid ${section.color}`}}
                                >
                                    <div className="section-header-content">
                    <span className="section-title">
                      {section.title} {section.tasks.length}
                    </span>
                                        {selectedSection && selectedSection.title === section.title && (
                                            <div className="indicator-container">
                                                {getSections().map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={
                                                            "indicator-dot " + (selectedSectionIndex === i ? "active" : "")
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        <span className="add-task" onClick={handleOpenCreateModal}>
                      + 작업 추가 생성
                    </span>
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
                                                //  삭제 모드 여부 + 현재 Task가 삭제 선택 목록에 들어있는지 여부
                                                isDeleteMode={isDeleteMode}
                                                isSelectedForDelete={selectedDeleteTasks.some((t) => t.id === task.id)}
                                            />
                                        ))
                                    ) : (
                                        <p className="no-tasks-msg">이 섹션에 작업이 없습니다.</p>
                                    )}
                                </div>

                                {section.tasks.length > 6 && (
                                    <div className="more-tasks-btn" onClick={() => handleToggleTasks(index)}>
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
                        <div style={{display: "flex", gap: "20px", marginBottom: "20px"}}>
                            <div className="top-right-buttons">
                                <button className="btn-back" onClick={handleBackToAll}>← 뒤로 가기</button>
                                <button className="btn-done" onClick={handleMarkDone}>완료</button>
                            </div>
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
                <span className="section-title">
                  {selectedSection.title} - Task 상세
                </span>
                            </div>
                        </div>

                        <ul>
                            {selectedSectionTasks.map((task) => (
                                <li key={task.id}>
                                    <strong>제목:</strong> {task.title} <br/>
                                    <strong>설명:</strong>{" "}
                                    <div
                                        style={{margin: "4px 0"}}
                                        dangerouslySetInnerHTML={{__html: task.description}}
                                    />
                                    <strong>우선순위:</strong> {task.priority || "없음"} <br/>
                                    <strong>마감일:</strong>{" "}
                                    {task.dueDate
                                        ? new Date(task.dueDate).toLocaleDateString()
                                        : "미설정"}
                                    <br/>
                                    <strong>담당자:</strong> {task.assignee || "미지정"} <br/>
                                    <strong>메모:</strong> {task.memo || "없음"} <br/>
                                    <strong>첨부파일:</strong>{" "}
                                    {task.files && task.files.length > 0 ? (
                                        <ul>
                                            {task.files.map((file) => (
                                                <li key={file.id}>
                                                    {file.originalFilename}
                                                    <a href={`/api/tasks/${task.id}/files/${file.id}`}>
                                                        다운로드
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>없음</span>
                                    )}
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

            {/* 생성하기 모달 */}
            {isCreateModalOpen && (
                <TodoCreateModal onClose={handleCloseCreateModal} onTaskCreated={handleTaskCreated}/>
            )}

            {/* ─────────────────────────────────────────────────────────
          수정 모달 (좌: 미리보기 / 우: 폼)
      ───────────────────────────────────────────────────────── */}
            {selectedTask && isEditMode && (
                <div className="modal-overlay" onClick={handleCloseEditModal}>
                    <div className="modal-edit-content" onClick={(e) => e.stopPropagation()}>
                        {/* ───────────── 왼쪽: 미리보기 패널 (detail-row 구조) ───────────── */}
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

                            {/* 여기서부터 detail-row 구조 적용 */}
                            <div className="modal-body">
                                {/* 섹션 */}
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <i className="fas fa-folder-open"/>
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">섹션</span>
                                        <span className="detail-value">{selectedTask.sectionTitle}</span>
                                    </div>
                                </div>

                                {/* 작업 이름 */}
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <i className="fas fa-file-alt"/>
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">작업 이름</span>
                                        <span className="detail-value">{editTaskName}</span>
                                    </div>
                                </div>

                                {/* 작업 내용 */}
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <i className="fas fa-info-circle"/>
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">설명</span>
                                        <span
                                            className="detail-value"
                                            dangerouslySetInnerHTML={{__html: editContent}}
                                        />
                                    </div>
                                </div>

                                {/* 마감일 */}
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <i className="far fa-calendar-alt"/>
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">마감일</span>
                                        <span className="detail-value">
                      {editDueDate
                          ? new Date(editDueDate).toLocaleDateString()
                          : "미설정"}
                    </span>
                                    </div>
                                </div>

                                {/* 우선순위 */}
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <i className="fas fa-exclamation-circle"/>
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
                                        <i className="fas fa-user"/>
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">담당자</span>
                                        <span className="detail-value">{editAssignee || "미지정"}</span>
                                    </div>
                                </div>

                                {/* 메모 */}
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <i className="far fa-sticky-note"/>
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">메모</span>
                                        <span className="detail-value">{editMemo || "메모 없음"}</span>
                                    </div>
                                </div>

                                {/* 첨부파일 */}
                                {uploadedFiles.length > 0 && (
                                    <div className="detail-row">
                                        <div className="detail-icon">
                                            <i className="fas fa-paperclip"/>
                                        </div>
                                        <div className="detail-text">
                                            <span className="detail-label">등록된 파일 목록</span>
                                            <div className="file-thumbnails-preview">
                                                {uploadedFiles.map((file, idx) => {
                                                    const isImage = file.type.startsWith("image/");
                                                    const extension = file.name.split(".").pop().toLowerCase();
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
                                                                onClick={() => handleRemoveFileEdit(idx)}
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
                                                                    <i className={`fas ${iconClass}`}/>
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

                        {/* ───────────── 오른쪽: 수정 폼 ───────────── */}
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
                                    style={{minHeight: 60}}
                                    dangerouslySetInnerHTML={{__html: editContent}}
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
                                    <div style={{marginTop: 4, color: "green"}}>
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

                            {/* 파일 첨부 (수정 모달 내) */}
                            <div className="form-field1">
                                <label>파일 첨부</label>
                                <div className="file-drop-area" onDragOver={handleDragOverEdit} onDrop={handleDropEdit}>
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
                                    {/* 서버에 이미 첨부된 파일들 */}
                                    {selectedTask && selectedTask.files && selectedTask.files.length > 0 && (
                                        <div className="file-thumbnails-preview">
                                            {selectedTask.files.map((file) => {
                                                const extension = file.originalFilename.split(".").pop().toLowerCase();
                                                const isImage = ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(extension);

                                                return (
                                                    <div className="file-thumbnail" key={file.id}>
                                                        {isImage ? (
                                                            <img
                                                                src={`/api/tasks/${selectedTask.id}/files/${file.id}`}
                                                                alt={file.originalFilename}
                                                                className="file-thumbnail-image"
                                                            />
                                                        ) : (
                                                            <div className="file-icon">
                                                                <i className="fas fa-file"/>
                                                            </div>
                                                        )}
                                                        <div className="file-thumbnail-info">
                              <span className="file-thumbnail-name" title={file.originalFilename}>
                                {file.originalFilename}
                              </span>
                                                        </div>
                                                        <a
                                                            className="file-download-link"
                                                            href={`/api/tasks/${selectedTask.id}/files/${file.id}`}
                                                        >
                                                            다운로드
                                                        </a>
                                                        <button
                                                            className="file-remove-btn"
                                                            onClick={() => handleFileRemove(selectedTask.id, file.id)}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 하단 버튼 */}
                            <div className="drawer-footer" style={{marginTop: 16, textAlign: "right"}}>
                                <button
                                    className="btn btn-delete"
                                    onClick={handleCloseEditModal}
                                    style={{marginRight: 8}}
                                >
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
                                <div className="editor-header" style={{marginBottom: 10}}>
                                    <h2>사용자 커스텀 편집</h2>
                                    <button
                                        onClick={() => setIsEditorOpen(false)}
                                        style={{float: "right", fontSize: 20}}
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
                                    style={{height: "300px", marginBottom: "20px"}}
                                />
                                <div className="editor-footer" style={{textAlign: "right"}}>
                                    <button onClick={() => setIsEditorOpen(false)} style={{marginRight: 8}}>
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
