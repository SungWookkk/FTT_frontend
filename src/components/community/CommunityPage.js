import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import CommunityContentPage from "./CommunityContentPage";

const CommunityPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <CommunityContentPage/>
        </div>
    );
};

export default CommunityPage;
