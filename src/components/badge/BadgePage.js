import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import BadgeMainPage from "./BadgeMainPage";
const BadgePage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header/>
            <Sidebar/>
            <BadgeMainPage/>
        </div>
    )
};

export default BadgePage;