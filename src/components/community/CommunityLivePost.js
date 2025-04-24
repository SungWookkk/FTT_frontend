import React, { useState } from 'react';
import defaultUser from "../../Auth/css/img/default-user.svg";
import '../community/css/CommunityLivePost.css';

const samplePosts = [
    {
        title: '다들 새해 복 많이 받으세요',
        content: '다들 2025년 새해 복 많이 받으시고 모든 일 잘 풀렸으면 좋겠습니다.',
        authorName: '광규 영광 방석현',
        likes: 45,
        comments: 1
    },
    {
        title: '안녕하세요 가입인사 작성합니다.',
        content: '안녕하세요 처음 가입하신 분들께 커뮤니티의 기분 좋은 인사를 전합니다.',
        authorName: '개발자를 꿈꾸는 성욱',
        likes: 11,
        comments: 3
    },
    {
        title: '제가 오늘 아침으로 홍콩 먹었어요.',
        content: '아침으로 먹었던 햄버거 대신 홍콩식 딤섬이 맛있더라고요.',
        authorName: '회사 다니는 신현민',
        likes: 4,
        comments: 1
    },
    {
        title: '지금 현재 웹 개발 중입니다.',
        content: '지금 웹앱 기능 개선 작업 중인데, 모션 UX를 어떻게 넣어야 좋을지 고민됩니다.',
        authorName: '디자인 초보',
        likes: 11,
        comments: 3
    },
    {
        title: '오늘 너무 추워서 유치원 가기 싫어',
        content: '아이가 정말 울면서 가기 싫다고… 부모 입장에서도 난감하네요.',
        authorName: '신현민 아들 신탕구',
        likes: 7,
        comments: 2
    },
    {
        title: '추가 게시글 테스트1',
        content: '이건 테스트용 본문입니다. 길어지면 말줄임 처리됩니다.',
        authorName: '사용자 A',
        likes: 3,
        comments: 1
    },
    {
        title: '추가 게시글 테스트2',
        content: '테스트2 본문, 길이가 어느 정도 되면 … 붙습니다.',
        authorName: '사용자 B',
        likes: 5,
        comments: 2
    },
    {
        title: '추가 게시글 테스트3',
        content: '테스트3 짧은 본문.',
        authorName: '사용자 C',
        likes: 6,
        comments: 0
    },
    {
        title: '추가 게시글 테스트2',
        content: '테스트2 본문, 길이가 어느 정도 되면 … 붙습니다.',
        authorName: '사용자 B',
        likes: 5,
        comments: 2
    },
    {
        title: '추가 게시글 테스트2',
        content: '테스트2 본문, 길이가 어느 정도 되면 … 붙습니다.',
        authorName: '사용자 B',
        likes: 5,
        comments: 2
    },    {
        title: '추가 게시글 테스트2',
        content: '테스트2 본문, 길이가 어느 정도 되면 … 붙습니다.',
        authorName: '사용자 B',
        likes: 5,
        comments: 2
    },    {
        title: '추가 게시글 테스트2',
        content: '테스트2 본문, 길이가 어느 정도 되면 … 붙습니다.',
        authorName: '사용자 B',
        likes: 5,
        comments: 2
    },



];

export default function CommunityLivePost() {
    const [page, setPage] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const perPage = 8;
    const totalPages = Math.ceil(samplePosts.length / perPage);

    const handleNext = () => {
        // 슬라이드 애니메이션 시작
        setIsSliding(true);
        setTimeout(() => {
            // 페이지 변경
            setPage(p => (p + 1) % totalPages);
            // 애니메이션 끝내기
            setIsSliding(false);
        }, 800);
    };

    // 현재 페이지에 보일 아이템
    const visible = samplePosts.slice(page * perPage, page * perPage + perPage);

    return (
            <div className="clp-grid-wrapper">
                <div className="clp-grid-wrapper">
                    <div className={`clp-grid ${isSliding ? 'sliding' : ''}`}>
                        {visible.map((p, i) => (
                            <div key={i} className="clp-card">
                                <p className="clp-title">{p.title}</p>
                                <p className="clp-content">{p.content}</p>
                                <div className="clp-footer">
                                    <div className="clp-author">
                                        <img
                                            className="clp-avatar"
                                            src={defaultUser}
                                            alt={`${p.authorName} avatar`}
                                        />
                                        <span className="clp-author-name">{p.authorName}</span>
                                    </div>
                                    <div className="clp-stats">
                                        <span className="clp-like">👍 {p.likes}</span>
                                        <span className="clp-comment">💬 {p.comments}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <button className="clp-next-btn" onClick={handleNext}>
                            →
                        </button>
                    )}
                </div>
            </div>
    );
}