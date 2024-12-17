import React from "react";
import "../css/Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar navbar-top navbar-expand-md navbar-dark" id="navbar-main">
            <div className="container-fluid">
                <a className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block" href="./index.html">
                    Dashboard
                </a>
                <form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
                    <div className="form-group mb-0">
                        <div className="input-group input-group-alternative">
                            <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <i className="fas fa-search"></i>
                                </span>
                            </div>
                            <input className="form-control" placeholder="Search" type="text" />
                        </div>
                    </div>
                </form>
            </div>
        </nav>
    );
};

export default Navbar;
