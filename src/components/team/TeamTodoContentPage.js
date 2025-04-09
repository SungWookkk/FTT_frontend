import React, { useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import TeamDropdown from "./TeamDropdown";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import defaultUser from "../../Auth/css/img/default-user.svg";
import "../team/css/TeamTodoContentPage.css";
import calendar from "../../Auth/css/img/calendar.svg";
import TeamTodoCalendarModal from "./TeamTodoCalendarModal";

/** 마감일 계산 함수 */
function getDaysLeft(dueDateString) {
    if (!dueDateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateString);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/** 초기 데이터 */
const initialColumns = {
    onHold: {
        name: "진행 예정",
        items: [
            {
                id: "task-1",
                title: "기능 A 기획",
                description: "추가 논의 필요",
                startDate: "2025-09-01",
                dueDate: "2025-09-10",
                priority: "높음",
                userName: "Alice",
            },
            {
                id: "task-2",
                title: "데이터 모델 설계",
                description: "초안 작성 중",
                startDate: "2023-09-01",
                dueDate: "2023-09-05",
                priority: "중간",
                userName: "Bob",
            },
            {
                id: "task-6",
                title: "데이터 모델 설계(2차)",
                description: "추가 검토 필요",
                startDate: "2023-09-01",
                dueDate: "2023-09-05",
                priority: "중간",
                userName: "Bob",
            },
            {
                id: "task-7",
                title: "신규 라이브러리 검토",
                description: "UI 관련 라이브러리 조사",
                startDate: "2023-09-10",
                dueDate: "2023-09-20",
                priority: "낮음",
                userName: "Frank",
            },
            {
                id: "task-8",
                title: "기획안 리뷰",
                description: "초안 리뷰 일정 조율",
                startDate: "",
                dueDate: "",
                priority: "낮음",
                userName: "미지정",
            },
        ],
    },
    inProgress: {
        name: "진행중",
        items: [
            {
                id: "task-3",
                title: "DB 세팅",
                description: "AWS RDS 환경 구성",
                startDate: "2023-08-28",
                dueDate: "2023-09-03",
                priority: "낮음",
                userName: "Charlie",
            },
            {
                id: "task-4",
                title: "API 연동",
                description: "백엔드와 협의 진행",
                startDate: "2023-09-01",
                dueDate: "2023-09-15",
                priority: "높음",
                userName: "David",
            },
            {
                id: "task-9",
                title: "에러 모니터링 설정",
                description: "Sentry 연동",
                startDate: "2023-09-02",
                dueDate: "2023-09-10",
                priority: "중간",
                userName: "Grace",
            },
            {
                id: "task-10",
                title: "UI 컴포넌트 제작",
                description: "디자인 시안 기반 작업",
                startDate: "2023-09-05",
                dueDate: "2023-09-12",
                priority: "높음",
                userName: "Helen",
            },
        ],
    },
    done: {
        name: "완료",
        items: [
            {
                id: "task-5",
                title: "UI/UX 개선",
                description: "피드백 반영",
                startDate: "2023-08-20",
                dueDate: "2023-08-28",
                priority: "중간",
                userName: "Eve",
            },
            {
                id: "task-11",
                title: "테스트 코드 작성",
                description: "기본 기능 테스트",
                startDate: "2023-08-15",
                dueDate: "2023-08-25",
                priority: "중간",
                userName: "Irene",
            },
            {
                id: "task-12",
                title: "리팩토링",
                description: "코드 구조 개선",
                startDate: "2023-08-10",
                dueDate: "2023-08-18",
                priority: "낮음",
                userName: "Jake",
            },
            {
                id: "task-13",
                title: "리팩토링",
                description: "코드 구조 개선",
                startDate: "2023-08-10",
                dueDate: "2023-08-18",
                priority: "낮음",
                userName: "Jake",
            },
            {
                id: "task-14",
                title: "리팩토링",
                description: "코드 구조 개선",
                startDate: "2023-08-10",
                dueDate: "2023-08-18",
                priority: "낮음",
                userName: "Jake",
            },
            {
                id: "task-15",
                title: "리팩토링",
                description: "코드 구조 개선",
                startDate: "2023-08-10",
                dueDate: "2023-08-18",
                priority: "낮음",
                userName: "Jake",
            },
            {
                id: "task-16",
                title: "리팩토링",
                description: "코드 구조 개선",
                startDate: "2023-08-10",
                dueDate: "2023-08-18",
                priority: "낮음",
                userName: "Jake",
            },
            {
                id: "task-17",
                title: "리팩토링",
                description: "코드 구조 개선",
                startDate: "2023-08-10",
                dueDate: "2023-08-18",
                priority: "낮음",
                userName: "Jake",
            },
        ],
    },
};

function TeamTodoContentPage() {
    const { teamId } = useParams();
    const history = useHistory();
    const location = useLocation();

    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;

    const [columns, setColumns] = useState(initialColumns);
    const [sortOrders, setSortOrders] = useState({
        onHold: "priority",
        inProgress: "priority",
        done: "priority",
    });
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    // folded === true이면 진행중/완료 컬럼이 숨김 처리됨
    const [folded, setFolded] = useState(false);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId) {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: { ...column, items: copiedItems },
            });
        } else {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
            });
        }
    };

    const getSortedItems = (columnId, items) => {
        const sortedItems = [...items].sort((a, b) => {
            const sortBy = sortOrders[columnId];
            if (sortBy === "priority") {
                const priorityValue = { "높음": 3, "중간": 2, "낮음": 1 };
                return (priorityValue[b.priority] || 0) - (priorityValue[a.priority] || 0);
            } else if (sortBy === "dueDate") {
                const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                return aDue - bDue;
            } else if (sortBy === "startDate") {
                const aStart = a.startDate ? new Date(a.startDate).getTime() : Infinity;
                const bStart = b.startDate ? new Date(b.startDate).getTime() : Infinity;
                return aStart - bStart;
            }
            return 0;
        });
        return sortedItems;
    };

    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown />
                </div>
                <div className="header-button-group">
                    <button className="btn btn-team-create">팀 작업 생성하기</button>
                </div>
            </div>

            {/* 탭 */}
            <div className="list-tap">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
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
                    <span className="normal-text">
            {" "}
                        해 보세요. 작지만 꾸준한 노력들이 모여{" "}
          </span>
                    <span className="highlight-text">팀의 성장</span>
                    <span className="normal-text">을 이끌어냅니다!</span>
                </p>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-columns">
                    {/* 진행 예정(onHold) 컬럼: 항상 표시되고, 여기서만 접기/펼치기 버튼을 보여줍니다 */}
                    <Droppable droppableId="onHold" direction="horizontal">
                        {(provided) => (
                            <div
                                className="kanban-column"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <div className="column-header">
                                    {/* 왼쪽 영역: 제목 */}
                                    <div className="header-left">
                                        <h3 className="column-title1">
                                            {columns.onHold.name} ({columns.onHold.items.length})
                                        </h3>
                                    </div>

                                    {/* 오른쪽 영역: 정렬 드롭다운, 달력 아이콘, 접기/펼치기 버튼 */}
                                    <div className="header-right">
                                        {columns.onHold.items.length > 0 && (
                                            <select
                                                className="sort-dropdown"
                                                value={sortOrders.onHold}
                                                onChange={(e) =>
                                                    setSortOrders({ ...sortOrders, onHold: e.target.value })
                                                }
                                            >
                                                <option value="priority">우선순위순</option>
                                                <option value="dueDate">마감날짜 얼마 안 남은 순</option>
                                                <option value="startDate">곧 시작하는 순</option>
                                            </select>
                                        )}
                                        <img
                                            src={calendar}
                                            alt="Calendar"
                                            className="calendar-icon"
                                            onClick={() => setIsCalendarModalOpen(true)}
                                        />
                                        <button
                                            className="fold-toggle-btn"
                                            onClick={() => setFolded(!folded)}
                                        >
                                            {folded ? "펼치기" : "접기"}
                                        </button>
                                    </div>
                                </div>
                                <div className="task-list-horizontal">
                                    {getSortedItems("onHold", columns.onHold.items).map(
                                        (item, index) => {
                                            const daysLeft = getDaysLeft(item.dueDate);
                                            let ddayText = "";
                                            if (daysLeft === null) {
                                                ddayText = "날짜 미정";
                                            } else if (daysLeft > 0) {
                                                ddayText = `D-${daysLeft}`;
                                            } else if (daysLeft === 0) {
                                                ddayText = "오늘 마감!";
                                            } else {
                                                ddayText = "기한 만료";
                                            }
                                            return (
                                                <Draggable
                                                    key={item.id}
                                                    draggableId={item.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={`kanban-task-card horizontal-card ${
                                                                snapshot.isDragging ? "dragging" : ""
                                                            }`}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <div
                                                                className={`priority-ribbon priority-${
                                                                    item.priority || "낮음"
                                                                }`}
                                                            >
                                                                {item.priority || "낮음"}
                                                            </div>
                                                            <div className="task-assignee">
                                                                <img
                                                                    src={defaultUser}
                                                                    alt="User"
                                                                    className="assignee-avatar"
                                                                />
                                                                <span className="assignee-name">
                                  {item.userName || "미지정"}
                                </span>
                                                            </div>
                                                            <div className="task-title" style={{marginTop: "10px"}}>
                                                                {item.title}
                                                            </div>
                                                            <div className="task-desc">{item.description}</div>
                                                            <div className="task-startDate">
                                                                <span className="start-label">시작: </span>
                                                                <span className="start-date-text">
                                  {item.startDate
                                      ? new Date(item.startDate).toLocaleDateString()
                                      : "미설정"}
                                </span>
                                                            </div>
                                                            <div className="task-dueDate">
                                                                <span className="due-label">마감: </span>
                                                                <span className="due-date-text">
                                  {item.dueDate
                                      ? new Date(item.dueDate).toLocaleDateString()
                                      : "미설정"}
                                </span>
                                                                <span className="dday-text">({ddayText})</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        }
                                    )}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>

                    {/* 진행 예정 컬럼 아래에 위치할 나머지(진행중, 완료) 컬럼들을 래핑 */}
                    <div className={`secondary-columns ${folded ? "folded" : ""}`}>
                        {["inProgress", "done"].map((columnId) => {
                            const columnData = columns[columnId];
                            return (
                                <Droppable
                                    droppableId={columnId}
                                    key={columnId}
                                    direction="horizontal"
                                >
                                    {(provided) => (
                                        <div
                                            className="kanban-column"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <div className="column-header">
                                                <h3 className="column-title1">
                                                    {columnData.name} ({columnData.items.length})
                                                </h3>
                                                <select
                                                    className="sort-dropdown"
                                                    value={sortOrders[columnId]}
                                                    onChange={(e) =>
                                                        setSortOrders({
                                                            ...sortOrders,
                                                            [columnId]: e.target.value,
                                                        })
                                                    }
                                                >
                                                    <option value="priority">우선순위순</option>
                                                    <option value="dueDate">마감날짜 얼마 안 남은 순</option>
                                                    <option value="startDate">곧 시작하는 순</option>
                                                </select>
                                                <img
                                                    src={calendar}
                                                    alt="Calendar"
                                                    className="calendar-icon"
                                                    onClick={() => setIsCalendarModalOpen(true)}
                                                />
                                            </div>
                                            <div className="task-list-horizontal">
                                                {getSortedItems(columnId, columnData.items).map(
                                                    (item, index) => {
                                                        const daysLeft = getDaysLeft(item.dueDate);
                                                        let ddayText = "";
                                                        if (daysLeft === null) {
                                                            ddayText = "날짜 미정";
                                                        } else if (daysLeft > 0) {
                                                            ddayText = `D-${daysLeft}`;
                                                        } else if (daysLeft === 0) {
                                                            ddayText = "오늘 마감!";
                                                        } else {
                                                            ddayText = "기한 만료";
                                                        }
                                                        return (
                                                            <Draggable
                                                                key={item.id}
                                                                draggableId={item.id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        className={`kanban-task-card horizontal-card ${
                                                                            snapshot.isDragging ? "dragging" : ""
                                                                        }`}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <div
                                                                            className={`priority-ribbon priority-${
                                                                                item.priority || "낮음"
                                                                            }`}
                                                                        >
                                                                            {item.priority || "낮음"}
                                                                        </div>
                                                                        <div className="task-assignee">
                                                                            <img
                                                                                src={defaultUser}
                                                                                alt="User"
                                                                                className="assignee-avatar"
                                                                            />
                                                                            <span className="assignee-name">
                                        {item.userName || "미지정"}
                                      </span>
                                                                        </div>
                                                                        <div className="task-title" style={{ marginTop: "10px" }}>
                                                                            {item.title}
                                                                        </div>
                                                                        <div className="task-desc">{item.description}</div>
                                                                        <div className="task-startDate">
                                                                            <span className="start-label">시작: </span>
                                                                            <span className="start-date-text">
                                        {item.startDate
                                            ? new Date(item.startDate).toLocaleDateString()
                                            : "미설정"}
                                      </span>
                                                                        </div>
                                                                        <div className="task-dueDate">
                                                                            <span className="due-label">마감: </span>
                                                                            <span className="due-date-text">
                                        {item.dueDate
                                            ? new Date(item.dueDate).toLocaleDateString()
                                            : "미설정"}
                                      </span>
                                                                            <span className="dday-text">({ddayText})</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    }
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            );
                        })}
                    </div>
                </div>
            </DragDropContext>

            {/* 달력 모달 (조건부 렌더링) */}
            {isCalendarModalOpen && (
                <TeamTodoCalendarModal team={{ id: teamId }} onClose={() => setIsCalendarModalOpen(false)} />
            )}
        </div>
    );
}

export default TeamTodoContentPage;
