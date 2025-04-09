import React, { useState } from "react";
import axios from "axios";
import "../team/css/TeamReadingListModal.css";

function TeamReadingListModal({ teamId, onClose, onSave }) {
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // 모든 필드 입력 확인
        if (!category || !title || !link) {
            setError("모든 필드를 입력해주세요.");
            return;
        }
        setError("");

        // 새 읽기 자료 항목 생성
        const newItem = { category, title, link };
        axios
            .post(`/api/team/${teamId}/readingList`, newItem)
            .then((res) => {
                // onSave 콜백으로 부모에 변경 알림 (필요시 읽기 자료 전체를 재갱신)
                if (onSave) onSave(res.data);
                onClose();
            })
            .catch((err) => {
                console.error("읽기 자료 생성 오류:", err);
                setError("읽기 자료 생성에 실패했습니다.");
            });
    };

    return (
        <div className="reading-modal-overlay" onClick={onClose}>
            <div
                className="reading-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close-btn" onClick={onClose}>
                    ×
                </button>
                <h3>새 읽기 자료 작성</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group1">
                        <label htmlFor="category">카테고리</label>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="예: AWS, BackEnd 등"
                        />
                    </div>
                    <div className="form-group1">
                        <label htmlFor="title">제목</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="자료 제목을 입력하세요"
                        />
                    </div>
                    <div className="form-group1">
                        <label htmlFor="link">링크</label>
                        <input
                            type="text"
                            id="link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="자료 링크를 입력하세요"
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="modal-actions">
                        <button type="submit" className="save-btn">
                            저장
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TeamReadingListModal;
