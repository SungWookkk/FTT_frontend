import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./css/TodoListWrite.css";
import reply1 from "../../Auth/css/img/reply-1.svg";

import PriorityDropdown from "./PriorityDropdown";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

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

const TodoListWrite = () => {
    const [taskName, setTaskName] = useState("");
    const [content, setContent] = useState("<p>작업 내용을 입력하세요...</p>");
    const [priority, setPriority] = useState("보통");
    const [dueDate, setDueDate] = useState(null);
    const [assignee, setAssignee] = useState("");
    const [memo, setMemo] = useState("");
    const [daysLeft, setDaysLeft] = useState(null);

    const [uploadedFiles, setUploadedFiles] = useState([]);

    // 드로어 열림 여부
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // 에디터 모달
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [tempHTML, setTempHTML] = useState(content);

    // 툴팁
    const [showTips, setShowTips] = useState(false);

    // 파일 업로드 핸들러
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

    // 드로어 열기/닫기
    const handleOpenDetail = () => setIsDetailOpen(true);
    const handleCloseDetail = () => setIsDetailOpen(false);

    // 드로어 저장
    const handleDetailSave = () => {
        console.log("작업 이름:", taskName);
        console.log("작업 내용(HTML):", content);
        console.log("우선순위:", priority);
        console.log("마감일:", dueDate);
        console.log("담당자:", assignee);
        console.log("메모:", memo);
        setIsDetailOpen(false);
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

    // DatePicker 한글
    registerLocale("ko", ko);

    // 마감일 계산
    const handleDueDateChange = (date) => {
        setDueDate(date);
        if (!date) {
            setDaysLeft(null);
            return;
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const picked = new Date(date);
        picked.setHours(0, 0, 0, 0);

        const diff = Math.floor((picked - now) / (1000 * 60 * 60 * 24));
        setDaysLeft(diff);
    };

    return (
        <div className="dashboard-content">
            {/* 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">작업 작성</span>
                </div>
                <div className="header-button-group">
                    <button className="btn btn-edit">취소</button>
                    <button className="btn btn-create">완료</button>
                </div>
            </div>

            {/* 탭 */}
            <div className="list-tap">
                <div className="list-tab-container">
                    <div className="tab-item active">작성</div>
                    <div className="tab-item">상세</div>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner">
                <p className="alert-text">
                    <span className="highlight-text">효율적인 하루</span>
                    <span className="normal-text">를 설계하세요! 우리의 </span>
                    <span className="highlight-text">To-Do List 서비스</span>
                    <span className="normal-text">
            를 통해 목표를 정리하고 실천하세요. 지금 바로 시작해보세요!
          </span>
                </p>
            </div>

            {/* 본문 (왼쪽 내용) */}
            <div className="dashboard-main-content">
                {/* 동기부여 멘트 */}
                <div className="motivation-container">
                    <div className="motivation-title">오늘의 동기부여 멘트!</div>
                    <div className="motivation-content">
                        <p className="motivation-quote">
                            열정을 잃지 않고 실패에서 실패로 걸어가는 것이 성공이다. – 박성욱
                        </p>
                        <img className="motivation-reply" alt="Reply" src={reply1} />
                    </div>
                </div>

                {/* 작업 이름 */}
                <div className="report-box" onClick={handleOpenDetail}>
                    <div className="report-group">
                        <div className="report-underline" />
                        <div className="report-subtitle">작업 이름</div>
                        <input
                            type="text"
                            className="report-title-input"
                            placeholder="프로젝트 보고서 작성..."
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                    </div>
                </div>

                {/* 작업 내용 */}
                <div className="write-content-box" onClick={handleOpenDetail}>
                    <div className="content-group">
                        <div className="content-overlap">
                            <div className="content-divider" />
                            <div className="content-label">작업 내용</div>
                            <div
                                className="content-preview"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>
                    </div>
                </div>

                {/* 파일 첨부 */}
                <div
                    className="file-upload-wrapper"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className="file-upload-header">
                        <h3 className="file-upload-title">파일 등록</h3>
                        <p className="file-upload-desc">
                            필요한 파일을 등록해 주세요! <br />
                            (예: 팀 보고서, 참고 자료 등)
                        </p>
                        <p className="file-upload-state">
                            업로드 - 파일 {uploadedFiles.length}개
                        </p>
                    </div>

                    <label htmlFor="file-input" className="file-drop-area">
                        <p className="file-instruction">
                            이 영역을 드래그하거나 <span>클릭</span>하여 업로드
                        </p>
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            className="file-input"
                            onChange={handleFileChange}
                        />
                    </label>

                    <div className="file-list">
                        {uploadedFiles.map((file, idx) => (
                            <div className="file-item" key={idx}>
                                <span className="file-name">{file.name}</span>
                                <button
                                    className="file-remove-btn"
                                    onClick={() => handleRemoveFile(idx)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 오른쪽 AI 요약 패널 */}
                <div className={`ai-summary-panel ${isDetailOpen ? "move-right" : ""}`}>
                    <h2>AI 요약 패널</h2>
                    <p>이곳에는 백엔드 설계 후 내용 넣을 에정</p>
                    <p>OpenAI API를 사용할 것임.</p>
                </div>

                {/* 피그마 디자인 코드 */}
                <div className={`yellow-design-section ${isDetailOpen ? "move-right" : ""}`}>
                    {/* 뱃지 */}
                    <div className="yellow-title">뱃지</div>
                    <div className="progress-bar badge-bar">
                        <div className="progress-fill badge-fill"></div>
                        <div className="progress-text">작업 진척도</div>
                    </div>

                    {/* 칭호 */}
                    <div className="yellow-title">칭호</div>
                    <div className="progress-bar badge-bar">
                        <div className="progress-fill title-fill"></div>
                        <div className="progress-text">3일 연속 작업 완료! - "3일의 기적"</div>
                    </div>

                    {/* 마감시간 */}
                    <div className="yellow-title">마감 시간 준수</div>
                    <div className="progress-bar badge-bar">
                        <div className="progress-fill time-fill"></div>
                        <div className="progress-text">마감 시간 준수! - "시간 관리의 신!"</div>
                    </div>
                </div>

                {/* 드로어 컨테이너 */}
                <div className={`detail-container ${isDetailOpen ? "open" : ""}`}>
                    <div className="detail-drawer">
                        <div className="drawer-header">
                            <h2>추가 상세 정보</h2>
                        </div>
                        <div className="drawer-body">
                            {/* 작업 이름 */}
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
                                    rows={3}
                                    placeholder="작업 내용을 입력하세요"
                                    value={content.replace(/<[^>]+>/g, "")}
                                    onChange={(e) => setContent(e.target.value)}
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
                                    calendarClassName="custom-calendar"
                                    popperPlacement="auto"
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
                                    rows={3}
                                    placeholder="추가 메모를 입력하세요"
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
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
                            <div className="drawer-field">
                                <label>작업 폴더</label>
                                <select
                                    value={assignee}
                                    onChange={(e) => setAssignee(e.target.value)}
                                >
                                    <option value="">폴더 선택</option>
                                    <option value="folderA">폴더 A</option>
                                    <option value="folderB">폴더 B</option>
                                    <option value="folderC">폴더 C</option>
                                </select>
                            </div>
                        </div>
                        <div className="drawer-footer">
                            <button className="btn btn-create" onClick={handleDetailSave}>
                                저장
                            </button>
                        </div>
                    </div>

                    {/* 드로어 열림 시: 오른쪽 상단(바깥)에 닫기 버튼 + ? 아이콘 */}
                    {isDetailOpen && (
                        <div className="drawer-top-actions">
                            <button className="drawer-close-btn" onClick={handleCloseDetail}>
                                닫기
                            </button>

                            <div
                                className="tips-icon-wrapper"
                                onMouseEnter={() => setShowTips(true)}
                                onMouseLeave={() => setShowTips(false)}
                            >
                                <span className="tips-icon">?</span>
                                {showTips && (
                                    <div className="tips-tooltip">
                                        <h3>작업 작성 TIP</h3>
                                        <ul>
                                            <li>작업은 구체적으로 적어주세요.</li>
                                            <li>마감일을 꼭 설정해 보세요.</li>
                                            <li>단계를 나누어 작성하면 실행이 쉬워집니다.</li>
                                            <li>우선순위를 명확히 정해주세요.</li>
                                        </ul>
                                        <div className="tooltip-divider"></div>
                                        <h3>미루기 방지 체크리스트</h3>
                                        <ol>
                                            <li>이 작업의 구체적인 목표는?</li>
                                            <li>언제까지 끝낼 것인가?</li>
                                            <li>중간 점검이 필요한가?</li>
                                            <li>이 작업을 끝내면 무엇이 좋은가?</li>
                                        </ol>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 커스텀 에디터 모달 */}
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
        </div>
    );
};

export default TodoListWrite;
