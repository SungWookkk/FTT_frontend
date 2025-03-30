import React, { useEffect, useState } from "react";
import "../profile/css/ProfileCommunity.css";

/**
 * 프로필 페이지 하단에, 사용자가 작성한 커뮤니티 게시글 목록을 보여주는 컴포넌트.
 */


const ProfileCommunity = () => {
    const [username, setUsername] = useState("");



    useEffect(() => {
        // 로그인 시 localStorage에 저장한 username 불러오기
        const storedUsername = localStorage.getItem("userName");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // 'setPosts' 제거하고, 읽기 전용으로만 사용
    const [posts] = useState([
        {
            id: 1,
            title: "React Hooks에 대한 고찰",
            content:
                "React Hooks를 사용하면 함수형 컴포넌트에서도 상태 관리를 간편하게 할 수 있습니다...",
            thumbnail: "https://picsum.photos/id/1011/400/250", // 임시 썸네일
            likes: 42,
            comments: 7,
            createdAt: "2025-03-25",
        },
        {
            id: 2,
            title: "UI/UX 디자인 트렌드 2025",
            content:
                "올해의 디자인 트렌드는 Glassmorphism, Neumorphism, 3D 요소가 주목받고 있습니다...",
            thumbnail: "https://picsum.photos/id/1012/400/250",
            likes: 85,
            comments: 12,
            createdAt: "2025-03-24",
        },
        {
            id: 3,
            title: "비동기 프로그래밍 기초",
            content:
                "JavaScript의 비동기 프로그래밍 패턴인 콜백, 프로미스, async/await 에 대해 알아봅시다...",
            thumbnail: "https://picsum.photos/id/1015/400/250",
            likes: 30,
            comments: 3,
            createdAt: "2025-03-22",
        },
    ]);
    // 만약 실제 서버에서 게시글 목록을 가져온다면 useEffect로 axios 호출
    useEffect(() => {
        // axios.get("/api/community/posts?author=...").then((res) => setPosts(res.data));
    }, []);

    return (
        <div className="profile-community-container">
            <h2 className="profile-community-title">{username}님이 작성한 커뮤니티 게시글</h2>

            <div className="posts-grid">
                {posts.map((post) => (
                    <div className="post-card" key={post.id}>
                        <div className="thumbnail-wrapper">
                            <img src={post.thumbnail} alt={post.title} className="post-thumbnail" />
                        </div>

                        <div className="post-info">
                            <h3 className="post-title">{post.title}</h3>
                            <p className="post-content">{post.content}</p>

                            <div className="post-meta">
                                <div className="post-meta-item">
                                    <i className="fas fa-heart"></i> {post.likes}
                                </div>
                                <div className="post-meta-item">
                                    <i className="fas fa-comment"></i> {post.comments}
                                </div>
                            </div>
                            <span className="post-date">{post.createdAt}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileCommunity;
