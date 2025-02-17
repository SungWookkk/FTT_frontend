import React from "react";
import "./css/Header.css";
import logo from "../../../src/Auth/css/img/logo.svg";

const Header = () => {
    return (
        <header className="header">
            {/* 로고 */}
            <div className="header-logo">
                <img src={logo} alt="Logo" />
            </div>

            {/* 검색창 */}
            <div className="header-search">
                <input type="text" placeholder="검색" />
                <button>🔍</button>
            </div>

            {/* 사용자 정보 및 로그아웃 */}
            <div className="header-user">
                <div className="user-icon">M</div>
                <span className="logout">로그아웃</span>
            </div>
        </header>
    );
};

export default Header;
