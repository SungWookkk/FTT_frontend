import React, { useState } from "react";
import "./CommunityBestPosts.css";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header"; // 올바른 상대 경로

const CommunityBestPosts = () => {
    const [activePage, setActivePage] = useState(1);

    const posts = [
        { id: 1, title: "자기 관리를 위한 필수 요소에 대한 설명...", date: "2024.12.27", views: 58372, likes: 175, dislikes: 46 },
        { id: 2, title: "제가 지금까지 인생을 살아오며 느낀점이 이거입니다.", date: "2024.11.30", views: 46584, likes: 146, dislikes: 12 },
        { id: 3, title: "이거 디자인을 하면서 느낀건데 창작이 어려워요.", date: "2024.07.17", views: 42158, likes: 89, dislikes: 24 },
        { id: 4, title: "취업 준비를 하려는데 고민이 있습니다. 조언 부탁드려요.", date: "2024.05.25", views: 37845, likes: 72, dislikes: 23 },
    ];

    return (
        <div className="community-page">
            {/* 사이드바 추가 */}
            <Header/>
            <Sidebar />

            {/* 메인 게시판 */}
            <div className="community-best-posts">
                <h2>인기 게시글 - Best 게시글</h2>
                <table className="posts-table">
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>날짜</th>
                        <th>조회</th>
                        <th>공감 수</th>
                    </tr>
                    </thead>
                    <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{post.date}</td>
                            <td>{post.views}</td>
                            <td>{post.likes}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* 페이지네이션 추가 */}
                <div className="pagination">
                    <button onClick={() => setActivePage(Math.max(activePage - 1, 1))}>&laquo;</button>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            className={activePage === num ? "active" : ""}
                            onClick={() => setActivePage(num)}
                        >
                            {num}
                        </button>
                    ))}
                    <button onClick={() => setActivePage(Math.min(activePage + 1, 5))}>&raquo;</button>
                </div>
            </div>
        </div>
    );
};

export default CommunityBestPosts;
