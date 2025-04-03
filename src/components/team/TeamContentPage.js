import React, { useState } from "react";
import "../team/css/TeamContentPage.css";
import TeamDropdown from "./TeamDropdown";
import TeamSearchModal from "./TeamSearchModal";
import * as PropTypes from "prop-types";
import TeamCreateModal from "./TeamCreateModal";
import TeamAffiliationContentPage from "./TeamAffiliationContentPage";
import {useHistory} from "react-router-dom";

const TeamJoinRequestModal = ({ isOpen, onClose, team }) => {
    const [nickname, setNickname] = useState("");
    const [reason, setReason] = useState("");
    const [goal, setGoal] = useState("");


    // 모달이 열릴 때마다 폼 초기화 (원한다면)
    // 여기서는 team이 바뀔 때마다 초기화
    React.useEffect(() => {
        if (isOpen && team) {
            setNickname("");
            setReason("");
            setGoal("");
        }
    }, [isOpen, team]);

    if (!isOpen || !team) return null; // 모달이 닫혀있거나 팀 정보가 없으면 렌더링하지 않음

    const handleJoin = () => {
        // 가입 신청 로직 (현재는 콘솔 출력/alert 등)
        console.log("가입 신청 데이터:", {
            teamId: team.id,
            nickname,
            reason,
            goal,
        });
        alert(`${team.name} 팀 가입 신청!`);

        // 모달 닫기
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="join-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    X
                </button>
                <h2 className="modal-title">팀 가입 신청</h2>
                <p className="join-modal-teamname">
                    가입할 팀: <strong>{team.name}</strong>
                </p>

                <div className="join-modal-field">
                    <label>닉네임</label>
                    <input
                        type="text"
                        placeholder="팀에서 사용할 닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>

                <div className="join-modal-field">
                    <label>가입 사유</label>
                    <textarea
                        placeholder="간단한 가입 사유를 적어주세요"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <div className="join-modal-field">
                    <label>목표</label>
                    <textarea
                        placeholder="팀에서 달성하고 싶은 목표를 적어주세요"
                        rows={3}
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                </div>

                <button className="join-submit-btn" onClick={handleJoin}>
                    가입 신청
                </button>
            </div>
        </div>
    );
};

