import React from 'react';
import '../community/css/CommunityContentPage.css';

const posts = [
    { title: '자기 관리를 위한 필수 요소에 대한 설명……', like: 175, dislike: 46 },
    { title: '제가 지금까지 인생을 살아오며 느낀점이 이거입니다.', like: 146, dislike: 12 },
    { title: '이거 디자인을 하면서 느낀건데 창작이 어려워요.', like: 89, dislike: 24 },
];

const CommunityBestPost = () => (
    <div className="cbp-box">
        <div className="cbp-header">
            <span className="cbp-icon">🔥</span>
            <span className="cbp-title">Best 게시글</span>
        </div>
        <ul className="cbp-list">
            {posts.map((p, i) => (
                <li key={i} className="cbp-item">
                    <div className="cbp-item-left">
                        <span className="cbp-dot" />
                        <span className="cbp-text">{p.title}</span>
                    </div>
                    <div className="cbp-item-right">
                        <span className="cbp-like">👍 {p.like}</span>
                        <span className="cbp-dislike">👎 {p.dislike}</span>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default CommunityBestPost;
