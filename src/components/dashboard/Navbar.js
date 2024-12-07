import React from "react";
import "../css/Dashboard.css";

const Navbar = () => {
    return (
        <nav className="navbar navbar-top navbar-expand-md navbar-dark" id="navbar-main">
            <div className="container-fluid">
                {/* 유효한 href 값 추가 */}
                <a
                    className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
                    href="/dashboard"
                >
                    대시보드
                </a>
                <ul className="navbar-nav align-items-center d-none d-md-flex">
                    <li className="nav-item dropdown">
                        {/* role 속성 제거 */}
                        <button
                            className="nav-link pr-0 btn btn-link"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <div className="media align-items-center">
                                <span className="avatar avatar-sm rounded-circle">
                                    <img
                                        alt="사용자 이미지"
                                        src="/assets/img/theme/team-4-800x800.jpg"
                                    />
                                </span>
                                <div className="media-body ml-2 d-none d-lg-block">
                                    <span className="mb-0 text-sm font-weight-bold">홍길동</span>
                                </div>
                            </div>
                        </button>
                        <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-right">
                            <a href="/profile" className="dropdown-item">
                                <i className="ni ni-single-02"></i> 프로필
                            </a>
                            <a href="/settings" className="dropdown-item">
                                <i className="ni ni-settings-gear-65"></i> 설정
                            </a>
                            <div className="dropdown-divider"></div>
                            <a href="/logout" className="dropdown-item">
                                <i className="ni ni-user-run"></i> 로그아웃
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
