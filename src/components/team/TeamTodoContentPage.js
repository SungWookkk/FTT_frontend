import React, { useState, useEffect } from "react";
import axios from "axios"; // 서버통신용
import { useHistory, useLocation, useParams } from "react-router-dom";
import TeamDropdown from "./TeamDropdown";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import defaultUser from "../../Auth/css/img/default-user.svg";
import "../team/css/TeamTodoContentPage.css";
import calendar from "../../Auth/css/img/calendar.svg";
import TeamTodoCalendarModal from "./TeamTodoCalendarModal";
import TeamTodoCreateModal from "./TeamTodoCreateModal";
import {useAuth} from "../../Auth/AuthContext";

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

// 초기 컬럼 구조 (items는 처음에 빈 배열)
const initialColumns = {
    onHold: {
        name: "진행 예정",
        items: [],
    },
    inProgress: {
        name: "진행중",
        items: [],
    },
    done: {
        name: "완료",
        items: [],
    },
};

function TeamTodoContentPage() {
    const { teamId } = useParams();
    const { auth } = useAuth();
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
    const [folded, setFolded] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    //  컴포넌트 마운트 시(or teamId 변경 시), 서버에서 작업 목록 불러오기
    useEffect(() => {
        axios
            .get(`/api/team/${teamId}/tasks`) // 실제 API 엔드포인트
            .then((res) => {
                const tasks = res.data || []; // 서버에서 받아온 작업 배열

                // status에 따라 분류 (실제 status 값 확인 필요: ex. "TODO", "진행중", "DONE" 등)
                const onHoldTasks = tasks.filter((task) => task.status === "TODO" || task.status === "진행 예정");
                const inProgressTasks = tasks.filter((task) => task.status === "진행중");
                const doneTasks = tasks.filter((task) => task.status === "DONE" || task.status === "완료");

                setColumns({
                    onHold: {
                        name: "진행 예정",
                        items: onHoldTasks,
                    },
                    inProgress: {
                        name: "진행중",
                        items: inProgressTasks,
                    },
                    done: {
                        name: "완료",
                        items: doneTasks,
                    },
                });
            })
            .catch((err) => {
                console.error("작업 목록 불러오기 실패:", err);
            });
    }, [teamId]);

    // 드래그 앤 드롭
    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // 로컬 state 업데이트 전에, 이동한 작업의 새 상태를 결정
        const statusMapping = {
            onHold: "진행 예정",     // onHold 컬럼 => 진행 예정
            inProgress: "진행중",     // inProgress 컬럼 => 진행중
            done: "완료",            // done 컬럼 => 완료
        };

        // 만약 같은 컬럼 내의 재정렬이면 그냥 로컬 state만 업데이트합니다.
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
            // 다른 컬럼 간 이동인 경우
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            // 새 상태 결정 (destination.droppableId에 따라)
            const newStatus = statusMapping[destination.droppableId];

            // 로컬 state 업데이트
            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
            });

            // 서버에 상태 변경 PATCH 요청
            axios
                .patch(`/api/team/${teamId}/tasks/${removed.id}`, { status: newStatus })
                .then((res) => {
                    console.log("작업 상태 업데이트 성공:", res.data);
                })
                .catch((err) => {
                    console.error("작업 상태 업데이트 실패:", err);
                });
        }
    };

    // (3) 정렬 함수
    const getSortedItems = (columnId, items) => {
        const sortedItems = [...items].sort((a, b) => {
            const sortBy = sortOrders[columnId];
            if (sortBy === "priority") {
                const priorityValue = { 높음: 3, 중간: 2, 낮음: 1 };
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
                    <button
                        className="btn btn-team-create"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        팀 작업 생성하기
                    </button>
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
                    <span className="normal-text">
            하는 공간입니다. 서로의 아이디어와 역량을 모아{" "}
          </span>
                    <span className="highlight-text">시너지를 발휘</span>
                    <span className="normal-text">하며, 매일의 과제를 </span>
                    <span className="highlight-text">함께 해결</span>
                    <span className="normal-text">
            해 보세요. 작지만 꾸준한 노력들이 모여{" "}
          </span>
                    <span className="highlight-text">팀의 성장</span>
                    <span className="normal-text">을 이끌어냅니다!</span>
                </p>
            </div>

            {/* 드래그 앤 드롭 컨텍스트 */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-columns">
                    <Droppable droppableId="onHold" direction="horizontal">
                        {(provided) => (
                            <div
                                className="kanban-column"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <div className="column-header">
                                    <div className="header-left">
                                        <h3 className="column-title1">
                                            {columns.onHold.name} ({columns.onHold.items.length})
                                        </h3>
                                    </div>
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
                                        <button className="fold-toggle-btn" onClick={() => setFolded(!folded)}>
                                            {folded ? "펼치기" : "접기"}
                                        </button>
                                    </div>
                                </div>
                                <div className="task-list-horizontal">
                                    {getSortedItems("onHold", columns.onHold.items).map((item, index) => {
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
                                                key={String(item.id)}
                                                draggableId={String(item.id)}
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
                                                        <div className={`priority-ribbon priority-${item.priority || "낮음"}`}>
                                                            {item.priority || "낮음"}
                                                        </div>
                                                        <div className="task-assignee">
                                                            <img
                                                                src={defaultUser}
                                                                alt="User"
                                                                className="assignee-avatar"
                                                            />
                                                            <span className="assignee-name">
                                                            {item.user?.username || "미지정"}
                                                          </span>
                                                        </div>
                                                        <div className="task-title" style={{ marginTop: "10px" }}>
                                                            {item.title}
                                                        </div>
                                                        <div className="task-desc">
                                                            {item.description}
                                                        </div>
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
                                    })}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>

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
                                                {getSortedItems(columnId, columnData.items).map((item, index) => {
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
                                                            key={String(item.id)}
                                                            draggableId={String(item.id)}
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
                                                                    <div className={`priority-ribbon priority-${item.priority || "낮음"}`}>
                                                                        {item.priority || "낮음"}
                                                                    </div>
                                                                    <div className="task-assignee">
                                                                        <img
                                                                            src={defaultUser}
                                                                            alt="User"
                                                                            className="assignee-avatar"
                                                                        />
                                                                        <span className="assignee-name">
                                                                        {item.user?.username || "미지정"}
                                                                    </span>
                                                                    </div>
                                                                    <div
                                                                        className="task-title"
                                                                        style={{
                                                                            marginTop: "10px",
                                                                        }}
                                                                    >
                                                                        {item.title}
                                                                    </div>
                                                                    <div className="task-desc">
                                                                        {item.description}
                                                                    </div>
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
                                                })}
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

            {folded && (
                <div className="empty-state-container">
                    <p className="empty-state-text">
                        진행 중, 완료된 작업이 현재 숨겨진 상태예요.
                        <br />
                        다시 보고 싶다면 <strong>펼치기</strong> 버튼을 눌러주세요!
                    </p>
                    <button
                        onClick={() => setFolded(false)}
                        className="empty-state-button"
                    >
                        펼치기
                    </button>
                </div>
            )}
            {isCalendarModalOpen && (
                <TeamTodoCalendarModal
                    team={{ id: teamId }}
                    onClose={() => setIsCalendarModalOpen(false)}
                />
            )}

            {/* "팀 작업 생성하기" 버튼 클릭 시 열리는 모달 */}
            {isCreateModalOpen && (
                <TeamTodoCreateModal
                    teamId={teamId}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSave={(newTask) => {
                        // 사용자 정보 없으면 강제로 추가
                        if (!newTask.user) {
                            newTask.user = { username: auth.userName };
                        }

                        // newTask.status 값으로 컬럼 결정
                        let columnKey = "inProgress"; // 기본값
                        if (newTask.status === "진행 예정" || newTask.status === "TODO") {
                            columnKey = "onHold";
                        } else if (newTask.status === "완료" || newTask.status === "DONE") {
                            columnKey = "done";
                        } else if (newTask.status === "진행중") {
                            columnKey = "inProgress";
                        }


                        setColumns((prevColumns) => {
                            // 기존 항목과 새 작업을 합쳐 새로운 배열 생성
                            const updatedColumn = {
                                ...prevColumns[columnKey],
                                items: [...prevColumns[columnKey].items, newTask],
                            };

                            return {
                                ...prevColumns,
                                [columnKey]: updatedColumn,
                            };
                        });
                    }}
                />
            )}
        </div>
    );
}

export default TeamTodoContentPage;
