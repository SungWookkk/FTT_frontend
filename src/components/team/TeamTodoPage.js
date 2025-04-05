import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import TeamTodoContentPage from "./TeamTodoContentPage";

const TeamTodoPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <TeamTodoContentPage/>
        </div>
    );
};

export default TeamTodoPage;