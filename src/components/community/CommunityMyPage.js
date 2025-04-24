import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import CommunityMyContentPage from "./CommunityMyContentPage";

const CommunityMyPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <CommunityMyContentPage/>
        </div>
    );
};

export default CommunityMyPage;
