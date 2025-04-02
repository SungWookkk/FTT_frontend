import React, { useState, useMemo } from "react";
import "../team/css/TeamSearchModal.css";

const TeamSearchModal = ({ isOpen, onClose, teamsData }) => {
    // 검색어 & 선택된 카테고리
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // 정렬 기준 (기본: "name")
    const [sortCriterion, setSortCriterion] = useState("name");

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // 한 페이지에 10개씩

    // 1) 검색어 필터
    const searchedTeams = useMemo(() => {
        return teamsData.filter((team) =>
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.desc.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teamsData, searchTerm]);

    // 2) 카테고리 필터
    const filteredTeams = useMemo(() => {
        if (!selectedCategory) {
            return searchedTeams;
        }
        return searchedTeams.filter((team) => team.category === selectedCategory);
    }, [searchedTeams, selectedCategory]);

    // 3) 정렬 (이름순, 멤버 수순, 상태순)
    const sortedTeams = useMemo(() => {
        const teamsCopy = [...filteredTeams];
        if (sortCriterion === "name") {
            // 이름순
            teamsCopy.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortCriterion === "members") {
            // 멤버 수 오름차순
            teamsCopy.sort((a, b) => a.members - b.members);
        } else if (sortCriterion === "status") {
            // 상태순: Active 먼저, 그다음 Pending (예시)
            teamsCopy.sort((a, b) => {
                if (a.status === b.status) return 0;
                return a.status === "Active" ? -1 : 1;
            });
        }
        return teamsCopy;
    }, [filteredTeams, sortCriterion]);

    // 페이지네이션 계산
    const totalTeams = sortedTeams.length;
    const totalPages = Math.ceil(totalTeams / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentTeams = sortedTeams.slice(startIndex, endIndex);

    // 페이지 이동 함수
    const goToPage = (pageNum) => {
        setCurrentPage(pageNum);
    };

    if (!isOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

    return (
        <div className="modal-overlay">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {/* 빨간 동그라미 X 버튼 */}
                <button className="close-button" onClick={onClose}>
                    X
                </button>

                {/* 모달 헤더 */}
                <h2 className="modal-title">팀 목록</h2>

                {/* 검색 폼 */}
                <div className="modal-search-row">
                    <input
                        type="text"
                        className="modal-search-input"
                        placeholder="팀 이름 / 설명 검색"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // 검색 시 페이지 초기화
                        }}
                    />
                </div>

                {/* 카테고리 + 정렬 기준을 한 줄에 배치 */}
                <div className="modal-filter-header">
                    {/* 카테고리 버튼 그룹 */}
                    <div className="modal-category-btn-group">
                        {["", "공부", "운동", "AI", "코딩", "취업", "알바"].map((cat) => (
                            <button
                                key={cat === "" ? "전체" : cat}
                                className={`modal-category-btn ${
                                    selectedCategory === cat ? "selected" : ""
                                }`}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setCurrentPage(1); // 카테고리 변경 시 페이지 초기화
                                }}
                            >
                                {cat === "" ? "전체" : cat}
                            </button>
                        ))}
                    </div>

                    {/* 정렬 기준 드롭다운 */}
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

                {/* 테이블 */}
                <div className="modal-table-container">
                    <table className="modal-team-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>팀 이름</th>
                            <th>설명</th>
                            <th>카테고리</th>
                            <th>멤버 수</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentTeams.map((team, idx) => (
                            <tr key={team.id}>
                                <td>{startIndex + idx + 1}</td>
                                <td>{team.name}</td>
                                <td>{team.desc}</td>
                                <td>{team.category}</td>
                                <td>{team.members}명</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                <div className="modal-pagination">
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                            <button
                                key={pageNum}
                                className={`modal-page-btn ${
                                    currentPage === pageNum ? "active" : ""
                                }`}
                                onClick={() => goToPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TeamSearchModal;
