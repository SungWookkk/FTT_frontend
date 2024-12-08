import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import DashboardContent from "./DashboardContent";
import { useAuth } from "../../Auth/AuthContext"; // Context 가져오기
import "../css/Dashboard.css";
import {Redirect} from "react-router-dom";

const Dashboard = () => {
    const { auth } = useAuth();

    if (!auth || !auth.token) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <DashboardContent />
            </div>
        </div>
    );
};

export default Dashboard;
