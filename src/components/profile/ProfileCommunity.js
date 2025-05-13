    // src/profile/ProfileCommunity.jsx
    import React, { useEffect, useState } from "react";
    import axios from "axios";
    import "../profile/css/ProfileCommunity.css";

    // ─── 유틸 함수: HTML 태그 전부 제거 ───
    function stripHtml(html) {
        return html.replace(/<[^>]+>/g, "");
    }

    const ProfileCommunity = ({ userId }) => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!userId) return;
            setLoading(true);
            axios
                .get(`/api/community/posts/author/${userId}`)
                .then(res => setPosts(res.data))
                .catch(err => {
                    console.error("커뮤니티 게시글 불러오기 실패:", err);
                    setPosts([]);
                })
                .finally(() => setLoading(false));
        }, [userId]);

        if (loading) {
            return <div className="profile-community-container">게시글을 불러오는 중…</div>;
        }

        const visiblePosts = posts.slice(0, 3);

        return (
            <div className="profile-community-container">
                {visiblePosts.length === 0 ? (
                    <div className="no-posts">작성된 게시글이 없습니다.</div>
                ) : (
                    <>
                        <h2 className="profile-community-title">
                            {visiblePosts[0].authorName}님이 작성한 커뮤니티 게시글
                        </h2>

                        <div className="posts-grid">
                            {visiblePosts.map(post => {
                                // HTML 태그 제거 후 순수 텍스트만 표시
                                const contentText = stripHtml(post.content);

                                return (
                                    <div className="post-card" key={post.id}>
                                        <div className="thumbnail-wrapper">
                                            {post.authorProfileImage ? (
                                                <img
                                                    src={post.authorProfileImage}
                                                    alt={post.title}
                                                    className="post-thumbnail"
                                                />
                                            ) : (
                                                <div className="no-thumbnail">이미지가 없습니다.</div>
                                            )}
                                        </div>
                                        <div className="post-info">
                                            <h3 className="post-title">{post.title}</h3>
                                            <p className="post-content">{contentText}</p>

                                            <div className="post-meta">
                                                <div className="post-meta-item">
                                                    <i className="fas fa-heart meta-icon" />
                                                    <div className="meta-number">{post.likesCount}</div>
                                                    <div className="meta-label">좋아요</div>
                                                </div>
                                                <div className="post-meta-item">
                                                    <i className="fas fa-comment meta-icon" />
                                                    <div className="meta-number">{post.commentsCount}</div>
                                                    <div className="meta-label">댓글</div>
                                                </div>
                                                <div className="post-meta-item">
                                                    <i className="fas fa-eye meta-icon" />
                                                    <div className="meta-number">{post.viewsCount}</div>
                                                    <div className="meta-label">조회</div>
                                                </div>
                                            </div>

                                            <div className="post-date">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        );
    };

    export default ProfileCommunity;
