import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import TodoFolderAll from "./TodoFolderAll";


const TodoFolderAllPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header/>
            <Sidebar/>
            <TodoFolderAll/>
        </div>
    )
}
export default TodoFolderAllPage;