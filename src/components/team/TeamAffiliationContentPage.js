import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "../team/css/TeamAffiliationContentPage.css";
import TeamDropdown from "./TeamDropdown";
import TeamCalendarSection from "./TeamCalendarSection";
import TeamReadingList from "./TeamReadingList";
import TeamStatusMessage from "./TeamStatusMessage";
import TeamTodoListContent from "./TeamTodoListContent";

function TeamAffiliationContentPage({ team: propTeam }) {
    // URL에서 teamId 추출 (직접 URL로 접근한 경우에 사용)
    const { teamId } = useParams();
    const [team, setTeam] = useState(
        propTeam
            ? { ...propTeam, members: Array.isArray(propTeam.members) ? propTeam.members : [] }
            : null
    );
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const location = useLocation(); // 현재 경로 확인용

    useEffect(() => {
        // (1) 부모 컴포넌트에서 team 객체를 prop으로 넘겨준 경우
        if (propTeam) {
            const fixedTeam = {
                ...propTeam,
                members: Array.isArray(propTeam.members) ? propTeam.members : [],
            };
            setTeam(fixedTeam);
            setLoading(false);
        }
        // (2) URL 파라미터(teamId)로 접근 → 서버에서 팀 상세 정보 요청
        else if (teamId) {
            axios
                .get(`/api/teams/${teamId}`)
                .then((res) => {
                    let data = res.data;
                    // 응답이 문자열인 경우 파싱 처리
                    if (typeof data === "string") {
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            console.error("JSON 파싱 오류:", e);
                            data = null;
                        }
                    }
                    console.log("백엔드에서 받은 팀 데이터:", data);
                    if (data) {
                        // members 필드가 없거나 배열이 아닌 경우 빈 배열로 대체
                        if (!data.members || !Array.isArray(data.members)) {
                            data.members = [];
                        }
                        setTeam(data);
                    } else {
                        setTeam(null);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("팀 상세 정보 불러오기 오류:", err);
                    setTeam(null);
                    setLoading(false);
                });
        } else {
            // 팀 정보가 없는 경우 null로 설정
            setTeam(null);
            setLoading(false);
        }
    }, [teamId, propTeam]);

    // 팀을 선택했을 때의 핸들러 (드롭다운 등에서 호출)
    const handleTeamSelect = (selectedTeam) => {
        history.push(`/team/${selectedTeam.id}`);
    };

    if (loading) return <div>로딩 중...</div>;
    if (!team) return <div>팀 정보를 불러오지 못했습니다.</div>;

    // 현재 경로가 "/team/:teamId"인지 "/team/:teamId/todo"인지 확인
    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;

    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown onTeamSelect={handleTeamSelect} />
                </div>
            </div>

            {/* 목록 선택 탭 */}
            <div className="list-tap">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div className="list-tab-container">
                        <div
                            className={`tab-item ${isMainPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}`)}
                        >
                            메인
                        </div>
                        <div
                            className={`tab-item ${isTodoPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}/todo`)}
                        >
                            팀 Todo
                        </div>
                        <div className="tab-item">소통</div>
                    </div>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner-todo">
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

            {/* 하위 컴포넌트들 */}
            <TeamStatusMessage teamId={team.id} />
            <div className="team-affiliation-container">
                <TeamCalendarSection team={team} />
                <TeamReadingList teamId={team.id} />
                <TeamTodoListContent teamId={team.id} />
            </div>
        </div>
    );
}

export default TeamAffiliationContentPage;
