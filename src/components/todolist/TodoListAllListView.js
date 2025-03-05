import React, { useState } from "react";
import "../todolist/css/TodoListContent.css";
import { useHistory } from "react-router-dom";
import "../todolist/css/TodoListAllListView.css";

const TodoListAllListView = () => {
    const history = useHistory();

    // 기존 섹션 데이터 (필요에 따라 실제 데이터 소스와 연결 가능)
    const sections = [
        {
            title: "📍 최근 작성",
            color: "#ffa500",
            tasks: [
                { id: 1, title: "어서 마무리를 하자", description: "이거 빨리 디자인을 마무리해야 해..." },
                { id: 2, title: "내 파일을 찾아줘", description: "UI 작업이 너무 오래 걸림" },
                { id: 3, title: "근데 아마 이걸로 할 거 같은데", description: "이번 디자인으로 끝내자" }
            ]
        },
        {
            title: "⏳ 마감 임박",
            color: "#e74c3c",
            tasks: [
                { id: 4, title: "프레젠테이션 준비", description: "내일까지 발표 자료 완성" },
                { id: 5, title: "코드 리뷰", description: "PR 코드 리뷰 마감일 준수" },
                { id: 6, title: "서류 제출", description: "업무 보고서 제출 기한 체크" }
            ]
        },
        {
            title: "🔥 남은 To Do",
            color: "#3498db",
            tasks: [
                { id: 7, title: "새로운 기능 개발", description: "API 설계 및 구현 진행" },
                { id: 8, title: "UI 리팩토링", description: "디자인 개선 사항 적용" },
                { id: 9, title: "성능 최적화", description: "페이지 로딩 속도 개선" }
            ]
        },
        {
            title: "✅ 완료됨",
            color: "#27ae60",
            tasks: [
                { id: 10, title: "배포 완료", description: "최신 버전 배포 완료" },
                { id: 11, title: "버그 수정 완료", description: "긴급 수정 사항 반영" },
                { id: 12, title: "코드 리팩토링", description: "불필요한 코드 정리" }
            ]
        }
    ];

    //  생성하기 버튼 클릭
    const handleCreateClick = () => {
        history.push("/todo/write");
    };
    // "전체 목록" 버튼 클릭 시 페이지 이동
    const handleAllListViewClick = () => {
        history.push("/todo/list-all"); //  페이지 이동
    };
    // "내 목록 " 버튼 클릭 시 페이지 이동
    const handleMyListClick = () => {
        history.push("/todo"); //  페이지 이동
    };
    // 모든 섹션의 task들을 하나의 배열로 병합
    const allTasks = sections.reduce((acc, section) => {
        const tasksWithSection = section.tasks.map(task => ({
            ...task,
            sectionTitle: section.title,
            sectionColor: section.color
        }));
        return acc.concat(tasksWithSection);
    }, []);

    // 필터
    const [filterOption, setFilterOption] = useState("all");
    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
    };

    // 입력 값과 검색 옵션
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOption, setSearchOption] = useState("both");
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleSearchOptionChange = (e) => {
        setSearchOption(e.target.value);
    };

    let displayTasks = [...allTasks];

    // 필터 적용
    if (filterOption === "completed") {
        displayTasks = displayTasks.filter(task => task.sectionTitle === "✅ 완료됨");
    } else if (filterOption === "dueSoon") {
        displayTasks = displayTasks.filter(task => task.sectionTitle === "⏳ 마감 임박");
    }

    // 검색 적용
    if (searchQuery.trim() !== "") {
        const query = searchQuery.trim().toLowerCase();
        if (searchOption === "title") {
            displayTasks = displayTasks.filter(task => task.title.toLowerCase().includes(query));
        } else if (searchOption === "description") {
            displayTasks = displayTasks.filter(task => task.description.toLowerCase().includes(query));
        } else { 
            displayTasks = displayTasks.filter(
                task =>
                    task.title.toLowerCase().includes(query) ||
                    task.description.toLowerCase().includes(query)
            );
        }
    }
  return(
      <div className="dashboard-content">
          {/* 작업공간 헤더 */}
          <div className="dashboard-header">
              <div className="dashboard-title">
                  <span className="title-text">To Do List - 작업 공간</span>
              </div>
              <div className="header-button-group">
                  <button
                      className="btn btn-create"
                      onClick={handleCreateClick}
                  >
                      생성하기
                  </button>
                  <button className="btn btn-edit">수정</button>
                  <button className="btn btn-delete">삭제</button>
              </div>
          </div>
          {/* 목록 선택 탭 */}
          <div className="list-tap">
              <div className="list-tab-container">
                  <div className="tab-item" onClick={handleMyListClick}>내 목록</div>
                  <div className="tab-item active" onClick={handleAllListViewClick}>전체 목록</div>
                  <div className="tab-item">팀</div>
              </div>
          </div>
          {/* 알림 배너 */}
          <div className="alert-banner-todo">
              <p className="alert-text-todo1">
                  <span className="highlight-text">효율적인 하루</span>
                  <span className="normal-text">를 설계하세요! 우리의 </span>
                  <span className="highlight-text">To-Do List 서비스</span>
                  <span className="normal-text">
                        를 통해 목표를 정리하고 실천하세요. 지금 바로 시작해보세요!
                    </span>
              </p>
          </div>

          {/* 필터 & 검색 컨트롤 */}
          <div className="filter-container">
              <div className="filter-item">
                  <label htmlFor="filterSelect">필터:</label>
                  <select id="filterSelect" value={filterOption} onChange={handleFilterChange}>
                      <option value="all">전체 작업 보기</option>
                      <option value="completed">완료된 작업만 보기</option>
                      <option value="dueSoon">마감 임박 작업 보기</option>
                  </select>
              </div>
              <div className="filter-item">
                  <label htmlFor="searchQuery">검색:</label>
                  <input
                      type="text"
                      id="searchQuery"
                      value={searchQuery}
                      onChange={handleSearchQueryChange}
                      placeholder="검색어 입력"
                  />
                  <select value={searchOption} onChange={handleSearchOptionChange}>
                      <option value="title">제목만 검색</option>
                      <option value="description">내용만 검색</option>
                      <option value="both">제목+내용 검색</option>
                  </select>
              </div>
          </div>


          {/* 모든 작업을 통합한 그리드 */}
          <div className="all-tasks-grid">
              {displayTasks.map((task) => {
                  // 완료됨 여부 확인
                  const isCompleted = task.sectionTitle === "✅ 완료됨";
                  return (
                      <div
                          key={task.id} 
                          className={`all-list-task-card ${isCompleted ? "completed-task-card" : ""}`}
                      >
                          <div
                              className="task-section-badge"
                              style={{ backgroundColor: task.sectionColor }}
                          >
                              {task.sectionTitle}
                          </div>
                          <div className="all-list-task-title">{task.title}</div>
                          <div className="all-list-task-desc">{task.description}</div>
                      </div>
                  );
              })}
          </div>
      </div>

  )
}

export default TodoListAllListView;