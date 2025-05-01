import React, {useEffect, useState} from "react";
import {NavLink, useHistory} from "react-router-dom";
import "../community/css/CommunityContentPage.css";
import "../community/css/CommunityBestPost.css";
import CommunityBestPost from "./CommunityBestPost";
import CommunityDayHotPost from "./CommunityDayHotPost";
import CommunityBoardCreateModal from "./CommunityBoardCreateModal";
import {useAuth} from "../../Auth/AuthContext";
import axios from "axios";
import CommunityLivePost from "./CommunityLivePost";

function CommunityContentPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const { auth } = useAuth();
    const history = useHistory();
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const handleSavePost = ({ title, content }) => {
        // TODO: axios.post('/api/community/posts', { title, content })
        //       .then(...)
        closeCreateModal();
    };

    useEffect(() => {
            if (!auth.token) return;
            axios.get('/api/community/posts', {
                  headers: { Authorization: `Bearer ${auth.token}`, 'X-User-Id': auth.userId }
            })
            .then(res => {
                  // 조회수 순으로 정렬
                      const sortedByViews = res.data.slice().sort((a,b) => b.viewsCount - a.viewsCount);
                  setAllPosts(sortedByViews);
                })
            .catch(console.error);
          }, [auth.token, auth.userId]);


    return (
        <div className="dashboard-content">
            {/* 작업공간 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">사용자 커뮤니티</span>
                </div>
                {/* 생성하기 버튼 */}
                <button
                    className="btn board-create"
                    onClick={openCreateModal}
                >
                    생성하기
                </button>
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
            {/*  Best 게시글 컴포넌트 */}
            <div className="posts-wrapper">
                <CommunityBestPost
                    posts={allPosts}
                    onSelect={id => history.push(`/community/board/${id}`)}
                />
                <CommunityDayHotPost
                     posts={allPosts}
                     onSelect={id => history.push(`/community/board/${id}`)}
                   />
                 </div>
            <div className="time-post">
                <h1>실시간 게시글</h1>
            </div>
            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text-todo">
                    <span className="highlight-text">실시간</span>
                    <span className="normal-text">으로 </span>
                    <span className="normal-text">작성된 </span>
                    <span className="highlight-text">게시글을 </span>
                    <span className="normal-text">보며, </span>
                    <span className="highlight-text">다른 사용자</span>
                    <span className="normal-text">들이 </span>
                    <span className="highlight-text">무슨 생각</span>
                    <span className="normal-text">을 하는지 확인해 보아요!</span>
                </p>
            </div>
            <CommunityLivePost/>
            <CommunityBoardCreateModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onSave={handleSavePost}
            />
        </div>
    );
}

export default CommunityContentPage;
