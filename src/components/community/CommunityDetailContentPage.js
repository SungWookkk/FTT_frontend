import { NavLink, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../community/css/CommunityDetailContentPage.css";
import CommunityBoardCreateModal from "./CommunityBoardCreateModal";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";

function CommunityDetailContentPage() {
    const { no } = useParams();
    const { auth } = useAuth();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]); // 초기값은 빈 배열
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        if (!auth.token || !auth.userId) return;

        const fetchData = async () => {
            try {
                // 1) 게시글
                const postRes = await axios.get(
                    `/api/community/posts/${no}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                            "X-User-Id": auth.userId
                        }
                    }
                );
                setPost(postRes.data);

                // 2) 댓글 — setComments 전에 배열 여부 검사
                const commentsRes = await axios.get(
                    `/api/community/posts/${no}/comments`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.token}`,
                            "X-User-Id": auth.userId
                        }
                    }
                );
                const data = commentsRes.data;
                setComments(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setComments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [no, auth.token, auth.userId]);

    if (loading) {
        return <div className="dashboard-content">로딩 중...</div>;
    }
    if (!post) {
        return <div className="dashboard-content">게시글을 불러올 수 없습니다.</div>;
    }

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const handleSavePost = ({ title, content }) => {
        // TODO: 수정 로직
        closeCreateModal();
    };

    return (
        <div className="dashboard-content">
            {/* 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">사용자 커뮤니티</span>
                </div>
                <button className="btn board-create" onClick={openCreateModal}>
                    생성하기
                </button>
            </div>

            {/* 네비게이션 탭 */}
            <div className="list-tap">
                <div className="list-tab-container">
                    <NavLink to="/community" exact className="tab-item" activeClassName="active">메인</NavLink>
                    <NavLink to="/community/board" className="tab-item" activeClassName="active">게시글</NavLink>
                    <NavLink to="/community/my-page" className="tab-item" activeClassName="active">내 작성 관리</NavLink>
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

            {/* 상세 콘텐츠 */}
            <div className="detail-page-layout">
                {/* 게시글 */}
                <div className="detail-post-container">
                    <h1 className="detail-title">{post.title}</h1>
                    <div className="detail-meta">
                        <span>작성자: <strong>{post.authorId}</strong></span>
                        <span>작성일: {new Date(post.createdAt).toISOString().slice(0, 10)}</span>
                        <span>게시글 번호: {post.id}</span>
                    </div>
                    <div className="detail-body">
                        {/* 수정: 언제나 배열이 보장된 후 map 호출 */}
                        {post.content.split("\n").map((line, idx) => (
                            <p key={idx}>{line}</p>
                        ))}
                    </div>
                    <div className="detail-actions">
                        <button className="btn-like">👍 좋아요 <span className="count">{post.likesCount}</span></button>
                        <button className="btn-comment">💬 댓글 ({Array.isArray(comments) ? comments.length : 0})</button>
                    </div>
                </div>

                {/* 댓글 */}
                <div className="detail-comment-container">
                    <h2>댓글 ({Array.isArray(comments) ? comments.length : 0})</h2>
                    <ul className="comment-list">
                        {/* 수정: comments가 배열일 때만 map, 아닐 땐 안내문 표시 */}
                        {Array.isArray(comments) && comments.length > 0 ? (
                            comments.map(c => (
                                <li key={c.id} className="comment-item">
                                    <p>
                                        <strong>{c.authorId}</strong>
                                        ({new Date(c.createdAt).toISOString().slice(0,10)})
                                    </p>
                                    <p>{c.content}</p>
                                </li>
                            ))
                        ) : (
                            <li className="no-comments">등록된 댓글이 없습니다.</li>
                        )}
                    </ul>
                    <div className="comment-input">
                        <textarea placeholder="댓글을 입력하세요..." rows="3"/>
                        <button className="btn-submit">등록</button>
                    </div>
                </div>
            </div>

            {/* 생성 모달 */}
            <CommunityBoardCreateModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onSave={handleSavePost}
            />
        </div>
    );
}

export default CommunityDetailContentPage;
