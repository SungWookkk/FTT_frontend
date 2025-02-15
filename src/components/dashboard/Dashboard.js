import React from "react";
import "../css/Dashboard.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardContent from "./DashboardContent";

const Dashboard = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <DashboardContent/>
        </div>
    );
};

export default Dashboard;
