import React, { useState, useEffect } from "react";
import "../team/css/TeamDropdown.css";

function TeamDropdown() {
    // 예시 팀 목록
    const [teams] = useState([
        { id: 1, name: "Test 팀" },
        { id: 2, name: "Test2 팀" },
    ]);

    // 선택된 팀 (기본값: 첫 번째)
    const [selectedTeam, setSelectedTeam] = useState(teams[0]);

    // 드롭다운 열림/닫힘
    const [open, setOpen] = useState(false);

    // 드롭다운 토글
    const toggleDropdown = (e) => {
        e.stopPropagation();
        setOpen(!open);
    };

    // 팀 선택
    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
        setOpen(false);
        // 필요 시 상위에 콜백 전달
    };

    // 바깥 클릭 시 닫기
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
                <span className="team-dropdown-text">{selectedTeam.name}</span>
            </div>

            {/* 드롭다운 목록 */}
            {open && (
                <div className="team-dropdown-list">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            className="team-dropdown-item"
                            onClick={() => handleSelectTeam(team)}
                        >
                            <span className="team-dropdown-icon">🎉</span>
                            {team.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TeamDropdown;