TeamJoinRequestModal.propTypes = {
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    team: PropTypes.any
};
const TeamContentPage = () => {
    const teamData = [
        { id: 1, name: "공부팀 A", desc: "자격증 스터디를 위한 열정 넘치는 팀", category: "공부", status: "Active", members: 5 },
        { id: 2, name: "운동팀 B", desc: "함께 운동하며 건강 챙기기", category: "운동", status: "Pending", members: 4 },
        { id: 3, name: "AI 연구팀", desc: "인공지능 프로젝트 협업", category: "AI", status: "Active", members: 6 },
        { id: 4, name: "코딩 고수들", desc: "코딩 문제 해결 & 알고리즘 스터디", category: "코딩", status: "Active", members: 8 },
        { id: 5, name: "취업준비단", desc: "취업 정보 공유 & 면접 대비", category: "취업", status: "Pending", members: 3 },
        { id: 6, name: "알바정보톡", desc: "파트타임 구직 & 꿀팁 교환", category: "알바", status: "Active", members: 2 },
        { id: 7, name: "공부팀 B", desc: "자격증 2차 스터디 준비 중", category: "공부", status: "Active", members: 7 },
        { id: 8, name: "공부팀 B", desc: "자격증 2차 스터디 준비 중", category: "공부", status: "Active", members: 7 },
        { id: 9, name: "공부팀 B", desc: "자격증 2차 스터디 준비 중", category: "공부", status: "Active", members: 7 },
        { id: 10, name: "공부팀 B", desc: "자격증 2차 스터디 준비 중", category: "공부", status: "Active", members: 7 },
        { id: 11,name: "공부팀 B", desc: "자격증 2차 스터디 준비 중", category: "공부", status: "Active", members: 7 },
        { id: 12, name: "공부팀 B", desc: "자격증 2차 스터디 준비 중", category: "공부", status: "Active", members: 7 },
        { id: 13, name: "공부팀 B", desc: "자격증 2차 스터디 준비 중", category: "공부", status: "Active", members: 7 },
        { id: 14, name: "공부팀 B", desc: "자격증 2차 스터디 준비 중", category: "공부", status: "Active", members: 7 },
    ];

    // 현재 선택된 카테고리 (기본: 전체)
    const [selectedCategory, setSelectedCategory] = useState("");
    // 팀 찾기 모달
    const [isModalOpen, setModalOpen] = useState(false);
    // 카테고리 버튼 클릭 시 해당 카테고리로 변경
    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
    };
    // "팀 가입 신청 모달" 상태
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    // 팀 생성 모달 상태
    const [createModalOpen, setCreateModalOpen] = useState(false);
    //  드롭다운에서 선택된 팀 (팀 상세 페이지에 표시할 팀)
    const [teamForAffiliation, setTeamForAffiliation] = useState(null);
    const history = useHistory();

    // 드롭다운에서 팀 선택 시
    const handleDropdownTeamSelect = (team) => {
        setTeamForAffiliation(team);
        // 경로 변경: /team/팀ID (또는 teamName)
        console.log("선택된 팀:", team); // 팀 객체에 id 필드가 있는지 확인
        history.push(`/team/${team.id}`);
    };


    // 테이블 행 클릭 시
    const handleRowClick = (team) => {
        setSelectedTeam(team);
        setJoinModalOpen(true);
    };


    // 필터링된 팀 목록
    const filteredTeams =
        selectedCategory === ""
            ? teamData // 전체
            : teamData.filter((team) => team.category === selectedCategory);

    // 메인 페이지에서는 최대 7개까지만 렌더링
    const mainTeams = filteredTeams.slice(0, 7);

    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown onTeamSelect={handleDropdownTeamSelect} />
                </div>
                <div className="header-button-group">
                    <button className="btn btn-create">팀 생성하기</button>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner">
                <p className="alert-text">
                    <span className="highlight-text">팀</span>
                    <span className="normal-text">은 공동의 목표를 위해 함께 </span>
                    <span className="highlight-text">소통하고 협업</span>
                    <span className="normal-text">
            {" "}
                        하는 공간입니다. 서로의 아이디어와 역량을 모아{" "}
          </span>
                    <span className="highlight-text">시너지를 발휘</span>
                    <span className="normal-text">하며, 매일의 과제를 </span>
                    <span className="highlight-text">함께 해결</span>
                    <span className="normal-text">
            {" "}
                        해 보세요. 작지만 꾸준한 노력들이 모여{" "}
          </span>
                    <span className="highlight-text">팀의 성장</span>
                    <span className="normal-text">을 이끌어냅니다!</span>
                </p>
            </div>
            {/* 왼쪽과 오른쪽 영역을 감싸는 컨테이너 */}
            <div className="content-wrapper">
            {/* 왼쪽: 팀이 없는 사용자용 안내 영역*/}
            <div className="no-team-section">
                <div className="no-team-block bg-image">
                    <h2>팀이 없으신가요?</h2>
                    <p>팀에 참가해서 함께 목표를 이루어보세요!</p>
                    <button className="no-team-btn" onClick={() => setModalOpen(true)}>팀 찾기</button>

                </div>
                <div className="no-team-block bg-image1">
                    <h2>팀 생성하기!</h2>
                    <p>팀을 직접 만들어서 공통된 목표를 가진 유저들을 모아봐요!</p>
                    <button className="no-team-btn" onClick={() => setCreateModalOpen(true)}>팀 만들기</button>
                </div>
            </div>

            <div className="vertical-divider"></div>

                {/* 오른쪽 섹션: 조건부 렌더링 */}
                {teamForAffiliation ? (
                    // 드롭다운에서 팀이 선택된 경우 -> TeamAffiliationContentPage
                    <TeamAffiliationContentPage team={teamForAffiliation} />
                ) : (
                    // 드롭다운에서 팀이 선택되지 않은 경우 -> 기존 "추천 팀" 테이블
                    <div className="team-right-section">
                        {/* 기존 추천 팀 / FAQ / 후기 영역 */}
                        {/* 예: 추천 팀 테이블, FAQ, 후기 등 */}
                    </div>
                )}

            {/* 오른쪽: 테이블 + FAQ/후기 */}
                <div className="team-right-section">
                    {/* 추천 팀 (테이블) */}
                    <div className="team-table-header">
                        <h3 className="team-table-title">추천 팀</h3>
                        <span className="team-count">총 {mainTeams.length}개 팀</span>
                    </div>

                    {/* 카테고리 버튼 그룹 */}
                    <div className="category-btn-group" style={{marginBottom: "12px"}}>
                        {["", "공부", "운동", "AI", "코딩", "취업", "알바"].map((cat) => (
                            <button
                                key={cat === "" ? "전체" : cat}
                                className={`category-btn ${
                                    selectedCategory === cat ? "selected" : ""
                                }`}
                                onClick={() => handleCategoryClick(cat)}
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
                                    style={{cursor: "pointer"}}
                                    onClick={() => handleRowClick(team)}
                                >
                                    <td>{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</td>
                                    <td>{team.name}</td>
                                    <td>{team.desc}</td>
                                    <td>
            <span
                className={`status ${
                    team.status.toLowerCase() === "active" ? "active" : "pending"
                }`}
            >
              {team.status}
            </span>
                                    </td>
                                    <td>{team.members}명</td>
                                    <td>
                                        <button className="table-btn">보기</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* FAQ & 사용자 후기 (카드) */}
                    <div className="faq-and-testimonials">
                        {/* FAQ 카드 */}
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

                        {/* 후기 카드 */}
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
                {/* 모달 */}
                <TeamSearchModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    teamsData={teamData}
                />
            </div>
            {/* === 팀 가입 신청 모달 === */}
            <TeamJoinRequestModal
                isOpen={joinModalOpen}
                onClose={() => setJoinModalOpen(false)}
                team={selectedTeam}
            />
            {/* 팀 생성 모달 */}
            <TeamCreateModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />
        </div>
    );
};

export default TeamContentPage;
