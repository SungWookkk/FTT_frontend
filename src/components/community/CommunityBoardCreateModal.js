import React, { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../community/css/CommunityBoardCreateModal.css';

const categories = ['전체','공부','운동','코딩','AI','취업','알바','주식'];

export default function CommunityBoardCreateModal({ isOpen, onClose, onSave }) {
    const [category, setCategory] = useState('전체');
    const [title,    setTitle]    = useState('');
    const [body,     setBody]     = useState('');
    const quillRef        = useRef(null);
    const fileInputRef    = useRef(null);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ['bold','italic','underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['image']
            ],
            handlers: {
                image: () => fileInputRef.current.click()
            }
        }
    }), []);

    const formats = useMemo(() => [
        'header',
        'bold','italic','underline',
        'list','bullet',
        'image'
    ], []);

    // ─── 모든 훅 끝난 뒤에 조건부 렌더링 ───
    if (!isOpen) return null;

    const handleImageUpload = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', ev.target.result);
            quill.setSelection(range.index + 1);
        };
        reader.readAsDataURL(file);
        e.target.value = null;
    };

    const handleSave = () => {
        onSave({ category, title, content: body });
        setCategory('전체');
        setTitle('');
        setBody('');
    };

    return (
        <div
            className="cbcm-overlay"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="cbcm-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="cbcm-header">
                    <h2>새 게시글 작성</h2>
                </div>

                {/* Body */}
                <div className="cbcm-body">
                    {/* 카테고리 */}
                    <div className="cbcm-field-group">
                        <label>카테고리</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* 제목 */}
                    <div className="cbcm-field-group">
                        <label>제목</label>
                        <input
                            type="text"
                            value={title}
                            placeholder="제목을 입력하세요"
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    {/* 본문 */}
                    <div className="cbcm-field-group">
                        <label>본문</label>
                        <ReactQuill
                            ref={quillRef}
                            value={body}
                            onChange={setBody}
                            modules={modules}
                            formats={formats}
                            placeholder="내용을 입력하세요"
                            theme="snow"
                            className="cbcm-editor"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="cbcm-footer">
                    <button className="cbcm-btn cbcm-cancel" onClick={onClose}>
                        취소
                    </button>
                    <button
                        className="cbcm-btn cbcm-save"
                        onClick={handleSave}
                        disabled={!title.trim()}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
