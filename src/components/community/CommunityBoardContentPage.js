import React from 'react';
import '../community/css/CommunityBoardContentPage.css';
import {NavLink} from "react-router-dom";

const sampleRows = [
    { no: 1, title: '자기 관리를 위한 필수 요소에 대한 설명……', date: '2024.12.27', views: 58372, likes: 175, dislikes: 46 },
    { no: 2, title: '제가 지금까지 인생을 살아오며 느낀점이 이거입니다.', date: '2024.11.30', views: 46584, likes: 146, dislikes: 12 },
    { no: 3, title: '이거 디자인을 하면서 느낀건데 창작이 어려워요.', date: '2024.07.17', views: 42158, likes: 89, dislikes: 24 },
    { no: 4, title: '취업 준비를 하려는데 고민이 있습니다. 조언 부탁드려요.', date: '2024.05.25', views: 37845, likes: 72, dislikes: 23 },
    { no: 5, title: '요즘 AI 기능 어떤가요? 제 생각에는….', date: '2024.10.24', views: 29123, likes: 68, dislikes: 34 },
    { no: 6, title: '아니 제가 대학교를 졸업을 하고나서….', date: '2024.04.30', views: 44012, likes: 66, dislikes: 10 },
    { no: 7, title: '현재 저의 목표가 아래와 같습니다. 평가 해주세요 ㅠ', date: '2024.06.21', views: 52642, likes: 61, dislikes: 0 },
    { no: 8, title: '친구랑 싸웠는데 이게 제 잘못인가요? 좀 억울하네요', date: '2025.01.02', views: 15373, likes: 58, dislikes: 5 },
    { no: 9, title: 'LH 청년매입주택 서류 제출에 합격했는데 여기서 선정이 될까요?', date: '2025.01.09', views: 22761, likes: 54, dislikes: 12 },
    { no: 10, title: '현 시점 나의 인생을 위하여 내가 하고 있는 것 목록', date: '2025.01.12', views: 31535, likes: 51, dislikes: 1 },
    { no: 11, title: '현 시점 나의 인생을 위하여 내가 하고 있는 것 목록', date: '2025.01.12', views: 31535, likes: 51, dislikes: 1 },
    { no: 12, title: '현 시점 나의 인생을 위하여 내가 하고 있는 것 목록', date: '2025.01.12', views: 31535, likes: 51, dislikes: 1 }
];

function CommunityBoardContentPage() {
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
        <div className="board-container">
            <h2 className="board-title">Best 게시글</h2>
            <h2 className="board-title">주간 Hot 게시글</h2>

            <p className="board-subtitle">Best 게시글은 좋아요 개수가 50개 이상의 게시글만 등록 됩니다.</p>
            <div className="board-table-wrapper">
                <table className="board-table">
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
                    {sampleRows.map(row => (
                        <tr key={row.no}>
                            <td>{row.no}</td>
                            <td className="title-cell">{row.title}</td>
                            <td>{row.date}</td>
                            <td>{row.views}</td>
                            <td>
                                <span className="like">👍 {row.likes}</span>
                                <span className="dislike">👎 {row.dislikes}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
                {/* Pagination placeholder */}
                <div className="board-pagination">
                    <button disabled>{'<'}</button>
                    {[...Array(10)].map((_, i) => (
                        <button key={i} className={i===0 ? 'active' : ''}>{i+1}</button>
                    ))}
                    <button>{'>'}</button>
                </div>
            </div>
        </div>
    );
}
export default CommunityBoardContentPage;