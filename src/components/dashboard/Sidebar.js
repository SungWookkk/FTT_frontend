import {Link, useHistory, useLocation, useParams} from "react-router-dom";
import "./css/Sidebar.css";
import SidebarBackground from "./SidebarBackground";
import DashboardIcon from "../../../src/Auth/css/img/Dashboard.svg";
import ToDoIcon from "../../../src/Auth/css/img/Todolist.svg";
import StatisticsIcon from "../../../src/Auth/css/img/statistics.svg";
import BadgeIcon from "../../../src/Auth/css/img/badge.svg";
import CommunityIcon from "../../../src/Auth/css/img/community.svg";
import userinfo from "../../../src/Auth/css/img/default-user.svg";
import SidebarFavorites from "./SidebarFavorites";
import {useEffect, useState} from "react";
const Sidebar = ({onToggle}) => {
    const location = useLocation(); // 현재 활성화된 URL을 가져옴
    const [userName, setUserName] = useState();
    const history = useHistory();
    const { teamId } = useParams();

    // 팀 커뮤니티 경로 여부 teamId를 포함한 경로로 시작하는지 확인
    const isTeamCommunity = location.pathname.startsWith(`/team/${teamId}/community`);


    useEffect(() => {
        // 로그인 시 localStorage에 저장한 username 불러오기
        const storedUsername = localStorage.getItem("userName");
        if (storedUsername) {
            setUserName(storedUsername);
        }
    }, []);
    const handleClick = () => {
        history.push("/profile");
    };



    return (
        <div className="sidebar-container">
            <SidebarBackground/>

            {/* 사용자 정보 영역 */}
            <div className="sidebar-user" onClick={handleClick}>
                <img className="user-icon" src={userinfo} alt="User Icon" />
                <span className="user-name">{userName}의 공간</span>

                {/* 팀 커뮤니티 경로일 때 토글 버튼 표시 */}
                {isTeamCommunity && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onToggle) onToggle();
                        }}
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "10px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                        title="채팅 사이드바 전환"
                    >
                        채팅
                    </div>
                )}
            </div>

            <nav className="sidebar-content">
                <ul className="sidebar-menu">
                    <li className={location.pathname === "/dashboard" ? "active" : ""}>
                        <Link to="/dashboard">
                            <img className="icon" src={DashboardIcon} alt="Dashboard Icon"/>
                            <span>대시보드</span>
                        </Link>
                    </li>
                    <li className={location.pathname.startsWith("/todo") ? "active" : ""}>
                        <Link to="/todo">
                            <img className="icon" src={ToDoIcon} alt="To-Do Icon"/>
                            <span>To Do List</span>
                        </Link>
                    </li>
                    <li className={location.pathname === "/statistics" ? "active" : ""}>
                        <Link to="/statistics">
                            <img className="icon" src={StatisticsIcon} alt="Statistics Icon"/>
                            <span>통계</span>
                        </Link>
                    </li>
                    <li className={location.pathname === "/badges" ? "active" : ""}>
                        <Link to="/badges">
                            <img className="icon" src={BadgeIcon} alt="Badge Icon"/>
                            <span>뱃지</span>
                        </Link>
                    </li>
                    <li className={location.pathname.startsWith("/community") ? "active" : ""}>
                        <Link to="/community">
                            <img className="icon" src={CommunityIcon} alt="Community Icon"/>
                            <span>커뮤니티</span>
                        </Link>
                    </li>
                </ul>
                <SidebarFavorites teamId={teamId} />
                {/* 도움말 & 공유 버튼 */}
                <div className="help-section">
                    <button className="help-button">공유</button>
                    <div className="div-cu-simple-bar"/>
                    <button className="share-button">도움말</button>
                </div>
            </nav>
        </div>

    );
};

export default Sidebar;
