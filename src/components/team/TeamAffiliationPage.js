import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import TeamAffiliationContentPage from "./TeamAffiliationContentPage";

const TeamAffiliationPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <TeamAffiliationContentPage/>
        </div>
    );
};

export default TeamAffiliationPage;