import React from 'react';
import '../community/css/CommunityMyContentPage.css';
import {NavLink} from "react-router-dom";

function CommunityMyContentPage() {
    const myPosts = [
        { id: 1, title: '첫 번째 내 작성 게시글', date: '2025.01.15', status: '답변 대기' },
        { id: 2, title: '두 번째 내 작성 게시글', date: '2025.01.10', status: '답변 완료' },
        { id: 3, title: '세 번째 내 작성 게시글', date: '2025.01.05', status: '답변 대기' },
    ];

    return (
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

        <div className="my-content-container">
            <h2 className="my-content-title">내 작성 관리</h2>
            <p className="my-content-subtitle">
                내가 작성한 게시글 목록을 확인하고, 상태를 관리할 수 있습니다.
            </p>

            <div className="my-content-list">
                {myPosts.map(post => (
                    <div key={post.id} className="my-content-item">
                        <div className="item-left">
                            <span className="item-title">{post.title}</span>
                            <span className="item-date">{post.date}</span>
                        </div>
                        <div className="item-right">
              <span className={`item-status ${post.status === '답변 완료' ? 'done' : 'pending'}`}>
                {post.status}
              </span>
                            <button className="item-action">수정</button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}

export default CommunityMyContentPage;