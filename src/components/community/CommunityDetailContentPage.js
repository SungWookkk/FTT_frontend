import {NavLink, useParams} from "react-router-dom";
import React from "react";
import "../community/css/CommunityDetailContentPage.css"
function CommunityDetailContentPage() {
    const { no } = useParams(); // 경로에서 게시글 번호 추출
    const post = {
                no,
                title: `${no}번 게시글 제목 예시`,
                author: "작성자 닉네임",
                date: "2025.01.02",
                content: `이곳에 게시글 본문이 들어갑니다. 
        여러 줄의 내용이 표시될 수 있도록 적절히 줄바꿈 처리해주세요. 
        여러 줄의 내용이 표시될 수 있도록 적절히 줄바꿈 처리해주세요. 
        여러 줄의 내용이 표시될 수 있도록 적절히 줄바꿈 처리해주세요. 
        여러 줄의 내용이 표시될 수 있도록 적절히 줄바꿈 처리해주세요. 
        여러 줄의 내용이 표시될 수 있도록 적절히 줄바꿈 처리해주세요. 
        여러 줄의 내용이 표시될 수 있도록 적절히 줄바꿈 처리해주세요. 
        여러 줄의 내용이 표시될 수 있도록 적절히 줄바꿈 처리해주세요. 
        여러 줄의 내용이 표시될 수 있도록 적절히 줄바꿈 처리해주세요. 
        여러 줄의 내용이 표시될 수 있도록 적절히 줄바꿈 처리해주세요. 
        이미지나 링크, 코드 블록 등도 이 영역에 표시할 수 있습니다.`
            };

    const likeCount = 12;

    const comments = [
        { id: 1, author: "댓글작성자1", date: "2025.01.02", content: "첫 번째 댓글 예시asdasdasdssssssssssssss입니다." },
        { id: 1, author: "댓글작성자1", date: "2025.01.02", content: "첫 번째 댓글 예시asdasdasdssssssssssssss입니다." },
        { id: 1, author: "댓글작성자1", date: "2025.01.02", content: "첫 번째 댓글 예시asdasdasdssssssssssssss입니다." },
        { id: 2, author: "댓글작성자2", date: "2025.01.03", content: "두 번째 댓글 예시입니다." },
    ];

    return(
        <div className="dashboard-content">
            {/* 작업공간 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">사용자 커뮤니티</span>
                </div>
            </div>

            {/* 목록 선택 탭 */}
            <div className="list-tap">
                <div className="list-tab-container">
                    <NavLink
                        to="/community"
                        exact
                        className="tab-item"
                        activeClassName="active"
                    >
                        메인
                    </NavLink>

                    <NavLink
                        to="/community/board"
                        className="tab-item"
                        activeClassName="active"
                    >
                        게시글
                    </NavLink>

                    <NavLink
                        to="/community/my-page"
                        className="tab-item"
                        activeClassName="active"
                    >
                        내 작성 관리
                    </NavLink>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text-todo">
                    <span className="normal-text">다른 사용자와 </span>
                    <span className="highlight-text">소통하는 공간 </span>
                    <span className="normal-text">입니다! </span>
                    <span className="highlight-text">서로</span>
                    <span className="normal-text">를 </span>
                    <span className="highlight-text">응원</span>
                    <span className="normal-text">하고 </span>
                    <span className="highlight-text">격려</span>
                    <span className="normal-text">하며, </span>
                    <span className="highlight-text">목표</span>
                    <span className="normal-text">를 이루어 보아요! </span>
                </p>
            </div>
            {/* 2단 레이아웃 */}
            <div className="detail-page-layout">
                {/* 왼쪽: 게시물 */}
                <div className="detail-post-container">
                    <h1 className="detail-title">{post.title}</h1>
                    <div className="detail-meta">
                        <span>작성자: <strong>{post.author}</strong></span>
                        <span>작성일: {post.date}</span>
                        <span>게시글 번호: {post.no}</span>
                    </div>
                    <div className="detail-body">
                        {post.content.split("\n").map((line, idx) => (
                            <p key={idx}>{line}</p>
                        ))}
                    </div>
                    <div className="detail-actions">
                        <button className="btn-like">
                            👍 좋아요 <span className="count">{likeCount}</span>
                        </button>
                        <button className="btn-comment">
                            💬 댓글 달기
                        </button>
                    </div>
                </div>

                {/* 오른쪽: 댓글 */}
                <div className="detail-comment-container">
                    <h2>댓글 ({comments.length})</h2>
                    <ul className="comment-list">
                        {comments.map(c => (
                            <li key={c.id} className="comment-item">
                                <p><strong>{c.author}</strong> ({c.date})</p>
                                <p>{c.content}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="comment-input">
                        <textarea placeholder="댓글을 입력하세요..." rows="3" />
                        <button className="btn-submit">등록</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommunityDetailContentPage;