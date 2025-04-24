import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import CommunityBoardContentPage from "./CommunityBoardContentPage";

const CommunityBoardPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <CommunityBoardContentPage/>
        </div>
    );
};

export default CommunityBoardPage;
