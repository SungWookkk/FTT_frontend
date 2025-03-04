import "../todolist/css/TodoListContent.css";
import { useHistory } from "react-router-dom";


const TodoListAllListView = () => {
    const history = useHistory();

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
              <p className="alert-text-todo">
                  <span className="highlight-text">효율적인 하루</span>
                  <span className="normal-text">를 설계하세요! 우리의 </span>
                  <span className="highlight-text">To-Do List 서비스</span>
                  <span className="normal-text">
                        를 통해 목표를 정리하고 실천하세요. 지금 바로 시작해보세요!
                    </span>
              </p>
          </div>


      </div>
  )
}

export default TodoListAllListView;