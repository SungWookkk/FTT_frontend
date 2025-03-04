import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import TodoFolderCreate from "./TodoFolderCreate";


const TodoFolderAllPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header/>
            <Sidebar/>
            <TodoFolderCreate/>
        </div>
    )
}
export default TodoFolderAllPage;