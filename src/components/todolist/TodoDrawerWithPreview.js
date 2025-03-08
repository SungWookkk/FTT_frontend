import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PriorityDropdown from "./PriorityDropdown";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";
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

const TodoDrawerWithPreview = () => {
    /** ====== 입력 상태 ====== */
    const [taskName, setTaskName] = useState("");
    const [content, setContent] = useState("<p>작업 내용을 입력하세요...</p>");
    const [priority, setPriority] = useState("보통");
    const [dueDate, setDueDate] = useState(null);
    const [daysLeft, setDaysLeft] = useState(null);
    const [memo, setMemo] = useState("");
    const [assignee, setAssignee] = useState("");

    // 드로어 열림
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Quill 모달
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [tempHTML, setTempHTML] = useState(content);

    // 열기/닫기
    const handleOpenDetail = () => setIsDetailOpen(true);
    const handleCloseDetail = () => setIsDetailOpen(false);

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

    // 저장
    const handleDetailSave = () => {
        console.log("작업 이름:", taskName);
        console.log("작업 내용(HTML):", content);
        console.log("우선순위:", priority);
        console.log("마감일:", dueDate);
        console.log("담당자:", assignee);
        console.log("메모:", memo);
        setIsDetailOpen(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <button onClick={handleOpenDetail}>드로어 열기</button>

            {/** 드로어 전체 컨테이너 */}
            <div className={`drawer-container ${isDetailOpen ? "open" : ""}`}>
                {/** (예시) 오른쪽 폼 */}
                <div className="right-form-panel">
                    <h2>오른쪽 폼</h2>
                    <p>사용자가 작성할 폼, 스크롤 등 원하는대로</p>
                </div>

                {isDetailOpen && (
                    <div className="drawer-wrapper">
                        {/** 왼쪽 프리뷰 영역 */}
                        <div className="preview-panel">
                            <h3>실시간 미리보기</h3>
                            <div className="preview-row">
                                <label>작업 이름:</label>
                                <div className="preview-value">{taskName || "(없음)"}</div>
                            </div>
                            <div className="preview-row">
                                <label>작업 내용:</label>
                                {/** HTML이 길어도 스크롤 처리 */}
                                <div
                                    className="preview-value content-scroll"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            </div>
                            <div className="preview-row">
                                <label>우선순위:</label>
                                <div className="preview-value">{priority}</div>
                            </div>
                            <div className="preview-row">
                                <label>마감일:</label>
                                <div className="preview-value">
                                    {dueDate ? dueDate.toLocaleDateString() : "미설정"}
                                    {daysLeft !== null && (
                                        <em style={{ marginLeft: 8 }}>
                                            {daysLeft > 0
                                                ? `(D-${daysLeft})`
                                                : daysLeft === 0
                                                    ? "오늘 마감!"
                                                    : `(D+${Math.abs(daysLeft)})`
                                            }
                                        </em>
                                    )}
                                </div>
                            </div>
                            <div className="preview-row">
                                <label>담당자:</label>
                                <div className="preview-value">{assignee || "(미지정)"}</div>
                            </div>
                            <div className="preview-row">
                                <label>메모:</label>
                                {/** 길어도 스크롤 */}
                                <div className="preview-value content-scroll">
                                    {memo || "(없음)"}
                                </div>
                            </div>
                        </div>

                        {/** 오른쪽 드로어 */}
                        <div className="detail-drawer">
                            <div className="drawer-header">
                                <h2>추가 상세 정보</h2>
                            </div>
                            <div className="drawer-body">
                                <div className="drawer-field">
                                    <label>작업 이름</label>
                                    <input
                                        type="text"
                                        placeholder="작업 이름"
                                        value={taskName}
                                        onChange={(e) => setTaskName(e.target.value)}
                                    />
                                </div>
                                <div className="drawer-field">
                                    <label>작업 내용</label>
                                    <textarea
                                        rows={6}
                                        placeholder="작업 내용을 입력하세요"
                                        value={content.replace(/<[^>]+>/g, "")}
                                        onChange={(e) => setContent(e.target.value)}
                                        style={{ resize: "vertical" }}
                                    />
                                    <button className="editor-open-btn" onClick={openEditor}>
                                        사용자 커스텀 편집
                                    </button>
                                </div>
                                <div className="drawer-field">
                                    <label>우선순위</label>
                                    <PriorityDropdown
                                        priority={priority}
                                        onChange={(val) => setPriority(val)}
                                    />
                                </div>
                                <div className="drawer-field">
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
                                <div className="drawer-field">
                                    <label>메모</label>
                                    <textarea
                                        rows={4}
                                        placeholder="추가 메모를 입력하세요"
                                        value={memo}
                                        onChange={(e) => setMemo(e.target.value)}
                                        style={{ resize: "vertical" }}
                                    />
                                </div>
                                <div className="drawer-field">
                                    <label>담당자</label>
                                    <input
                                        type="text"
                                        placeholder="담당자 이름"
                                        value={assignee}
                                        onChange={(e) => setAssignee(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="drawer-footer">
                                <button className="btn btn-create" onClick={handleDetailSave}>
                                    저장
                                </button>
                                <button className="btn btn-edit" onClick={handleCloseDetail}>
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/** Quill 모달 */}
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
    );
};

export default TodoDrawerWithPreview;
