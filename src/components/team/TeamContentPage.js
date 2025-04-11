import React, { useState, useEffect } from "react";
import "../team/css/TeamContentPage.css";
import TeamDropdown from "./TeamDropdown";
import TeamSearchModal from "./TeamSearchModal";
import TeamCreateModal from "./TeamCreateModal";
import TeamAffiliationContentPage from "./TeamAffiliationContentPage";
import { useHistory } from "react-router-dom";
import axios from "axios";

const TeamContentPage = () => {
    const [teamsData, setTeamsData] = useState([]);
    const [isTeamsLoading, setIsTeamsLoading] = useState(true);

    useEffect(() => {
        console.debug("TeamContentPage: 백엔드 팀 목록 호출 시작");
        axios
            .get("/api/teams/all")
            .then((res) => {
                console.debug("TeamContentPage: 백엔드에서 받은 팀 데이터:", res.data);
                setTeamsData(res.data);
                setIsTeamsLoading(false);
            })
            .catch((err) => {
                console.error("TeamContentPage: 팀 목록 불러오기 오류:", err);
                setTeamsData([]);
                setIsTeamsLoading(false);
            });
    }, []);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [teamForAffiliation, setTeamForAffiliation] = useState(null);
    const history = useHistory();

    const handleDropdownTeamSelect = (team) => {
        console.debug("TeamContentPage: 드롭다운에서 선택한 팀:", team);
        setTeamForAffiliation(team);
        history.push(`/team/${team.id}`);
    };

    const filteredTeams =
        selectedCategory === ""
            ? teamsData
            : teamsData.filter((team) => {
                console.debug("TeamContentPage: 필터링 - team.category:", team.category);
                return team.category === selectedCategory;
            });

    const mainTeams = filteredTeams.slice(0, 7);
    console.debug("TeamContentPage: mainTeams 계산:", mainTeams);

    if (isTeamsLoading) return <div>팀 목록 로딩 중...</div>;

    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown onTeamSelect={handleDropdownTeamSelect} />
                </div>
                <div className="header-button-group">
                    <button
                        className="btn btn-create"
                        onClick={() => {
                            console.debug("TeamContentPage: 팀 생성 모달 열기");
                            setCreateModalOpen(true);
                        }}
                    >
                        팀 생성하기
                    </button>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner">
                <p className="alert-text">
                    <span className="highlight-text">팀</span>
                    <span className="normal-text">은 공동의 목표를 위해 함께 </span>
                    <span className="highlight-text">소통하고 협업</span>
                    <span className="normal-text">하는 공간입니다. 서로의 아이디어와 역량을 모아 </span>
                    <span className="highlight-text">시너지를 발휘</span>
                    <span className="normal-text">하며, 매일의 과제를 함께 해결해 보세요. 작지만 꾸준한 노력들이 모여 </span>
                    <span className="highlight-text">팀의 성장</span>
                    <span className="normal-text">을 이끌어냅니다!</span>
                </p>
            </div>

            <div className="content-wrapper">
                {/* 왼쪽 영역 */}
                <div className="no-team-section">
                    <div className="no-team-block bg-image">
                        <h2>팀이 없으신가요?</h2>
                        <p>팀에 참가해서 함께 목표를 이루어보세요!</p>
                        <button
                            className="no-team-btn"
                            onClick={() => {
                                console.debug("TeamContentPage: 팀 찾기 모달 열기");
                                setModalOpen(true);
                            }}
                        >
                            팀 찾기
                        </button>
                    </div>
                    <div className="no-team-block bg-image1">
                        <h2>팀 생성하기!</h2>
                        <p>팀을 직접 만들어서 공통된 목표를 가진 유저들을 모아봐요!</p>
                        <button
                            className="no-team-btn"
                            onClick={() => {
                                console.debug("TeamContentPage: 팀 생성 모달 열기 (좌측 안내)");
                                setCreateModalOpen(true);
                            }}
                        >
                            팀 만들기
                        </button>
                    </div>
                </div>

                <div className="vertical-divider"></div>

                {teamForAffiliation ? (
                    <TeamAffiliationContentPage team={teamForAffiliation} />
                ) : (
                    <div className="team-right-section">
                        {/* 추천 팀, FAQ, 후기 등 추가 */}
                    </div>
                )}

                <div className="team-right-section">
                    <div className="team-table-header">
                        <h3 className="team-table-title">추천 팀</h3>
                        <span className="team-count">총 {mainTeams.length}개 팀</span>
                    </div>

                    <div className="category-btn-group" style={{ marginBottom: "12px" }}>
                        {["", "공부", "운동", "AI", "코딩", "취업", "알바"].map((cat) => (
                            <button
                                key={cat === "" ? "전체" : cat}
                                className={`category-btn ${selectedCategory === cat ? "selected" : ""}`}
                                onClick={() => {
                                    console.debug("TeamContentPage: 카테고리 변경:", cat);
                                    setSelectedCategory(cat);
                                }}
                            >
                                {cat === "" ? "전체" : cat}
                            </button>
                        ))}
                    </div>

                    <div className="team-table-container">
                        <table className="team-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>팀 이름</th>
                                <th>설명</th>
                                <th>상태</th>
                                <th>멤버 수</th>
                                <th>자세히</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mainTeams.map((team, idx) => (
                                <tr
                                    key={team.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        console.debug("TeamContentPage: 테이블 행 클릭 - 팀:", team);
                                    }}
                                >
                                    <td>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</td>
                                    <td>{team.name}</td>
                                    <td>{team.description}</td>
                                    <td>
                      <span
                          className={`status ${
                              team.status?.toLowerCase() === "active" ? "active" : "pending"
                          }`}
                      >
                        {team.status || "pending"}
                      </span>
                                    </td>
                                    {/* members는 배열이므로 길이를 출력 */}
                                    <td>{team.members ? team.members.length : 0}명</td>
                                    <td>
                                        <button className="table-btn">보기</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="faq-and-testimonials">
                        <div className="card-box faq">
                            <h4>FAQ</h4>
                            <ul>
                                <li>
                                    <strong>Q:</strong> 팀 가입은 어떻게 하나요?
                                </li>
                                <li>
                                    <strong>A:</strong> 원하는 팀의 '팀 찾기' 버튼을 클릭하세요.
                                </li>
                                <li>
                                    <strong>Q:</strong> 팀 생성 후 관리 방법은?
                                </li>
                                <li>
                                    <strong>A:</strong> 생성된 팀의 대시보드에서 관리 가능합니다.
                                </li>
                            </ul>
                        </div>
                        <div className="card-box testimonials">
                            <h4>사용자 후기</h4>
                            <div className="testimonial-card">
                                <p>"팀 덕분에 프로젝트가 순조롭게 진행됐어요!"</p>
                                <span>- 사용자 D</span>
                            </div>
                            <div className="testimonial-card">
                                <p>"함께하는 힘이 큰 시너지를 만들어냈습니다."</p>
                                <span>- 사용자 E</span>
                            </div>
                        </div>
                    </div>
                </div>

                <TeamSearchModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        console.debug("TeamContentPage: 팀 검색 모달 닫기");
                        setModalOpen(false);
                    }}
                    teamsData={teamsData}
                />
            </div>

            <TeamCreateModal
                isOpen={createModalOpen}
                onClose={() => {
                    console.debug("TeamContentPage: 팀 생성 모달 닫기");
                    setCreateModalOpen(false);
                }}
            />
        </div>
    );
};

export default TeamContentPage;
