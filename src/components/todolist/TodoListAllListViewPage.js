import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import TodoListAllListView from "./TodoListAllListView";

const TodoListAllListViewPage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <TodoListAllListView />
        </div>
    );
};

export default TodoListAllListViewPage;
