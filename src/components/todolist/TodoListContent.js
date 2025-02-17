import React from "react";
import "../todolist/css/TodoListContent.css";

const TodoListContent = () => {
    return(
        <div className="dashboard-content">
            {/* 작업공간 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">작업공간</span>
                </div>
            </div>

            {/* 목록 선택 탭*/}
            <div className="list-tap">
                <div className="div-items">
                    <div className="cu-data-view-item-cu">
                        <div className="div-cu-data-view">
                            <div className="text-wrapper">내용</div>
                        </div>
                    </div>

                    <div className="div-wrapper">
                        <div className="div">목록</div>
                    </div>

                    <div className="div-2"/>

                    <div className="text-wrapper-2">팀</div>
                </div>
            </div>
            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text-todo">
                    <span className="highlight-text"> 효율적인 하루</span>
                    <span className="normal-text">를 설계하세요! 우리의 </span>
                    <span className="highlight-text">To-Do List 서비스</span>
                    <span className="normal-text">를 통해 목표를 정리하고 실천하세요. 지금 바로 시작해보세요!</span>
                </p>
            </div>
        </div>
    )
}


export default TodoListContent;