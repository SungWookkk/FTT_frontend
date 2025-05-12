import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PriorityDropdown from "./PriorityDropdown";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
import "../todolist/css/TodoCreateModal.css";
import "../todolist/css/TodoDrawerWithPreview.css";
import axios from "axios";

registerLocale("ko", ko);

// Quill 에디터 설정
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

const TodoCreateModal = ({ onClose, onTaskCreated }) => {
    // 작업 생성 폼 상태
    const [taskName, setTaskName] = useState("");
    const [content, setContent] = useState("");
    const [priority, setPriority] = useState("보통");
    const [startDate, setStartDate] = useState(null); // 시작일
    const [dueDate, setDueDate] = useState(null);     // 마감일
    const [assignee, setAssignee] = useState("");
    const [memo, setMemo] = useState("");
    const [daysLeft, setDaysLeft] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const fileInputRef = useRef(null);

    // Quill 에디터 모달 상태
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [tempHTML, setTempHTML] = useState(content);

    // 파일 첨부 처리
    const handleFileChange = (e) => {
        if (!e.target.files) return;
        const newFiles = [...uploadedFiles, ...Array.from(e.target.files)];
        setUploadedFiles(newFiles);
    };
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
        }
    };
    const handleRemoveFile = (idx) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    // 마감일 변경 시 남은 일수 계산
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleDueDateChange = (date) => {
        setDueDate(date);

        if (date) {
            // 시차 문제를 없애기 위해 'stripTime'으로 연/월/일만 반영
            const stripTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

            const now = stripTime(new Date());
            const picked = stripTime(date);

            const diff = Math.floor((picked - now) / (1000 * 60 * 60 * 24));
            setDaysLeft(diff);
        } else {
            setDaysLeft(null);
        }
    };


    // Quill 에디터 열기/닫기
    const openEditor = () => {
        setTempHTML(content);
        setIsEditorOpen(true);
    };
    const closeEditor = () => setIsEditorOpen(false);
    const saveEditorContent = () => {
        setContent(tempHTML);
        setIsEditorOpen(false);
    };

    // Task 저장: 백엔드와 통신
    const handleSave = () => {
        // --------------------
        //  유효성 검사 추가
        // --------------------
        // 시작일, 마감일이 모두 설정된 경우
        if (startDate && dueDate) {
            // 1) 시작일 > 마감일인 경우
            if (startDate > dueDate) {
                alert("시작일이 마감일보다 뒤일 수 없습니다.");
                return;
            }
        }
        //  마감일이 이미 지난 경우 (사용자가 '오늘 이전' 날짜를 마감일로 설정)
        if (dueDate) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            if (due < now) {
                alert("이미 지난 날짜는 마감일로 설정할 수 없습니다.");
                return;
            }
        }

        // 1) 콘솔 디버깅
        console.log("작업 이름:", taskName);
        console.log("작업 내용:", content);
        console.log("우선순위:", priority);
        console.log("마감일:", dueDate);
        console.log("담당자:", assignee);
        console.log("메모:", memo);
        console.log("첨부파일:", uploadedFiles);

        // 1) helper 함수 추가: 로컬 Date → "yyyy-MM-dd" 문자열
        const formatLocalDate = date => {
            const y   = date.getFullYear();
            const m   = String(date.getMonth() + 1).padStart(2, '0');
            const d   = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        // 2) 백엔드로 Task 생성 요청 (파일 업로드 제외)
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const payload = {
            title: taskName,
            description: content,
            priority: priority,
            startDate: startDate ? formatLocalDate(startDate) : null,
            dueDate:   dueDate   ? formatLocalDate(dueDate)   : null,
            assignee: assignee,
            memo: memo,
            userId: userId
        };

        axios.post("/api/tasks", payload, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                const createdTask = response.data;
                if (uploadedFiles.length > 0) {
                    // 각 파일에 대해 FormData 생성 후 업로드 API 호출
                    const uploadPromises = uploadedFiles.map((file) => {
                        const formData = new FormData();
                        formData.append("file", file);
                        return axios.post(
                            `/api/tasks/${createdTask.id}/files`,
                            formData,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );
                    });
                    // 모든 파일 업로드 완료 후, 최신 Task 정보를 다시 GET 합니다.
                    Promise.all(uploadPromises)
                        .then(() => {
                            axios.get(`/api/tasks/${createdTask.id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            })
                                .then((res) => {
                                    const updatedTask = res.data;
                                    alert("새 작업 및 첨부 파일이 등록되었습니다!");
                                    if (onTaskCreated) {
                                        onTaskCreated(updatedTask);
                                    }
                                    onClose();
                                })
                                .catch((error) => {
                                    console.error("업데이트된 Task 조회 실패:", error);
                                    alert("파일은 업로드되었으나, 작업 정보를 갱신하지 못했습니다.");
                                });
                        })
                        .catch((error) => {
                            console.error("파일 업로드 실패:", error);
                            alert("작업은 생성되었으나, 파일 업로드에 실패했습니다.");
                        });
                } else {
                    alert("새 작업이 생성되었습니다!");
                    if (onTaskCreated) {
                        onTaskCreated(createdTask);
                    }
                    onClose();
                }
            })
            .catch((error) => {
                console.error("작업 생성 실패:", error);
                alert("작업 생성에 실패했습니다.");
            });
    };

    return (
        <div className="drawer-modal-overlay" onClick={onClose}>
            <div className="drawer-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>새 작업 작성</h2>
                <div className="drawer-content-wrapper">
                    <div className="preview-panel">
                        <h3>작업 생성 (미리보기)</h3>
                        <div
                            className="section-header3"
                            style={{
                                borderBottom: "4px solid #ffa500",
                                padding: "8px 0",
                            }}
                        >
                            <span
                                style={{ fontSize: "16px", fontWeight: "bold", marginLeft: "8px" }}
                            >
                                {taskName || "제목..."}
                            </span>
                        </div>

                        <div className="detail-items-container">
                            {/* 작업 내용 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="fas fa-info-circle" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">작업 내용</span>
                                    <span
                                        className="detail-value"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                </div>
                            </div>

                            {/* 우선순위 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="fas fa-exclamation-circle" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">우선순위</span>
                                    <span className={`detail-value priority-${priority}`}>
                                        {priority}
                                    </span>
                                </div>
                            </div>

                            {/* 시작일 + 마감일 한 줄 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="far fa-calendar-alt" />
                                </div>

                                {/* 두 날짜를 한 줄에 배치: 'detail-text' 안에서 flex */}
                                <div className="detail-text" style={{ display: "flex", gap: "16px", width: "100%" }}>
                                    {/* 시작일 */}
                                    <div style={{ flex: 1 }}>
                                        <span className="detail-label">시작일</span>
                                        <span className="detail-value">
        {startDate
            ? new Date(startDate).toLocaleDateString()
            : "미설정"
        }
      </span>
                                    </div>

                                    {/* 마감일 + daysLeft 로직 */}
                                    <div style={{ flex: 1 }}>
                                        <span className="detail-label">마감일</span>
                                        <span className="detail-value">
        {dueDate
            ? new Date(dueDate).toLocaleDateString()
            : "미설정"
        }

                                            {/* daysLeft 표시 (마감일만 해당) */}
                                            {daysLeft > 0
                                                ? ` || 남은 일수: ${daysLeft}일 (D-${daysLeft})`
                                                : daysLeft === 0
                                                    ? " || 오늘이 마감일입니다."
                                                    : daysLeft !== null &&
                                                    ` || 마감일이 ${Math.abs(daysLeft)}일 지났습니다 (D+${Math.abs(daysLeft)})`
                                            }
      </span>
                                    </div>
                                </div>
                            </div>

                            {/* 담당자 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="fas fa-user" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">담당자</span>
                                    <span className="detail-value">{assignee || "미지정"}</span>
                                </div>
                            </div>

                            {/* 메모 */}
                            <div className="detail-row">
                                <div className="detail-icon">
                                    <i className="far fa-sticky-note" />
                                </div>
                                <div className="detail-text">
                                    <span className="detail-label">메모</span>
                                    <span className="detail-value">{memo || "없음"}</span>
                                </div>
                            </div>

                            {/* 첨부파일 */}
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
                                                const extension = file.name
                                                    .split(".")
                                                    .pop()
                                                    .toLowerCase();
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
                                                const iconClass =
                                                    fileIconMap[extension] || fileIconMap.default;
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
                                                            <span
                                                                className="file-thumbnail-name"
                                                                title={file.name}
                                                            >
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

                    {/* 입력 폼 패널 */}
                    <div className="form-panel">
                        <h3>입력 폼</h3>

                        <div className="form-field">
                            <label>작업 이름</label>
                            <input
                                type="text"
                                placeholder="예: 프로젝트 보고서 작성..."
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label>작업 내용</label>
                            <div
                                className="content-preview form-preview"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                            <button className="editor-open-btn" onClick={openEditor}>
                                에디터 열기
                            </button>
                        </div>

                        <div className="form-field">
                            <label>우선순위</label>
                            <PriorityDropdown
                                priority={priority}
                                onChange={(val) => setPriority(val)}
                            />
                        </div>

                        <div className="form-field" style={{display: "flex", gap: "20px"}}>
                            {/* 시작일 영역 */}
                            <div style={{flex: 1}}>
                                <label>시작일</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange} // 시작일 변경 로직
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="연도-월-일"
                                    locale="ko"
                                    className="custom-date-input"
                                />
                            </div>

                            {/* 마감일 영역 */}
                            <div style={{flex: 1}}>
                                <label>마감일</label>
                                <DatePicker
                                    selected={dueDate}
                                    onChange={handleDueDateChange} // 마감일 변경 로직
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="연도-월-일"
                                    locale="ko"
                                    className="custom-date-input"
                                />

                                {/* daysLeft 로직 (마감일 기준) */}
                                {daysLeft !== null && (
                                    <div className="due-remaining">
                                        {daysLeft > 0
                                            ? `남은 일수: ${daysLeft}일 (D-${daysLeft})`
                                            : daysLeft === 0
                                                ? " || 오늘이 마감일입니다."
                                                : `마감일이 ${Math.abs(daysLeft)}일 지났습니다 (D+${Math.abs(daysLeft)})`}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-field">
                            <label>담당자</label>
                            <input
                                type="text"
                                placeholder="담당자 이름"
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label>메모</label>
                            <textarea
                                rows={3}
                                placeholder="추가 메모를 입력하세요"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                            />
                        </div>

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

                        <div className="form-footer">
                            <button className="btn btn-edit" onClick={onClose}>
                                취소
                            </button>
                            <button className="btn btn-create" onClick={handleSave}>
                                저장
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quill 에디터 모달 */}
                {isEditorOpen && (
                    <div className="editor-modal-overlay" onClick={closeEditor}>
                        <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
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
            </div>
        </div>
    );
};

export default TodoCreateModal;
