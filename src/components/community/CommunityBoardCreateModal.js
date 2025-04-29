// src/community/CommunityBoardCreateModal.js
import React, { useState } from 'react';
import '../community/css/CommunityBoardCreateModal.css';

const categories = ['전체','공부','운동','코딩','AI','취업','알바','주식'];

function CommunityBoardCreateModal({ isOpen, onClose, onSave }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('전체');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ title, content, category });
        setTitle(''); setContent(''); setCategory('전체');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>새 게시글 작성</h2>
                <div className="modal-body">
                    <label>
                        카테고리
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </label>
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
