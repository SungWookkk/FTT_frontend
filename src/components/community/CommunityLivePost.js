// src/community/CommunityLivePost.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../Auth/AuthContext";
import defaultUser from "../../Auth/css/img/default-user.svg";
import '../community/css/CommunityLivePost.css';
import { useHistory } from 'react-router-dom';

// ─── 유틸 함수: HTML 태그 제거 ───
function stripHtml(html) {
    return html.replace(/<[^>]+>/g, '');
}

export default function CommunityLivePost() {
    const { auth } = useAuth();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const history = useHistory();

    const perPage = 8;
    const totalPages = Math.ceil(posts.length / perPage);

    // 1) 마운트 시 API 에서 글 + 작성자 정보 가져오기
    useEffect(() => {
        if (!auth.token || !auth.userId) return;

        axios.get('/api/community/posts', {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                'X-User-Id': auth.userId
            }
        })
            .then(res => setPosts(res.data))
            .catch(err => console.error(err));
    }, [auth.token, auth.userId]);

    // 2) 다음 페이지로 슬라이드
    const handleNext = () => {
        if (totalPages <= 1) return;
        setIsSliding(true);
        setTimeout(() => {
            setPage(p => (p + 1) % totalPages);
            setIsSliding(false);
        }, 600);
    };

    // 3) 현재 페이지에 보일 글
    const visible = posts.slice(page * perPage, page * perPage + perPage);

    return (
        <div className="clp-grid-wrapper">
            <div className="clp-grid-container">
                <div className={`clp-grid ${isSliding ? 'sliding' : ''}`}>
                    {visible.map(p => {
                        // 본문에서 HTML 태그를 제거하고 60자 잘라서 preview 생성
                        const text = stripHtml(p.content);
                        const preview = text.length > 60
                            ? text.slice(0, 60) + '…'
                            : text;

                        return (
                            <div
                                key={p.id}
                                className="clp-card clickable"
                                onClick={() => history.push(`/community/board/${p.id}`)}
                            >
                                <p className="clp-title">{p.title}</p>
                                <p className="clp-content">{preview}</p>

                                <div className="clp-footer">
                                    <div className="clp-author">
                                        {p.authorProfileImage
                                            ? <img className="clp-avatar" src={p.authorProfileImage} alt={p.authorName}/>
                                            : <img className="clp-avatar" src={defaultUser} alt="default avatar"/>
                                        }
                                        <span className="clp-author-name">{p.authorName}</span>
                                        {p.authorBadgeImageUrl && (
                                            <img
                                                className="clp-badge"
                                                src={p.authorBadgeImageUrl}
                                                alt="badge"
                                            />
                                        )}
                                    </div>
                                    <div className="clp-stats">
                                        <span className="clp-like">👍 {p.likesCount}</span>
                                        <span className="clp-comment">💬 {p.commentsCount}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {totalPages > 1 && (
                    <button className="clp-next-btn" onClick={handleNext}>
                        →
                    </button>
                )}
            </div>
        </div>
    );
}
