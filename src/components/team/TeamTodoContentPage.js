import React, { useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import TeamDropdown from "./TeamDropdown";
import {
    DragDropContext,
    Droppable,
    Draggable
} from "react-beautiful-dnd";
import "../team/css/TeamTodoContentPage.css";

// 초기 데이터: 3개의 컬럼(보류, 진행중, 완료)
const initialColumns = {
    onHold: {
        name: "보류",
        items: [
            { id: "task-1", title: "기능 A 기획", description: "추가 논의 필요" },
            { id: "task-2", title: "데이터 모델 설계", description: "초안 작성 중" }
        ],
    },
    inProgress: {
        name: "진행중",
        items: [
            { id: "task-3", title: "UI/UX 개선", description: "피드백 반영" },
            { id: "task-4", title: "API 연동", description: "백엔드와 협의 진행" }
        ],
    },
    done: {
        name: "완료",
        items: [
            { id: "task-5", title: "DB 세팅", description: "AWS RDS 환경 구성" },
        ],
    },
};

function TeamTodoContentPage() {
    const { teamId } = useParams();
    const history = useHistory();
    const location = useLocation();

    // 탭 active 여부
    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;

    // Kanban 컬럼 상태
    const [columns, setColumns] = useState(initialColumns);

    // 드래그가 끝났을 때 실행되는 함수
    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return; // 드롭 위치가 없으면 종료

        if (source.droppableId === destination.droppableId) {
            // 같은 컬럼 내 순서 변경
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems,
                },
            });
        } else {
            // 다른 컬럼으로 이동
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems,
                },
            });
        }
    };

    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown />
                </div>
            </div>

            {/* 목록 선택 탭 */}
            <div className="list-tap">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div className="list-tab-container">
                        <div
                            className={`tab-item ${isMainPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}`)}
                        >
                            메인
                        </div>
                        <div
                            className={`tab-item ${isTodoPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}/todo`)}
                        >
                            팀 Todo
                        </div>
                        <div className="tab-item">소통</div>
                    </div>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text">
                    <span className="highlight-text">팀</span>
                    <span className="normal-text">은 공동의 목표를 위해 함께 </span>
                    <span className="highlight-text">소통하고 협업</span>
                    <span className="normal-text"> 하는 공간입니다. 서로의 아이디어와 역량을 모아 </span>
                    <span className="highlight-text">시너지를 발휘</span>
                    <span className="normal-text">하며, 매일의 과제를 </span>
                    <span className="highlight-text">함께 해결</span>
                    <span className="normal-text"> 해 보세요. 작지만 꾸준한 노력들이 모여 </span>
                    <span className="highlight-text">팀의 성장</span>
                    <span className="normal-text">을 이끌어냅니다!</span>
                </p>
            </div>

            {/* Kanban 보드 */}
            <div className="kanban-board-container">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="kanban-columns">
                        {Object.entries(columns).map(([columnId, columnData]) => (
                            <Droppable droppableId={columnId} key={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        className="kanban-column"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <h3 className="column-title">{columnData.name}</h3>
                                        {columnData.items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={`kanban-task-card ${snapshot.isDragging ? "dragging" : ""}`}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className="task-title">{item.title}</div>
                                                        <div className="task-desc">{item.description}</div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}

export default TeamTodoContentPage;
