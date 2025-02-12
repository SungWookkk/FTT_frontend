import React from "react";
import "../css/Dashboard.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Dashboard = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
        </div>
    );
};

export default Dashboard;
