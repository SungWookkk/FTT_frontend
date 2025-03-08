/* TodoCreateModal.jsx */
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PriorityDropdown from "./PriorityDropdown";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
import "../todolist/css/TodoCreateModal.css"; // ← 이 CSS 파일에 최종 스타일을 넣는다고 가정
import "../todolist/css/TodoDrawerWithPreview.css"; // ← 이 CSS 파일에 최종 스타일을 넣는다고 가정

registerLocale("ko", ko);

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

const TodoCreateModal = ({ onClose }) => {
    // form state
    const [taskName, setTaskName] = useState("");
    const [content, setContent] = useState("<p>작업 내용을 입력하세요...</p>");
    const [priority, setPriority] = useState("보통");
    const [dueDate, setDueDate] = useState(null);
    const [assignee, setAssignee] = useState("");
    const [memo, setMemo] = useState("");
    const [daysLeft, setDaysLeft] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Quill Editor
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [tempHTML, setTempHTML] = useState(content);

    // 파일 첨부
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

    // 마감일 계산
    const handleDueDateChange = (date) => {
        setDueDate(date);
        if (!date) {
            setDaysLeft(null);
            return;
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const diff = Math.floor((date - now) / (1000 * 60 * 60 * 24));
        setDaysLeft(diff);
    };

    // Quill 열기/닫기
    const openEditor = () => {
        setTempHTML(content);
        setIsEditorOpen(true);
    };
    const closeEditor = () => setIsEditorOpen(false);
    const saveEditorContent = () => {
        setContent(tempHTML);
        setIsEditorOpen(false);
    };

    // 저장
    const handleSave = () => {
        console.log("작업 이름:", taskName);
        console.log("작업 내용:", content);
        console.log("우선순위:", priority);
        console.log("마감일:", dueDate);
        console.log("담당자:", assignee);
        console.log("메모:", memo);
        console.log("첨부파일:", uploadedFiles);
        onClose();
    };

    return (
        <div className="drawer-modal-overlay" onClick={onClose}>
            <div className="drawer-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>새 작업 작성</h2>

                <div className="drawer-content-wrapper">
                    {/* 왼쪽 미리보기 패널 (가로 리사이즈 가능) */}
                    <div className="preview-panel">
                        <h3>미리보기</h3>

                        <div className="preview-row">
                            <label>작업 이름</label>
                            <div className="preview-value">{taskName || "입력 중..."}</div>
                        </div>

                        <div className="preview-row">
                            <label>작업 내용</label>
                            <div
                                className="preview-value"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>

                        <div className="preview-row">
                            <label>우선순위</label>
                            <div className={`preview-value priority-${priority.toLowerCase()}`}>
                                {priority}
                            </div>
                        </div>

                        <div className="preview-row">
                            <label>마감일</label>
                            <div className="preview-value">
                                {dueDate ? new Date(dueDate).toLocaleDateString() : "미설정"}
                            </div>
                        </div>

                        <div className="preview-row">
                            <label>담당자</label>
                            <div className="preview-value">{assignee || "미지정"}</div>
                        </div>

                        <div className="preview-row">
                            <label>메모</label>
                            <div className="preview-value">{memo || "없음"}</div>
                        </div>

                        {/* 첨부파일 미리보기 */}
                        {uploadedFiles.length > 0 && (
                            <div className="preview-row">
                                <label>첨부파일</label>
                                <div className="preview-value">
                                    {uploadedFiles.map((file, idx) => (
                                        <div key={idx}>{file.name}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 오른쪽 입력 폼 패널 */}
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

                        <div className="form-field">
                            <label>마감일</label>
                            <DatePicker
                                selected={dueDate}
                                onChange={handleDueDateChange}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="연도-월-일"
                                locale="ko"
                                className="custom-date-input"
                            />
                            {daysLeft !== null && (
                                <div className="due-remaining">
                                    {daysLeft > 0
                                        ? `남은 일수: ${daysLeft}일 (D-${daysLeft})`
                                        : daysLeft === 0
                                            ? "오늘이 마감일입니다."
                                            : `마감일이 ${Math.abs(daysLeft)}일 지났습니다 (D+${Math.abs(daysLeft)})`}
                                </div>
                            )}
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
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="file-list">
                                {uploadedFiles.map((file, idx) => (
                                    <div className="file-item" key={idx}>
                                        <span className="file-name">{file.name}</span>
                                    </div>
                                ))}
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
