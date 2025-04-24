import React from 'react';
import '../community/css/CommunityDayHotPost.css';

const hotPosts = [
    { title: '취업 준비를 하려는데 고민이 있습니다. 조언 부탁드려요.', like: 72, dislike: 23 },
    { title: '요즘 AI 기능 어떤가요? 제 생각에는….', like: 68, dislike: 34 },
    { title: '아니 제가 대학교를 졸업을 하고나서….', like: 55, dislike: 13 },
];

const CommunityDayHotPost = () => (
    <div className="chp-box">
        <div className="chp-header">
            <span className="chp-icon">🔥</span>
            <span className="chp-title">주간 Hot 게시글</span>
        </div>
        <ul className="chp-list">
            {hotPosts.map((p, i) => (
                <li key={i} className="chp-item">
                    <div className="chp-item-left">
                        <span className="chp-dot" />
                        <span className="chp-text">{p.title}</span>
                    </div>
                    <div className="chp-item-right">
                        <span className="chp-like">👍 {p.like}</span>
                        <span className="chp-dislike">👎 {p.dislike}</span>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default CommunityDayHotPost;
