import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import TeamManagementContentPage from "./TeamManagementContentPage";

const TeamMangementPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <TeamManagementContentPage/>
        </div>
    );
};

export default TeamMangementPage;