import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../community/css/CommunityBoardContentPage.css';
import { NavLink, useHistory } from "react-router-dom";
import CommunityBoardCreateModal from "./CommunityBoardCreateModal";
import { useAuth } from "../../Auth/AuthContext";
import defaultUser from "../../Auth/css/img/default-user.svg";

function CommunityBoardContentPage() {
    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const categories = ['전체','공부','운동','코딩','AI','취업','알바','주식'];
    const [currentCategory, setCurrentCategory] = useState('전체');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState('');
    const { auth } = useAuth();


    // 1) 서버에서 게시글 가져오기 (useCallback으로 감싸 ESLint 경고 해소)
    const fetchPosts = useCallback((category = '전체') => {
        if (!auth.token) return;
        const params = category !== '전체' ? `?category=${category}` : '';
        axios.get(`/api/community/posts${params}`, {
            headers: { Authorization: `Bearer ${auth.token}`, 'X-User-Id': auth.userId }
        })
            .then(res => setPosts(res.data))
            .catch(console.error);
    }, [auth.token, auth.userId]);
// 카테고리 버튼 클릭 핸들러
    const onCategorySelect = (cat) => {
        setCurrentCategory(cat);
        fetchPosts(cat);
    };

// useEffect → fetchPosts(currentCategory)
    useEffect(() => {
        fetchPosts(currentCategory);
    }, [currentCategory, fetchPosts]);

    // 3) 탭별/카테고리별/페이징 처리
    const filteredByTab = (() => {
        switch (tab) {
            case 'best':
                return posts.filter(p => p.likesCount >= 50);
            case 'hot':
                return [...posts].sort((a, b) => b.viewsCount - a.viewsCount);
            case 'recent':
            default:
                return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    })();


        // 3-1) 카테고리 필터
            let filtered = currentCategory === '전체'
            ? filteredByTab
               : filteredByTab.filter(p => p.category === currentCategory);

            // 3-2) 검색어 필터 (제목, 본문, 작성자)
                if (searchTerm.trim()) {
              const kw = searchTerm.toLowerCase();
              filtered = filtered.filter(p =>
                    p.title.toLowerCase().includes(kw) ||
                    p.content.toLowerCase().includes(kw) ||
                    p.authorName.toLowerCase().includes(kw)
                  );
            }

    const rowsPerPage = 12;
    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage;
    const visibleRows = filtered.slice(start, start + rowsPerPage);

    const goPrev = () => setCurrentPage(p => Math.max(1, p - 1));
    const goNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
    const onRowClick = id => history.push(`/community/board/${id}`);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    // 4) 새 글 저장 → 목록 갱신
    const handleSavePost = ({ title, content, category }) => {
        axios.post('/api/community/posts',
            { title, content, category },
            {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    'X-User-Id': auth.userId
                }
            }
        )
            .then(() => {
                closeCreateModal();
                fetchPosts();
            })
            .catch(err => console.error(err));
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

            {/* 탭 네비게이션 */}
            <div className="list-tap">
                <div className="list-tab-container">
                    <NavLink to="/community" exact className="tab-item" activeClassName="active">
                        메인
                    </NavLink>
                    <NavLink to="/community/board" className="tab-item" activeClassName="active">
                        게시글
                    </NavLink>
                    <NavLink to="/community/my-page" className="tab-item" activeClassName="active">
                        내 작성 관리
                    </NavLink>
                </div>
            </div>

            {/* 안내 배너 */}
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

            {/* 게시글 테이블 */}
            <div className="board-container">
                <div className="board-tabs">
                    {['recent','best','hot'].map(t => (
                        <button
                            key={t}
                            className={`board-tab ${tab===t ? 'active' : ''}`}
                            onClick={() => { setTab(t); setCurrentPage(1); }}
                        >
                            {t==='recent' ? '최신 게시글' : t==='best' ? 'Best 게시글' : '주간 Hot 게시글'}
                        </button>
                    ))}
                </div>

                <div className="board-subheader">
                    <p className="board-subtitle">
                        {tab==='recent' && '실시간으로 올라오는 순서대로 정렬됩니다.'}
                        {tab==='best' && '좋아요 50개 이상 게시글만 표시됩니다.'}
                        {tab==='hot' && '조회수 순으로 정렬됩니다.'}
                    </p>
                    <div className="category-btn-wrapper">
                    {categories.map(cat => (
                                   <button
                                       key={cat}
                                       className={`modal-category-btn ${cat===currentCategory?'selected':''}`}
                                       onClick={() => {
                                           setCurrentPage(1);
                                           onCategorySelect(cat);
                                       }}
                                   >
                                       {cat}
                                   </button>
                               ))}
                    </div>
                                        <div className="search-wrapper2">
                                          <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                            placeholder="제목·내용·작성자 검색..."
                                            className="search-input2"
                                          />
                                        </div>
                </div>

                <div className="board-table-wrapper">
                    <table className="board-table">
                        <thead>
                        <tr>
                            <th>번호</th>
                            <th>등급</th>
                            <th>작성자</th>
                            <th>제목</th>
                            <th>날짜</th>
                            <th>조회</th>
                            <th>공감 수</th>
                        </tr>
                        </thead>
                        <tbody>
                        {visibleRows.map(row => (
                            <tr
                                key={row.id}
                                className="clickable-row"
                                onClick={() => onRowClick(row.id)}
                            >
                                <td>{row.id}</td>

                                <td className="grade-cell">
                                    {row.authorBadgeImageUrl
                                        ? <img
                                            src={row.authorBadgeImageUrl}
                                            alt="badge"
                                            className="badge-icon1"
                                        />
                                        : <span>–</span>
                                    }
                                </td>
                                <td className="writer-cell">
                                    <img
                                        src={row.authorProfileImage || defaultUser}
                                        alt="avatar"
                                        className="avatar-img-sm"
                                    />
                                    <span className="writer-name">{row.authorName}</span>
                                </td>
                                <td className="title-cell">{row.title}</td>
                                <td>{new Date(row.createdAt).toISOString().slice(0, 10)}</td>
                                <td>{row.viewsCount}</td>
                                <td>👍 {row.likesCount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="board-pagination">
                        <button onClick={goPrev} disabled={currentPage === 1}>&lt;</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i+1}
                                className={currentPage===i+1 ? 'active' : ''}
                                onClick={() => setCurrentPage(i+1)}
                            >
                                {i+1}
                            </button>
                        ))}
                        <button onClick={goNext} disabled={currentPage===totalPages}>&gt;</button>
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

export default CommunityBoardContentPage;
