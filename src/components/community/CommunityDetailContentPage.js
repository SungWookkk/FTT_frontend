// src/community/CommunityDetailContentPage.js
import { NavLink, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../community/css/CommunityDetailContentPage.css";
import CommunityBoardCreateModal from "./CommunityBoardCreateModal";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";
import defaultUser from "../../Auth/css/img/default-user.svg"; // 기본 프로필 이미지

function CommunityDetailContentPage() {
    const { no } = useParams();
    const { auth } = useAuth();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyInputs, setReplyInputs] = useState({});
    const [replyBoxOpen, setReplyBoxOpen] = useState({});
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [liked, setLiked] = useState(false);

    // 게시글 + 댓글 트리 로드
    useEffect(() => {
        if (!auth.token || !auth.userId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 게시글
                const postRes = await axios.get(
                    `/api/community/posts/${no}`,
                    { headers: { Authorization: `Bearer ${auth.token}`, "X-User-Id": auth.userId } }
                );
                setPost(postRes.data);

                // 댓글 + 대댓글
                const commentsRes = await axios.get(
                    `/api/community/posts/${no}/comments`,
                    { headers: { Authorization: `Bearer ${auth.token}`, "X-User-Id": auth.userId } }
                );
                setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [no, auth.token, auth.userId]);


    const renderAuthorName = (authorId) =>
        authorId === auth.userId ? auth.userName : authorId;

    // 최상위 댓글 등록
    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        setLoading(true);
        try {
            await axios.post(
                `/api/community/posts/${no}/comments`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${auth.token}`, "X-User-Id": auth.userId } }
            );
            setNewComment("");
            const res = await axios.get(`/api/community/posts/${no}/comments`, {
                headers: { Authorization: `Bearer ${auth.token}`, "X-User-Id": auth.userId }
            });
            setComments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 대댓글 토글
    const toggleReply = (id) => {
        setReplyBoxOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // 대댓글 입력값 관리
    const handleReplyChange = (id, value) => {
        setReplyInputs(prev => ({ ...prev, [id]: value }));
    };

    // 대댓글 등록
    const handleReplySubmit = async (parentId) => {
        const text = (replyInputs[parentId] || "").trim();
        if (!text) return;
        setLoading(true);
        try {
            await axios.post(
                `/api/community/posts/${no}/comments`,
                { content: text },
                {
                    params: { parentId },
                    headers: { Authorization: `Bearer ${auth.token}`, "X-User-Id": auth.userId }
                }
            );
            setReplyInputs(prev => ({ ...prev, [parentId]: "" }));
            setReplyBoxOpen(prev => ({ ...prev, [parentId]: false }));
            const res = await axios.get(`/api/community/posts/${no}/comments`, {
                headers: { Authorization: `Bearer ${auth.token}`, "X-User-Id": auth.userId }
            });
            setComments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // **새로 추가**: 좋아요 버튼 클릭 시 호출
    const handleLikeToggle = async () => {
        try {
            const res = await axios.post(
                `/api/community/posts/${no}/like`,
                {},
                { headers: { Authorization: `Bearer ${auth.token}`, "X-User-Id": auth.userId } }
            );
            const { likesCount, liked: nowLiked } = res.data;
            setPost(p => ({ ...p, likesCount }));
            setLiked(nowLiked);
            window.alert(nowLiked ? "좋아요를 하였습니다!" : "좋아요를 취소하였습니다!");
        } catch (err) {
            console.error("좋아요 처리 실패", err);
            window.alert("좋아요 처리 중 오류가 발생했습니다.");
        }
    };


    if (loading) return <div className="dashboard-content">로딩 중...</div>;
    if (!post) return <div className="dashboard-content">게시글을 불러올 수 없습니다.</div>;

    return (
        <div className="dashboard-content">
            {/* 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">사용자 커뮤니티</span>
                </div>
                <button className="btn board-create" onClick={() => setIsCreateModalOpen(true)}>
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

            {/* 게시글 + 댓글 레이아웃 */}
            <div className="detail-page-layout">
                <div className="detail-post-container">
                    <h1 className="detail-title">{post.title}</h1>
                    <div className="detail-meta">
                        <img
                            src={post.authorProfileImage || defaultUser}
                            alt="avatar"
                            className="avatar-placeholder"
                        />
                        {post.authorBadgeImageUrl && (
                            <img
                                src={post.authorBadgeImageUrl}
                                alt="badge"
                                className="badge-icon-lg"
                            />
                        )}
                        <div className="post-info">
                        <span>작성자: <strong>{renderAuthorName(post.authorName)}</strong></span>
                        <span>작성일: {new Date(post.createdAt).toISOString().slice(0, 10)}</span>
                        <span>번호: {post.id}</span>
                        </div>
                    </div>
                    <div className="detail-body">
                        {post.content.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                    <div className="detail-actions">
                        {/* 좋아요 토글 버튼 */}
                        <button
                            className="btn-like"
                            onClick={handleLikeToggle}
                            style={{background: liked ? "#e57373" : undefined}}
                        >
                            👍 {post.likesCount}
                        </button>
                        <button className="btn-comment">💬 {comments.length}</button>
                    </div>
                </div>

                <div className="detail-comment-container">
                    <h2>댓글 ({comments.length})</h2>
                    <ul className="comment-list">
                        {comments.map(c => (
                            <li key={c.id} className="comment-item">
                                <div className="comment-header">
                                    <img
                                        src={c.authorProfileImage || defaultUser}
                                        alt="avatar"
                                        className="avatar-placeholder"
                                    />
                                    {c.authorBadgeUrl && (
                                        <img
                                            src={c.authorBadgeUrl}
                                            alt="badge"
                                            className="badge-icon-lg"
                                        />
                                    )}
                                    <div className="comment-meta-info">
                                        <span className="comment-author">{renderAuthorName(c.authorName)}</span>
                                        <span className="comment-time">{new Date(c.createdAt).toLocaleString()}</span>
                                    </div>
                                    <button
                                        className="reply-toggle-btn"
                                        onClick={() => toggleReply(c.id)}
                                    >
                                        답글
                                    </button>
                                </div>
                                <p className="comment-text">{c.content}</p>

                                {replyBoxOpen[c.id] && (
                                    <div className="reply-box">
                    <textarea
                        rows={2}
                        placeholder="대댓글을 입력하세요..."
                        value={replyInputs[c.id] || ""}
                        onChange={e => handleReplyChange(c.id, e.target.value)}
                    />
                                        <button
                                            className="reply-submit-btn"
                                            onClick={() => handleReplySubmit(c.id)}
                                        >
                                            등록
                                        </button>
                                    </div>
                                )}

                                {c.replies?.length > 0 && (
                                    <ul className="reply-list">
                                        {c.replies.map(r => (
                                            <li key={r.id} className="reply-item">
                                                <div className="reply-header">
                                                    <img
                                                        src={r.authorProfileImage || defaultUser}
                                                        alt="avatar"
                                                        className="reply-avatar"
                                                    />
                                                    {r.authorBadgeUrl && (
                                                        <img
                                                            src={r.authorBadgeUrl}
                                                            alt="badge"
                                                            className="badge-icon-lg"
                                                        />
                                                    )}
                                                    <div className="reply-meta-info">
                                                        <span
                                                            className="reply-author">{renderAuthorName(r.authorName)}</span>
                                                        <span
                                                            className="reply-time">{new Date(r.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <p className="reply-text">{r.content}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="comment-input">
            <textarea
                rows={3}
                placeholder="댓글을 입력하세요..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
            />
                        <button className="comment-submit-btn" onClick={handleCommentSubmit}>
                            등록
                        </button>
                    </div>
                </div>
            </div>

            <CommunityBoardCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}

export default CommunityDetailContentPage;
