import React, { useState } from 'react';
import '../community/css/CommunityBoardCreateModal.css';

/**
 * 게시글 생성 모달
 *
 * Props:
 * - isOpen: boolean, 모달 오픈 여부
 * - onClose: function, 모달 닫기 함수
 * - onSave: function({ title, content }), 저장 시 호출
 */
function CommunityBoardCreateModal({ isOpen, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>새 게시글 작성</h2>
                <div className="modal-body">
                    <label>
                        제목
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                        />
                    </label>
                    <label>
                        내용
                        <textarea
                            rows="6"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                        />
                    </label>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose}>취소</button>
                    <button onClick={handleSave} disabled={!title.trim()}>저장</button>
                </div>
            </div>
        </div>
    );
}
export default CommunityBoardCreateModal;