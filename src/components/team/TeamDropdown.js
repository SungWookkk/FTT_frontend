import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import "../team/css/TeamDropdown.css";

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
    const { auth } = useAuth();
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const storedTeam = localStorage.getItem("selectedTeam");
        if (storedTeam) {
            setSelectedTeam(JSON.parse(storedTeam));
        }
    }, []);

    useEffect(() => {
        if (!auth || !auth.userId) return;

        axios
            .get(`/api/teams/user/${auth.userId}`)
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    setTeams(res.data);
                } else {
                    setTeams(DUMMY_TEAMS);
                }
            })
            .catch((err) => {
                console.error("팀 목록 불러오기 오류:", err);
                setTeams(DUMMY_TEAMS);
            });
    }, [auth]);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setOpen(!open);
    };

    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
        // 선택한 팀을 localStorage에도 저장
        localStorage.setItem("selectedTeam", JSON.stringify(team));

        setOpen(false);
        if (onTeamSelect) {
            onTeamSelect(team);
        }
    };

    useEffect(() => {
        const handleBodyClick = () => setOpen(false);
        document.body.addEventListener("click", handleBodyClick);
        return () => document.body.removeEventListener("click", handleBodyClick);
    }, []);

    return (
        <div className="team-dropdown-container">
            <div className="team-dropdown-label" onClick={toggleDropdown}>
                <span className="team-dropdown-icon">🎉</span>
                <span className="team-dropdown-text">
          {selectedTeam ? selectedTeam.teamName : "소속 팀"}
        </span>
            </div>

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
