import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import TeamCommunityContentPage from "./TeamCommunityContentPage";

const TeamCommunityPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <TeamCommunityContentPage/>
        </div>
    );
};

export default TeamCommunityPage;