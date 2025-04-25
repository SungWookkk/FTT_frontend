import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../community/css/CommunityMyContentPage.css';
import { NavLink } from 'react-router-dom';

function CommunityMyContentPage() {
    // 1) 내 게시글 데이터
    const sortedPosts = useMemo(() => {
        const posts = [
            { id: 1, title: '첫 번째 내 작성 게시글', date: '2025.01.15' },
            { id: 2, title: '두 번째 내 작성 게시글', date: '2025.01.10' },
            { id: 3, title: '세 번째 내 작성 게시글', date: '2025.01.05' },
            { id: 4, title: '네 번째 내 작성 게시글', date: '2025.01.04' },
            { id: 5, title: '다섯 번째 내 작성 게시글', date: '2025.01.03' },
            { id: 6, title: '여섯 번째 내 작성 게시글', date: '2025.01.02' },
            { id: 7, title: '일곱 번째 내 작성 게시글', date: '2025.01.01' },
            { id: 7, title: '일곱 번째 내 작성 게시글', date: '2025.01.01' },
            { id: 7, title: '일곱 번째 내 작성 게시글', date: '2025.01.01' },
            { id: 7, title: '일곱 번째 내 작성 게시글', date: '2025.01.01' },
        ];
        return posts.sort((a, b) => new Date(b.date.replace(/\./g,'-')) - new Date(a.date.replace(/\./g,'-')));
    }, []);

    // 2) 내 댓글 데이터
    const myComments = useMemo(() => [
        { id: 1, content: '첫 번째 내 작성 댓글', date: '2025.01.14' },
        { id: 2, content: '두 번째 내 작성 댓글', date: '2025.01.12' },
        { id: 3, content: '세 번째 내 작성 댓글', date: '2025.01.10' },
        { id: 4, content: '네 번째 내 작성 댓글', date: '2025.01.08' },
        { id: 5, content: '다섯 번째 내 작성 댓글', date: '2025.01.05' },
    ], []);

    // 3) 내가 좋아요 누른 게시글
    const myLikedPosts = useMemo(() => [
        { id: 1, title: '첫 번째 좋아요 누른 게시글', date: '2025.01.13' },
        { id: 2, title: '두 번째 좋아요 누른 게시글', date: '2025.01.11' },
        { id: 3, title: '세 번째 좋아요 누른 게시글', date: '2025.01.09' },
        { id: 4, title: '네 번째 좋아요 누른 게시글', date: '2025.01.07' },
        { id: 5, title: '다섯 번째 좋아요 누른 게시글', date: '2025.01.05' },
    ], []);

    // 검색어 상태 분리
    const [postSearch, setPostSearch] = useState('');
    const [commentSearch, setCommentSearch] = useState('');
    const [likedSearch, setLikedSearch] = useState('');

    // 필터링 로직 분리
    const filteredPosts = useMemo(() => {
        const term = postSearch.trim().toLowerCase();
        if (!term) return sortedPosts;
        return sortedPosts.filter(p =>
            p.title.toLowerCase().includes(term) ||
            p.date.includes(term)
        );
    }, [postSearch, sortedPosts]);

    const filteredComments = useMemo(() => {
        const term = commentSearch.trim().toLowerCase();
        if (!term) return myComments;
        return myComments.filter(c =>
            c.content.toLowerCase().includes(term) ||
            c.date.includes(term)
        );
    }, [commentSearch, myComments]);

    const filteredLiked = useMemo(() => {
        const term = likedSearch.trim().toLowerCase();
        if (!term) return myLikedPosts;
        return myLikedPosts.filter(l =>
            l.title.toLowerCase().includes(term) ||
            l.date.includes(term)
        );
    }, [likedSearch, myLikedPosts]);

    // 무한스크롤: 게시글만
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const listRef = useRef(null);
    const loadMoreRef = useRef(null);

    // 페이지 리셋: 게시글 검색어만
    useEffect(() => setPage(1), [postSearch]);

    // Intersection Observer: 게시글 리스트에만 적용
    useEffect(() => {
        if (!listRef.current || !loadMoreRef.current) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && page * pageSize < filteredPosts.length) {
                    setPage(p => p + 1);
                }
            },
            { root: listRef.current, threshold: 1.0 }
        );
        obs.observe(loadMoreRef.current);
        return () => obs.disconnect();
    }, [filteredPosts.length, page]);

    const displayedPosts = filteredPosts.slice(0, page * pageSize);

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

            <div className="my-content-wrapper">
                {/* 1) 내 작성 게시글 */}
                <div className="my-content-container">
                    <div className="my-content-header">
                        <h2 className="my-content-title">내 작성 관리</h2>
                        <p className="my-content-subtitle">
                            내가 작성한 게시글 목록을 확인하고 관리할 수 있습니다.
                        </p>
                    </div>

                    {/* 2) 구분선 섹션 헤더 */}
                    <div
                        className="section-header3"
                        style={{ borderBottom: '5px solid rgb(52, 152, 219)' }}
                    >
                    </div>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="제목 또는 날짜로 검색..."
                            value={postSearch}
                            onChange={e => setPostSearch(e.target.value)}
                        />
                    </div>
                    <div className="my-content-list" ref={listRef}>
                        {displayedPosts.map(p => (
                            <div key={p.id} className="my-content-item">
                                <span className="item-title">{p.title}</span>
                                <span className="item-date">{p.date}</span>
                            </div>
                        ))}
                        <div ref={loadMoreRef} className="load-sentinel" />
                    </div>
                </div>

                {/* 2) 내 작성 댓글 */}
                <div className="my-content-container">
                    <div className="my-content-header">
                        <h2 className="my-content-title">내 작성 댓글</h2>
                        <p className="my-content-subtitle">
                            내가 작성한 댓글 목록을 확인하고 관리할 수 있습니다.
                        </p>
                    </div>

                    {/* 2) 구분선 섹션 헤더 */}
                    <div
                        className="section-header3"
                        style={{ borderBottom: '5px solid rgb(39, 174, 96)' }}
                    >
                    </div>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="댓글 내용 또는 날짜로 검색..."
                            value={commentSearch}
                            onChange={e => setCommentSearch(e.target.value)}
                        />
                    </div>
                    <div className="my-content-list" style={{ maxHeight: '50vh' }}>
                        {filteredComments.map(c => (
                            <div key={c.id} className="my-content-item">
                                <span className="item-title">{c.content}</span>
                                <span className="item-date">{c.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3) 내가 좋아요 누른 게시글 */}
                <div className="my-content-container">
                    <div className="my-content-header">
                        <h2 className="my-content-title">내가 좋아요 누른 게시글</h2>
                        <p className="my-content-subtitle">
                            내가 좋아요를 누른 게시글 목록을 확인하고 관리할 수 있습니다.
                        </p>
                    </div>

                    {/* 2) 구분선 섹션 헤더 */}
                    <div
                        className="section-header3"
                        style={{ borderBottom: '5px solid rgb(231, 76, 60)' }}
                    >
                    </div>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="제목 또는 날짜로 검색..."
                            value={likedSearch}
                            onChange={e => setLikedSearch(e.target.value)}
                        />
                    </div>
                    <div className="my-content-list" style={{ maxHeight: '50vh' }}>
                        {filteredLiked.map(l => (
                            <div key={l.id} className="my-content-item">
                                <span className="item-title">{l.title}</span>
                                <span className="item-date">{l.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommunityMyContentPage;
