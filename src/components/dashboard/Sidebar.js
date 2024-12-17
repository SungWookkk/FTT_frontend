import React from "react";
import { Link } from "react-router-dom";
import "../css/Sidebar.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <ul>
                <li><Link to="/dashboard">대시보드</Link></li>
                <li><Link to="/todo">To Do List</Link></li>
                <li><Link to="/statistics">통계</Link></li>
                <li><Link to="/badges">뱃지</Link></li>
            </ul>
        </aside>
    );
};

export default Sidebar;
