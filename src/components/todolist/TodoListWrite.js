import React, { useState } from "react";

//글쓰기 설정
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./css/TodoListWrite.css";
import reply1 from "../../Auth/css/img/reply-1.svg";

//드롭다운 디자인
import PriorityDropdown from "./PriorityDropdown";

//달력
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko"; // 한글 가져오기

//  ReactQuill 툴바 설정
const quillModules = {
    toolbar: [
        // [스타일] 1단계 ~ 3단계 헤더 or false
        [{ header: [1, 2, 3, false] }],
        // 굵게, 이탤릭, 밑줄, 취소선
        ["bold", "italic", "underline", "strike"],
        // 리스트 (순서형 / 순서없는)
        [{ list: "ordered" }, { list: "bullet" }],
        // 링크, 이미지, 코드블럭 등
        ["link", "image"],
        // 서식 제거
        ["clean"],
    ],
};

const quillFormats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "link", "image",
];

const TodoListWrite = () => {
    //  상태
    const [taskName, setTaskName] = useState("");
    const [content, setContent] = useState("<p>작업 내용을 입력하세요...</p>");
    const [priority, setPriority] = useState("보통");
    const [dueDate, setDueDate] = useState(null);
    const [assignee, setAssignee] = useState("");
    const [memo, setMemo] = useState("");

    // 파일 업로드
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // 오른쪽 드로어 열림 여부
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // 에디터 모달 열림 여부
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    // 모달에서 편집할 임시 HTML
    const [tempHTML, setTempHTML] = useState(content);

    // 파일 업로드 핸들러
    const handleFileChange = (e) => {
        if (!e.target.files) return;
        const newFiles = [...uploadedFiles, ...Array.from(e.target.files)];
        setUploadedFiles(newFiles);
    };
    const handleRemoveFile = (index) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
        }
    };

    //오른쪽 드로어
    const handleOpenDetail = () => setIsDetailOpen(true);
    const handleCloseDetail = () => setIsDetailOpen(false);

    const handleDetailSave = () => {
        console.log("작업 이름:", taskName);
        console.log("작업 내용(HTML):", content);
        console.log("우선순위:", priority);
        console.log("마감일:", dueDate);
        console.log("담당자:", assignee);
        console.log("메모:", memo);
        setIsDetailOpen(false);
    };

    //  reactQuill 모달 열기/닫기
    const openEditor = () => {
        setTempHTML(content); // 현재 content HTML 복사
        setIsEditorOpen(true);
    };
    const closeEditor = () => setIsEditorOpen(false);

    // 모달에서 최종 확인 > content 갱신
    const saveEditorContent = () => {
        setContent(tempHTML);
        setIsEditorOpen(false);
    };

    // 달력 한글 등록
    registerLocale("ko", ko);


    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">작업 작성</span>
                </div>
                <div className="header-button-group">
                    <button className="btn btn-edit">취소</button>
                    <button className="btn btn-create">완료</button>
                </div>
            </div>

            {/* 목록 선택 탭 */}
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

            {/* 본문 */}
            <div className="dashboard-main-content">
                {/* 동기부여 멘트 */}
                <div className="motivation-container">
                    <div className="motivation-title">오늘의 동기부여 멘트!</div>
                    <div className="motivation-content">
                        <p className="motivation-quote">
                            열정을 잃지 않고 실패에서 실패로 걸어가는 것이 성공이다. – 윈스턴 처칠
                        </p>
                        <img className="motivation-reply" alt="Reply" src={reply1} />
                    </div>
                </div>

                {/* 작업 이름 (왼쪽) */}
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

                {/* 작업 내용 (왼쪽) */}
                <div className="write-content-box" onClick={handleOpenDetail}>
                    <div className="content-group">
                        <div className="content-overlap">
                            <div className="content-divider" />
                            <div className="content-label">작업 내용</div>
                            {/* HTML 미리보기 */}
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
                            업로드 - {uploadedFiles.length} files
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

                {/* 오른쪽 드로어 */}
                <div className={`detail-drawer ${isDetailOpen ? "open" : ""}`}>
                    <div className="drawer-header">
                        <h2>추가 상세 정보</h2>
                        <button className="drawer-close-btn" onClick={handleCloseDetail}>
                            닫기
                        </button>
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

                        {/* 작업 내용 (우측 드로어) + "고급 편집" 버튼 */}
                        <div className="drawer-field">
                            <label>작업 내용</label>
                            <textarea
                                rows={3}
                                placeholder="작업 내용을 입력하세요"
                                value={content.replace(/<[^>]+>/g, "")}
                                onChange={(e) => {
                                    // 사용자가 여기서도 텍스트 변경하면, content를 단순 텍스트로...
                                    setContent(e.target.value);
                                }}
                            />
                            <button
                                className="editor-open-btn"
                                onClick={() => {
                                    setTempHTML(content); // 현재 HTML을 모달에 전달
                                    setIsEditorOpen(true); // 모달 오픈
                                }}
                            >
                                사용자 커스텀 편집
                            </button>
                        </div>

                        {/* 우선순위 */}
                        <div className="drawer-field">
                            <label>우선순위</label>
                            <PriorityDropdown
                                priority={priority}
                                onChange={(val) => setPriority(val)}
                            />
                        </div>

                        {/* 마감일 → React DatePicker */}
                        <div className="drawer-field">
                            <label>마감일</label>
                            <DatePicker
                                selected={dueDate}
                                onChange={(date) => setDueDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="연도-월-일"
                                locale="ko" // 한글
                                className="custom-date-input"
                                calendarClassName="custom-calendar"  // 달력 팝업 커스텀 클래스
                                popperPlacement="auto"   // 위치 자동 조정
                            />
                        </div>

                        {/* 메모 */}
                        <div className="drawer-field">
                            <label>메모</label>
                            <textarea
                                rows={3}
                                placeholder="추가 메모를 입력하세요"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                            />
                        </div>

                        {/* 담당자 */}
                        <div className="drawer-field">
                            <label>담당자</label>
                            <input
                                type="text"
                                placeholder="담당자 이름"
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                            />
                        </div>
                        {/* 작업 폴더 */}
                        <div className="drawer-field">
                            <label>작업 폴더</label>
                            <select
                                value={assignee}        // 현재 state 사용 (임시로 assignee에 저장 중)
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
            </div>

            {isEditorOpen && (
                <div className="editor-modal-overlay">
                    <div className="editor-modal">
                        <div className="editor-header">
                            <h2>사용자 커스텀 편집</h2>
                            <button onClick={closeEditor} className="editor-close-btn">
                                ×
                            </button>
                        </div>

                        {/* ReactQuill로 사용자 커스텀*/}
                        <ReactQuill
                            theme="snow"
                            value={tempHTML}
                            onChange={setTempHTML}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ height: "300px", marginBottom: "20px" }}
                        />

                        {/* 하단 버튼 */}
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
