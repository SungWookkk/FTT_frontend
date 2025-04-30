import React from 'react';
import '../community/css/CommunityDayHotPost.css';

/**
 * props.posts: 조회수 기준으로 이미 정렬된 게시글 배열
 * props.onSelect: 클릭 시 상세페이지로 이동할 때 호출되는 콜백 (id 인자)
 */
const CommunityDayHotPost = ({ posts, onSelect }) => {
    // 상위 3개만
    const hot3 = posts.slice(0, 3);

    return (
        <div className="chp-box">
            <div className="chp-header">
                <span className="chp-icon">🔥</span>
                <span className="chp-title">주간 Hot 게시글</span>
            </div>
            <ul className="chp-list">
                {hot3.map(p => (
                    <li
                        key={p.id}
                        className="chp-item"
                        onClick={() => onSelect(p.id)}
                    >
                        <div className="chp-item-left">
                            <span className="chp-dot" />
                            <span className="chp-text">{p.title}</span>
                        </div>
                        <div className="chp-item-right">
                            <span className="chp-like">👍 {p.viewsCount}</span>
                            <span className="chp-dislike">👎 {p.likesCount}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommunityDayHotPost;
