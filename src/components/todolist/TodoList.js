import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import TodoListContent from "./TodoListContent";


const TodoList = () => {
    return (
        <div className="dashboard-wrapper">
            <Header/>
            <Sidebar/>
            <TodoListContent/>
        </div>
    )
}
export default TodoList;