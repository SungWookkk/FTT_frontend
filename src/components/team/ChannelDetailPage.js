import Header from "../dashboard/Header";
import Sidebar from "../dashboard/Sidebar";
import React from "react";
import ChannelDetailContentPage from "./ChannelDetailContentPage";

const ChannelDetailPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <ChannelDetailContentPage/>
        </div>
    );
};

export default ChannelDetailPage;