import React from "react";
import "../css/Dashboard.css";

const Navbar = () => {
    return (
        <nav className="navbar navbar-top navbar-expand-md navbar-dark">
            <div className="container-fluid">
                <a className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block" href="/dashboard">
                    대시보드
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
