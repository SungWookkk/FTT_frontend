import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../community/css/CommunityMyContentPage.css';
import { NavLink } from 'react-router-dom';

function CommunityMyContentPage() {
    const sortedPosts = useMemo(() => {
        const posts = [
            { id: 1, title: '첫 번째 내 작성 게시글', date: '2025.01.15', status: '답변 대기' },
            { id: 2, title: '두 번째 내 작성 게시글', date: '2025.01.10', status: '답변 완료' },
            { id: 3, title: '세 번째 내 작성 게시글', date: '2025.01.05', status: '답변 대기' },
            { id: 4, title: '네 번째 내 작성 게시글', date: '2025.01.04', status: '답변 완료' },
            { id: 5, title: '다섯 번째 내 작성 게시글', date: '2025.01.03', status: '답변 대기' },
            { id: 6, title: '여섯 번째 내 작성 게시글', date: '2025.01.02', status: '답변 완료' },
            { id: 7, title: '일곱 번째 내 작성 게시글', date: '2025.01.01', status: '답변 대기' },
            { id: 7, title: '일곱 번째 내 작성 게시글', date: '2025.01.01', status: '답변 대기' },
            { id: 7, title: '일곱 번째 내 작성 게시글', date: '2025.01.01', status: '답변 대기' },
            { id: 7, title: '일곱 번째 내 작성 게시글', date: '2025.01.01', status: '답변 대기' },
        ];
        // 날짜 내림차순 정렬
        return posts.sort((a, b) => {
            const da = new Date(a.date.replace(/\./g, '-'));
            const db = new Date(b.date.replace(/\./g, '-'));
            return db - da;
        });
    }, []);

    // 2) 검색어 상태
    const [searchTerm, setSearchTerm] = useState('');

    // 3) 검색어 기반 필터링
    const filteredPosts = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return sortedPosts;
        return sortedPosts.filter(p =>
            p.title.toLowerCase().includes(term) ||
            p.date.includes(term)
        );
    }, [searchTerm, sortedPosts]);

    // 페이지 사이즈 & 페이지
    const pageSize = 5;
    const [page, setPage] = useState(1);

    // Intersection Observer refs
    const listRef = useRef(null);
    const loadMoreRef = useRef(null);

    // 4) 검색어가 바뀌면 페이지 리셋
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    // 5) Intersection Observer: 컨테이너 바닥에 닿으면 page++
    useEffect(() => {
        if (!listRef.current || !loadMoreRef.current) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && page * pageSize < filteredPosts.length) {
                    setPage(p => p + 1);
                }
            },
            {
                root: listRef.current,
                threshold: 1.0,
            }
        );
        obs.observe(loadMoreRef.current);
        return () => obs.disconnect();
    }, [filteredPosts.length, page]);

    // 6) 실제 화면에 보여줄 게시글
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

            <div className="my-content-container">
                <div className="my-content-header">
                    <h2 className="my-content-title">내 작성 관리</h2>
                    <p className="my-content-subtitle">
                        내가 작성한 게시글 목록, 작성한 댓글을 확인하고 상태를 관리할 수 있습니다.
                    </p>
                </div>

                {/* --- 검색창 추가 --- */}
                <div className="search-wrapper">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="제목 또는 날짜로 검색..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* 스크롤 가능한 리스트 */}
                <div className="my-content-list" ref={listRef}>
                    {displayedPosts.map(post => (
                        <div key={post.id} className="my-content-item">
                            <span className="item-title">{post.title}</span>
                            <span className="item-date">{post.date}</span>
                        </div>
                    ))}

                    <div ref={loadMoreRef} className="load-sentinel" />
                </div>
            </div>
        </div>
    );
}

export default CommunityMyContentPage;
