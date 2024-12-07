import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css';

const Sidebar = () => {
    return (
        <nav className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
            <div className="container-fluid">
                {/* 브랜드 로고 */}

                {/* 내비게이션 */}
                <div className="collapse navbar-collapse" id="sidenav-collapse-main">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">
                                <i className="ni ni-tv-2 text-primary"></i> 대시보드
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">
                                <i className="ni ni-single-02 text-yellow"></i> 사용자 프로필
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/settings">
                                <i className="ni ni-settings-gear-65 text-info"></i> 설정
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
