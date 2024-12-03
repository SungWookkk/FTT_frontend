import React from "react";
import "./css/Header.css";

const Header = () => {
    return (
        <header className="header-container">
            <nav className="navbar">
                <div className="logo">
                    <a href="/">MyApp</a>
                </div>
                <ul className="nav-links">
                    <li><a href="/dashboard">대시보드</a></li>
                    <li><a href="/signup">회원가입</a></li>
                    <li><a href="/login">로그인</a></li>
                    <li><a href="/profile">프로필</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
