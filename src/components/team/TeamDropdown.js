import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import "../team/css/TeamDropdown.css";


// 임시 팀 목록
const DUMMY_TEAMS = [
    {
        id: 9991,
        teamName: "임시팀 A",
        description: "임시팀 A의 설명",
        announcement: "임시 공지 A",
        category: "코딩",
        members: [],
    },
    {
        id: 9992,
        teamName: "임시팀 B",
        description: "임시팀 B의 설명",
        announcement: "임시 공지 B",
        category: "공부",
        members: [],
    },
];

function TeamDropdown({ onTeamSelect }) {
    const { auth } = useAuth(); // 로그인 사용자 정보 (userId, userName 등)
    const [teams, setTeams] = useState([]);       // 사용자가 속한 팀 목록
    const [selectedTeam, setSelectedTeam] = useState(null); // 선택된 팀
    const [open, setOpen] = useState(false);       // 드롭다운 열림/닫힘 상태

    // (1) 컴포넌트 마운트 시(or userId 변경 시) 사용자 팀 목록 불러오기
    useEffect(() => {
        if (!auth || !auth.userId) return; // 로그인 정보가 없으면 return

        // 실제 서버 요청
        axios
            .get(`/api/teams/user/${auth.userId}`)
            .then((res) => {
                // 서버에서 팀 목록을 정상 응답받은 경우
                if (res.data && res.data.length > 0) {
                    setTeams(res.data);
                } else {
                    // 서버 응답은 성공했지만, 팀 목록이 비어있는 경우 → 임시 데이터로 대체
                    setTeams(DUMMY_TEAMS);
                }
            })
            .catch((err) => {
                console.error("팀 목록 불러오기 오류:", err);
                // 서버 요청 실패 시 임시 데이터로 대체
                setTeams(DUMMY_TEAMS);
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
        if (onTeamSelect) {
            onTeamSelect(team);
        }
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
                    - 처음에는 selectedTeam이 null이면 "소속 팀" 표시
                    - 사용자가 팀을 선택하면 해당 팀 이름 표시
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
