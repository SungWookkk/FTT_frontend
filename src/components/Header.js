import React from 'react';
import './dashboard/css/Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">Argon</div>
            <div className="search-bar">
                <input type="text" placeholder="검색" />
            </div>
            <div className="user-info">
                <button>로그아웃</button>
            </div>
        </header>
    );
};

export default Header;
