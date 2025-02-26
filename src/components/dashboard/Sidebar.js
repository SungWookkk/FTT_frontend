import { Link, useLocation } from "react-router-dom";
import "./css/Sidebar.css";
import SidebarBackground from "./SidebarBackground";
import DashboardIcon from "../../../src/Auth/css/img/Dashboard.svg";
import ToDoIcon from "../../../src/Auth/css/img/Todolist.svg";
import StatisticsIcon from "../../../src/Auth/css/img/statistics.svg";
import BadgeIcon from "../../../src/Auth/css/img/badge.svg";
import CommunityIcon from "../../../src/Auth/css/img/community.svg";
import plus from "../../../src/Auth/css/img/plus.svg";
import userinfo from "../../../src/Auth/css/img/userinfo.svg"; // 사용자 아이콘 추가
import SidebarFavorites from "./SidebarFavorites"; // 추가된 컴포넌트
const Sidebar = () => {
    const location = useLocation(); // 현재 활성화된 URL을 가져옴

    return (
        <div className="sidebar-container">
            <SidebarBackground />

            {/* 사용자 정보 영역 */}
            <div className="sidebar-user">
                <img className="user-icon" src={userinfo} alt="User Icon" />
                <span className="user-name">박성욱의 워크스페이스</span>
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
                    <li className={location.pathname === "/community" ? "active" : ""}>
                        <Link to="/community">
                            <img className="icon" src={CommunityIcon} alt="Community Icon"/>
                            <span>커뮤니티</span>
                        </Link>
                    </li>
                    <li className={location.pathname === "/plus" ? "active" : ""}>
                        <Link to="/plus">
                            <img className="icon" src={plus} alt="plus Icon"/>
                            <span>더보기</span>
                        </Link>
                    </li>
                </ul>
                {/* 🔹 추가된 Favorites 섹션 */}
                <SidebarFavorites/>
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
