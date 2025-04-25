import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import CommunityDetailContentPage from "./CommunityDetailContentPage";

const CommunityDetailPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <CommunityDetailContentPage/>
        </div>
    );
};

export default CommunityDetailPage;
