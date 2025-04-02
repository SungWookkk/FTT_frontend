import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import TeamContentPage from "./TeamContentPage";

const TeamPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <TeamContentPage/>
        </div>
    );
};

export default TeamPage;