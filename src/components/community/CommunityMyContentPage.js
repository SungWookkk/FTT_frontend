// src/community/CommunityMyContentPage.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../community/css/CommunityMyContentPage.css';
import {NavLink, useHistory} from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import axios from 'axios';

function CommunityMyContentPage() {
    const { auth } = useAuth();
    const history = useHistory();
    //내가 쓴 글
    const [myPosts, setMyPosts] = useState([]);
    //  쓴 댓글
    const [myComments, setMyComments] = useState([]);
    // 내가 좋아요 누른 글
    const [myLikedPosts, setMyLikedPosts] = useState([]);

    // 검색어 상태
    const [postSearch, setPostSearch] = useState('');
    const [commentSearch, setCommentSearch] = useState('');
    const [likedSearch, setLikedSearch] = useState('');

    // 무한스크롤 상태
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const listRef = useRef(null);
    const loadMoreRef = useRef(null);

    // ——————————————————————————————————————————————
    // 컴포넌트 마운트 시, 세 가지 API 콜
    useEffect(() => {
        if (!auth.token) return;

        const headers = {
            Authorization: `Bearer ${auth.token}`,
            'X-User-Id': auth.userId
        };

        // 내가 쓴 글
        axios.get(`/api/community/users/${auth.userId}/posts`, { headers })
            .then(res => setMyPosts(res.data))
            .catch(console.error);

        // 내가 쓴 댓글
        axios.get(`/api/community/users/${auth.userId}/comments`, { headers })
            .then(res => setMyComments(res.data))
            .catch(console.error);

        // 내가 좋아요 누른 글
        axios.get(`/api/community/users/${auth.userId}/likes`, { headers })
            .then(res => setMyLikedPosts(res.data))
            .catch(console.error);
    }, [auth.token, auth.userId]);

    // ——————————————————————————————————————————————
    // 필터 & 정렬 (검색, 날짜 순)
    const sortedPosts = useMemo(() => {
        return myPosts
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [myPosts]);

    const filteredPosts = useMemo(() => {
        const term = postSearch.trim().toLowerCase();
        if (!term) return sortedPosts;
        return sortedPosts.filter(p =>
            p.title.toLowerCase().includes(term) ||
            p.createdAt.startsWith(term)
        );
    }, [postSearch, sortedPosts]);

    const filteredComments = useMemo(() => {
        const term = commentSearch.trim().toLowerCase();
        if (!term) return myComments;
        return myComments.filter(c =>
            c.content.toLowerCase().includes(term) ||
            c.createdAt.startsWith(term)
        );
    }, [commentSearch, myComments]);

    const filteredLiked = useMemo(() => {
        const term = likedSearch.trim().toLowerCase();
        if (!term) return myLikedPosts;
        return myLikedPosts.filter(l =>
            l.title.toLowerCase().includes(term) ||
            l.createdAt.startsWith(term)
        );
    }, [likedSearch, myLikedPosts]);

    // ——————————————————————————————————————————————
    // 무한 스크롤: “내가 쓴 글”만
    // 검색어 바뀌면 페이지 리셋
    useEffect(() => {
        setPage(1);
    }, [postSearch]);

    // Intersection Observer
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
            {/* 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">사용자 커뮤니티</span>
                </div>
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

            <div className="my-content-wrapper">
                {/* 1) 내가 쓴 게시글 */}
                <div className="my-content-container">
                    <div className="my-content-header">
                        <h2 className="my-content-title">내 작성 게시글</h2>
                        <p className="my-content-subtitle">
                            내가 작성한 게시글 목록을 확인하고 관리할 수 있습니다.
                        </p>
                    </div>
                    <div className="section-header3" style={{borderBottom: '5px solid rgb(52, 152, 219)'}}/>
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
                        {displayedPosts.length > 0 ? (
                            displayedPosts.map(p => (
                                <div
                                    key={p.id}
                                    className="my-content-item"
                                    onClick={() => history.push(`/community/board/${p.id}`)}
                                >
                                    <span className="item-title">{p.title}</span>
                                    <span
                                        className="item-date">{new Date(p.createdAt).toISOString().slice(0, 10)}</span>
                                </div>
                            ))
                        ) : (
                            <p className="empty-text">작성한 게시글이 없습니다.</p>
                        )}
                        <div ref={loadMoreRef} className="load-sentinel"/>
                    </div>
                </div>


                {/* 2) 내가 쓴 댓글 */}
                <div className="my-content-container">
                    <div className="my-content-header">
                        <h2 className="my-content-title">내 작성 댓글</h2>
                        <p className="my-content-subtitle">
                            내가 작성한 댓글 목록을 확인하고 관리할 수 있습니다.
                        </p>
                    </div>
                    <div className="section-header3" style={{borderBottom: '5px solid rgb(39, 174, 96)'}}/>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="댓글 내용 또는 날짜로 검색..."
                            value={commentSearch}
                            onChange={e => setCommentSearch(e.target.value)}
                        />
                    </div>
                    <div className="my-content-list" style={{maxHeight: '50vh'}}>
                        {filteredComments.length > 0 ? (
                            filteredComments.map(c => (
                                <div
                                    key={c.id}
                                    className="my-content-item"
                                    onClick={() => history.push(`/community/board/${c.post.id}`)}
                                >
                                    <span className="item-title">{c.content}</span>
                                    <span
                                        className="item-date">{new Date(c.createdAt).toISOString().slice(0, 10)}</span>
                                </div>
                            ))
                        ) : (
                            <p className="empty-text">작성한 댓글이 없습니다.</p>
                        )}
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
                    <div className="section-header3" style={{borderBottom: '5px solid rgb(231, 76, 60)'}}/>
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
                    {filteredLiked.length > 0 ? (
                        filteredLiked.map(l => (
                            <div
                                key={l.id}
                                className="my-content-item"
                                onClick={() => history.push(`/community/board/${l.id}`)}
                            >
                                <span className="item-title">{l.title}</span>
                                <span className="item-date">
                                        {new Date(l.createdAt).toISOString().slice(0, 10)}
                                    </span>
                            </div>
                        ))
                    ) : (
                        <div className="empty-text">좋아요 누른 게시글이 없습니다.</div>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
}

export default CommunityMyContentPage;
