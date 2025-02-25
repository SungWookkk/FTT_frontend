import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import TodoListWrite from "./TodoListWrite";

const TodoListWritePage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <TodoListWrite />
        </div>
    );
};

export default TodoListWritePage;
