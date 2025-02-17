import React from "react";
import "./css/Dashboard.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="row align-items-center justify-content-xl-between">
                <div className="col-xl-6">
                    <div className="copyright text-center text-xl-left text-muted">
                        &copy; 2024 <a href="https://www.creative-tim.com" className="font-weight-bold ml-1" target="_blank" rel="noopener noreferrer">Creative Tim</a>
                    </div>
                </div>
                <div className="col-xl-6">
                    <ul className="nav nav-footer justify-content-center justify-content-xl-end">
                        <li className="nav-item">
                            <a href="https://www.creative-tim.com" className="nav-link" target="_blank" rel="noopener noreferrer">Creative Tim</a>
                        </li>
                        {/* Add more links as needed */}
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
