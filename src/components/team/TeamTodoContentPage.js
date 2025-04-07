import React, { useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import TeamDropdown from "./TeamDropdown";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import defaultUser from "../../Auth/css/img/default-user.svg";
import "../team/css/TeamTodoContentPage.css";

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

/** 초기 데이터  */
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
        ],
    },
};

function TeamTodoContentPage() {
    const { teamId } = useParams();
    const history = useHistory();
    const location = useLocation();

    // 현재 탭 활성화
    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;

    const [columns, setColumns] = useState(initialColumns);

    const [collapsed, setCollapsed] = useState(false);
    // 0 ~ 3: 각 컬럼이 순서대로 나타나는 단계를 제어
    const [expandStep, setExpandStep] = useState(3); // 기본(처음)은 모두 보임

    // 컬럼 순서 고정: onHold → inProgress → done
    const colOrder = ["onHold", "inProgress", "done"];

    const handleToggle = () => {
        if (!collapsed) {
            // 접기 => "진행중" 컬럼만 남기고 나머지는 숨김
            setCollapsed(true);
            // 진행중만 보이게 step=2로
            setExpandStep(2);
        } else {
            // 펼치기 => 순차로 onHold -> inProgress -> done
            setCollapsed(false);
            // 처음에는 아무것도 안 보이게 step=0
            setExpandStep(0);
            // 0.3초 간격으로 step을 1->2->3
            setTimeout(() => setExpandStep(1), 300);
            setTimeout(() => setExpandStep(2), 600);
            setTimeout(() => setExpandStep(3), 900);
        }
    };

    // 드래그 종료 시 실행
    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        if (source.droppableId === destination.droppableId) {
            // 같은 컬럼 내에서 순서 변경
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: { ...column, items: copiedItems },
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
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
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
                <div className="header-button-group">
                    <button className="btn btn-team-create">팀 작업 생성하기</button>
                </div>
            </div>

            {/* 탭 */}
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

            <div style={{ marginBottom: "16px" }}>
                <button className="btn-collapse-toggle" onClick={handleToggle}>
                    {collapsed ? "펼치기" : "접기"}
                </button>
            </div>

            {/* 드래그앤드롭 컨텍스트 */}
            <DragDropContext onDragEnd={onDragEnd}>


                {Object.entries(columns).map(([columnId, columnData]) => {
                    return null;
                })}

                {/*
                */}
                <div className="kanban-columns">
                    {colOrder.map((columnId, idx) => {
                        const columnData = columns[columnId];
                        if (!columnData) return null;

                        if (collapsed && columnId !== "inProgress") {
                            return null;
                        }
                        if (!collapsed && expandStep < (idx + 1)) {
                            return null;
                        }

                        return (
                            <Droppable
                                droppableId={columnId}
                                key={columnId}
                                direction="horizontal"
                            >
                                {(provided) => (
                                    <div
                                        className={`kanban-column fade-in-left`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <h3 className="column-title">
                                            {columnData.name} (
                                            {columnData.items.length})
                                        </h3>
                                        <div className="task-list-horizontal">
                                            {columnData.items.map(
                                                (item, index) => {
                                                    const daysLeft = getDaysLeft(
                                                        item.dueDate
                                                    );
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
                                                            draggableId={
                                                                item.id
                                                            }
                                                            index={index}
                                                        >
                                                            {(
                                                                provided,
                                                                snapshot
                                                            ) => (
                                                                <div
                                                                    className={`kanban-task-card horizontal-card ${
                                                                        snapshot.isDragging
                                                                            ? "dragging"
                                                                            : ""
                                                                    }`}
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    {/* 우선순위 띠 */}
                                                                    <div
                                                                        className={`priority-ribbon priority-${
                                                                            item.priority ||
                                                                            "낮음"
                                                                        }`}
                                                                    >
                                                                        {item.priority ||
                                                                            "낮음"}
                                                                    </div>
                                                                    {/* 담당자 */}
                                                                    <div className="task-assignee">
                                                                        <img
                                                                            src={
                                                                                defaultUser
                                                                            }
                                                                            alt="User"
                                                                            className="assignee-avatar"
                                                                        />
                                                                        <span className="assignee-name">
                                                                            {item.userName ||
                                                                                "미지정"}
                                                                        </span>
                                                                    </div>
                                                                    {/* 제목 */}
                                                                    <div
                                                                        className="task-title"
                                                                        style={{
                                                                            marginTop:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </div>
                                                                    {/* 설명 */}
                                                                    <div className="task-desc">
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </div>
                                                                    {/* 시작일 */}
                                                                    <div className="task-startDate">
                                                                        <span className="start-label">
                                                                            시작:{" "}
                                                                        </span>
                                                                        <span className="start-date-text">
                                                                            {item.startDate
                                                                                ? new Date(
                                                                                    item.startDate
                                                                                ).toLocaleDateString()
                                                                                : "미설정"}
                                                                        </span>
                                                                    </div>
                                                                    {/* 마감일 + D-Day */}
                                                                    <div className="task-dueDate">
                                                                        <span className="due-label">
                                                                            마감:{" "}
                                                                        </span>
                                                                        <span className="due-date-text">
                                                                            {item.dueDate
                                                                                ? new Date(
                                                                                    item.dueDate
                                                                                ).toLocaleDateString()
                                                                                : "미설정"}
                                                                        </span>
                                                                        <span className="dday-text">
                                                                            (
                                                                            {
                                                                                ddayText
                                                                            }
                                                                            )
                                                                        </span>
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
            </DragDropContext>
        </div>
    );
}

export default TeamTodoContentPage;
