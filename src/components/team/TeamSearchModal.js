import React, { useState, useMemo } from "react";
import "../team/css/TeamSearchModal.css";
import TeamApplyModal from "./TeamApplyModal";
import TeamDetailModal from "./TeamDetailModal";

const TeamSearchModal = ({ isOpen, onClose, teamsData, currentUserId }) => {
    // 검색어 및 선택된 카테고리 상태
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    // 정렬 기준 (기본: "name")
    const [sortCriterion, setSortCriterion] = useState("name");
    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // 팀 신청 모달 관련 상태
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [selectedTeamForApply, setSelectedTeamForApply] = useState(null);
    // 모달 오픈 상태 & 선택된 팀
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);

    console.debug("TeamSearchModal - teamsData:", teamsData);
    console.debug("TeamSearchModal - currentUserId:", currentUserId);

    // 1) 검색어 필터: 팀의 이름과 설명을 소문자로 변환하여 비교
    const searchedTeams = useMemo(() => {
        return teamsData.filter((team) => {
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

    // 3) 정렬: 이름순, 멤버 수순, 상태순
    const sortedTeams = useMemo(() => {
        const teamsCopy = [...filteredTeams];
        if (sortCriterion === "name") {
            teamsCopy.sort((a, b) => (a.teamName || "").localeCompare(b.teamName || ""));
        } else if (sortCriterion === "members") {
            teamsCopy.sort((a, b) => {
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

    const goToPage = (pageNum) => setCurrentPage(pageNum);

    // 팀 신청 모달 열기 핸들러
    const handleOpenApplyModal = (team) => {
        setSelectedTeamForApply(team);
        setApplyModalOpen(true);
    };

    if (!isOpen) return null;


    return (
        <>
            <div className="modal-overlay-search">
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
                                <th>신청</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedTeams
                                .slice((currentPage-1)*pageSize, currentPage*pageSize)
                                .map((team, idx) => (
                                    <tr
                                        key={team.id}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            setSelectedTeamId(team.id);
                                            setDetailOpen(true);
                                        }}
                                    >
                                        <td>{(currentPage - 1) * pageSize + idx + 1}</td>
                                        <td>{team.teamName}</td>
                                        <td>{team.description}</td>
                                        <td>{team.category}</td>
                                        <td>{team.members ? team.members.length : 0}명</td>
                                        <td>
                                            <button
                                                className="team-btn-apply"
                                                onClick={() => handleOpenApplyModal(team)}
                                            >
                                                신청
                                            </button>
                                        </td>
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
            {/* 팀 신청 모달 출력 */}
            {applyModalOpen && selectedTeamForApply && (
                <TeamApplyModal
                    isOpen={applyModalOpen}
                    onClose={() => {
                        setApplyModalOpen(false);
                        setSelectedTeamForApply(null);
                    }}
                    team={selectedTeamForApply}
                    userId={currentUserId} // AuthContext에서 전달받은 currentUserId
                />
            )}

            {/* 팀 상세 모달 */}
            <TeamDetailModal
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                teamId={selectedTeamId}
            />

        </>
    );
};

export default TeamSearchModal;
