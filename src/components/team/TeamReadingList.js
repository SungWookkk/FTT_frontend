import React from "react";
import "../team/css/TeamReadingList.css";

// 테스트용으로 카테고리를 많이 넣어서 가로 스크롤
const DUMMY_READING_LIST = [
    {
        category: "AWS",
        items: [
            { title: "EC2 Spring Boot 배포", link: "https://example.com/ec2-spring" },
            { title: "EC2 MySQL 설정", link: "https://example.com/ec2-mysql" },
        ],
    },
    {
        category: "BackEnd",
        items: [
            { title: "Node.js", link: "https://nodejs.org" },
            { title: "HTTP", link: "https://developer.mozilla.org/docs/Web/HTTP" },
            { title: "Docker", link: "https://www.docker.com/" },
            { title: "Web Architecture", link: "https://example.com/web-architecture" },
        ],
    },
    {
        category: "FrontEnd",
        items: [
            { title: "React vs JS", link: "https://example.com/react-vs-js" },
            { title: "모바일 앱 종류", link: "#" },
            { title: "React 기초", link: "https://react.dev" },
        ],
    },
    {
        category: "Etc",
        items: [
            { title: "기타 주제1", link: "#" },
            { title: "기타 주제2", link: "#" },
        ],
    },
    {
        category: "DevOps",
        items: [
            { title: "CI/CD", link: "#" },
            { title: "Kubernetes", link: "#" },
        ],
    },
    {
        category: "Mobile",
        items: [
            { title: "React Native", link: "https://reactnative.dev" },
            { title: "Flutter", link: "https://flutter.dev" },
        ],
    },
    {
        category: "Design",
        items: [
            { title: "Figma 기초", link: "https://www.figma.com" },
            { title: "UX/UI 원칙", link: "#" },
        ],
    },
    {
        category: "Security",
        items: [
            { title: "OWASP Top 10", link: "#" },
            { title: "SSL/TLS", link: "#" },
        ],
    },
    {
        category: "Marketing",
        items: [
            { title: "SEO 기본", link: "#" },
            { title: "콘텐츠 전략", link: "#" },
        ],
    },
    {
        category: "Extra",
        items: [
            { title: "추가 주제1", link: "#" },
            { title: "추가 주제2", link: "#" },
        ],
    },
];

function TeamReadingList() {
    return (
        <div className="team-reading-list">
            <h2 className="reading-list-title">Reading List</h2>

            <div className="reading-list-board">
                {DUMMY_READING_LIST.map((column, idx) => (
                    <div key={idx} className="reading-list-column">
                        <h3 className="column-title">{column.category}</h3>
                        <ul className="reading-items">
                            {column.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="reading-item">
                                    <a
                                        href={item.link || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="reading-link"
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="add-new-page">+ 새 페이지</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TeamReadingList;
