import React, {useContext} from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DashboardContent from "./DashboardContent";

import "../css/Dashboard.css";
import {Redirect} from "react-router-dom";
import {AuthContext} from "../../Auth/AuthContext";

const Dashboard = () => {
    const { isLoggedIn } = useContext(AuthContext);

    if (!isLoggedIn) {
        console.error("로그인되지 않은 사용자가 대시보드에 접근했습니다.");
        return <Redirect to="/login" />;
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <DashboardContent />
                <Footer />
            </div>
        </div>
    );
};

export default Dashboard;
