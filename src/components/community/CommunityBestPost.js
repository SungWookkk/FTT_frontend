// src/community/CommunityBestPost.js
import React from 'react';
import '../community/css/CommunityBestPost.css';

/**
 * props.posts: 모든 게시글 배열 (likesCount 기준 정렬되어 있으면 더 좋습니다)
 * props.onSelect: 글 클릭 시 상세페이지로 이동하는 콜백 (id 인자)
 */
const CommunityBestPost = ({ posts = [], onSelect }) => {
    // 좋아요 50개 이상인 글만 필터 → 상위 3개
    const best3 = posts
        .filter(p => p.likesCount >= 50)
        .slice(0, 3);

    return (
        <div className="cbp-box">
            <div className="cbp-header">
                <span className="cbp-icon">🏆</span>
                <span className="cbp-title">Best 게시글</span>
            </div>

            {best3.length === 0 ? (
                <div className="cbp-empty">
                    아직 좋아요가 50개가 넘는 게시글이 없어요!
                </div>
            ) : (
                <ul className="cbp-list">
                    {best3.map(p => (
                        <li
                            key={p.id}
                            className="cbp-item"
                            onClick={() => onSelect(p.id)}
                        >
                            <div className="cbp-item-left">
                                <span className="cbp-dot" />
                                <span className="cbp-text">{p.title}</span>
                            </div>
                            <div className="cbp-item-right">
                                {/* 조회수는 텍스트 */}
                                <span className="cbp-views">조회수 {p.viewsCount}</span>
                                {/* 👍 은 좋아요 수 */}
                                <span className="cbp-like">👍 {p.likesCount}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CommunityBestPost;
