import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";  // 로그인 정보(auth)를 가져오는 훅
import "../team/css/TeamDropdown.css";

function TeamDropdown() {
    const { auth } = useAuth(); // 로그인 사용자 정보 (userId, userName 등)
    const [teams, setTeams] = useState([]); // 사용자가 속한 팀 목록
    const [selectedTeam, setSelectedTeam] = useState(null); // 선택된 팀
    const [open, setOpen] = useState(false); // 드롭다운 열림/닫힘 상태

    // (1) 컴포넌트 마운트 시(or userId 변경 시) 사용자 팀 목록 불러오기
    useEffect(() => {
        if (!auth || !auth.userId) return; // 로그인 정보가 없으면 return

        // GET /api/teams/user/{userId}
        axios.get(`/api/teams/user/${auth.userId}`)
            .then((res) => {
                setTeams(res.data);
                // 기본적으로는 selectedTeam을 null로 두어 "소속 팀"이 표시되도록 유지
                // 필요하다면, res.data[0]을 기본 선택할 수도 있음
            })
            .catch((err) => {
                console.error("팀 목록 불러오기 오류:", err);
            });
    }, [auth]);

    // (2) 드롭다운 열기/닫기
    const toggleDropdown = (e) => {
        e.stopPropagation();
        setOpen(!open);
    };

    // (3) 팀 선택 시
    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
        setOpen(false);
    };

    // (4) 바깥 영역 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleBodyClick = () => setOpen(false);
        document.body.addEventListener("click", handleBodyClick);
        return () => document.body.removeEventListener("click", handleBodyClick);
    }, []);

    return (
        <div className="team-dropdown-container">
            {/* 드롭다운 라벨 (버튼) */}
            <div className="team-dropdown-label" onClick={toggleDropdown}>
                <span className="team-dropdown-icon">🎉</span>
                {/*
                    - 처음에는 selectedTeam이 null이므로 "소속 팀" 표시
                    - 사용자가 팀을 선택하면 selectedTeam.teamName 표시
                */}
                <span className="team-dropdown-text">
                    {selectedTeam ? selectedTeam.teamName : "소속 팀"}
                </span>
            </div>

            {/* 드롭다운 목록 */}
            {open && (
                <div className="team-dropdown-list">
                    {teams.length === 0 ? (
                        <div className="team-dropdown-item">팀이 없습니다.</div>
                    ) : (
                        teams.map((team) => (
                            <div
                                key={team.id}
                                className="team-dropdown-item"
                                onClick={() => handleSelectTeam(team)}
                            >
                                <span className="team-dropdown-icon">🎉</span>
                                {team.teamName}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default TeamDropdown;
