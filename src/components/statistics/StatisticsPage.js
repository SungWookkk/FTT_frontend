import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import StatisticsContentPage from "./StatisticsContentPage";

const StatisticsPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header/>
            <Sidebar/>
            <StatisticsContentPage/>
        </div>
    )
};

export default StatisticsPage;