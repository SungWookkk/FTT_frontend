import React, { useState, useMemo } from "react";
import "../team/css/TeamSearchModal.css";

const TeamSearchModal = ({ isOpen, onClose, teamsData }) => {
    // 검색어 및 선택된 카테고리 상태
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    // 정렬 기준 (기본: "name")
    const [sortCriterion, setSortCriterion] = useState("name");
    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    console.debug("TeamSearchModal - teamsData:", teamsData);

    // 1) 검색어 필터 (팀의 이름과 설명을 소문자로 변환하여 비교)
    const searchedTeams = useMemo(() => {
        return teamsData.filter((team, index) => {
            console.debug(`TeamSearchModal: 필터링 team[${index}]`, team);
            const teamName = team.teamName ? team.teamName.toLowerCase() : "";
            const teamDesc = team.description ? team.description.toLowerCase() : "";
            const lowerSearchTerm = searchTerm.toLowerCase();
            return teamName.includes(lowerSearchTerm) || teamDesc.includes(lowerSearchTerm);
        });
    }, [teamsData, searchTerm]);

    // 2) 카테고리 필터
    const filteredTeams = useMemo(() => {
        if (!selectedCategory) return searchedTeams;
        return searchedTeams.filter((team) => team.category === selectedCategory);
    }, [searchedTeams, selectedCategory]);

    // 3) 정렬 (이름순, 멤버 수순, 상태순)
    const sortedTeams = useMemo(() => {
        const teamsCopy = [...filteredTeams];
        if (sortCriterion === "name") {
            // 이름이 undefined일 경우 빈 문자열("")로 대체 후 localeCompare
            teamsCopy.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else if (sortCriterion === "members") {
            teamsCopy.sort((a, b) => {
                // team.members는 배열이므로 길이를 비교
                return (a.members ? a.members.length : 0) - (b.members ? b.members.length : 0);
            });
        } else if (sortCriterion === "status") {
            teamsCopy.sort((a, b) => {
                const statusA = a.status ? a.status.toLowerCase() : "pending";
                const statusB = b.status ? b.status.toLowerCase() : "pending";
                if (statusA === statusB) return 0;
                return statusA === "active" ? -1 : 1;
            });
        }
        return teamsCopy;
    }, [filteredTeams, sortCriterion]);

    // 페이지네이션 계산
    const totalTeams = sortedTeams.length;
    const totalPages = Math.ceil(totalTeams / pageSize);

    const goToPage = (pageNum) => {
        setCurrentPage(pageNum);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={onClose}>
                        X
                    </button>
                    <h2 className="modal-title">팀 목록</h2>
                    <div className="modal-search-row">
                        <input
                            type="text"
                            className="modal-search-input"
                            placeholder="팀 이름 / 설명 검색"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="modal-filter-header">
                        <div className="modal-category-btn-group">
                            {["", "공부", "운동", "AI", "코딩", "취업", "알바"].map((cat) => (
                                <button
                                    key={cat === "" ? "전체" : cat}
                                    className={`modal-category-btn ${selectedCategory === cat ? "selected" : ""}`}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {cat === "" ? "전체" : cat}
                                </button>
                            ))}
                        </div>
                        <div className="modal-sort-dropdown-group">
                            <span className="sort-label">정렬 기준:</span>
                            <select
                                className="modal-sort-dropdown"
                                value={sortCriterion}
                                onChange={(e) => {
                                    setSortCriterion(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="name">이름순</option>
                                <option value="members">멤버 수순</option>
                                <option value="status">상태순</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-table-container">
                        <table className="modal-team-table">
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>팀 이름</th>
                                <th>설명</th>
                                <th>카테고리</th>
                                <th>멤버 수</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedTeams
                                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                                .map((team, idx) => (
                                    <tr key={team.id} style={{ cursor: "pointer" }}>
                                        <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                                        <td>{team.teamName}</td>
                                        <td>{team.description}</td>
                                        <td>{team.category}</td>
                                        {/* team.members는 객체 배열이므로 길이를 출력 */}
                                        <td>{team.members ? team.members.length : 0}명</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-pagination">
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    className={`modal-page-btn ${currentPage === pageNum ? "active" : ""}`}
                                    onClick={() => goToPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamSearchModal;
