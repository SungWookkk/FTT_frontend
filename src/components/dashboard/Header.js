import React, {useContext} from "react";
import "./css/Header.css";
import logo from "../../../src/Auth/css/img/logo.svg";
import  AuthContext  from "../../Auth/AuthContext";
import {useHistory} from "react-router-dom";
import axios from "axios";

const Header = () => {
    const { logout } = useContext(AuthContext);
    const history = useHistory();

    const handleLogout = async () => {
        try {
            // localStorage에서 사용자 이름과 ID를 읽어올 때는 반드시 getItem() 메서드를 사용
            // localStorage에 값이 저장되어 있지 않거나 프로퍼티 접근 시 undefined가 발생하는 문제를 방지
            const userName = localStorage.getItem("userName");
            const userId = localStorage.getItem("userId");

            await axios.post('/api/auth/logout', { userName, userId });
            // AuthContext의 logout 함수를 호출하여 클라이언트의 인증 상태를 초기화
            logout();
            alert("로그아웃 했습니다.");
            history.push("/");
        } catch (error) {
            // 로그아웃 요청 실패 시 에러 메시지를 콘솔에 출력합니다.
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <header className="header">
            {/* 로고 */}
            <div className="header-logo">
                <img src={logo} alt="Logo" />
            </div>

            {/* 검색창 */}
            <div className="header-search">
                <input type="text" placeholder="검색" />
                <button>🔍</button>
            </div>

            {/* 사용자 정보 및 로그아웃 */}
            <div className="header-user">
                <div className="user-icon">M</div>
                <span className="logout" onClick={handleLogout}>
                    로그아웃
                </span>
            </div>
        </header>
    );
};

export default Header;
