import React from "react";
import { Link } from "react-router-dom";
import "../css/Dashboard.css";

const Sidebar = () => {
    return (
        <nav className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="sidenav-collapse-main">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">
                                <i className="ni ni-tv-2 text-primary"></i> 대시보드
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
