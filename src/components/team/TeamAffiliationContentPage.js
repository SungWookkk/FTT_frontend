import React, { useEffect, useState } from "react";
import {useHistory, useLocation, useParams} from "react-router-dom";
import axios from "axios";
import "../team/css/TeamAffiliationContentPage.css";
import TeamDropdown from "./TeamDropdown";
import TeamCalendarSection from "./TeamCalendarSection";
import TeamReadingList from "./TeamReadingList";
import TeamStatusMessage from "./TeamStatusMessage";
import TeamTodoListContent from "./TeamTodoListContent";
//  임시 팀 상세 정보 (예시)
const DUMMY_TEAM = {
    id: 9999,
    teamName: "임시팀",
    description: "임시팀 상세 설명",
    announcement: "임시 공지사항",
    category: "임시카테고리",
    members: [
        { id: 1001, username: "임시유저1" },
        { id: 1002, username: "임시유저2" },
    ],
};

function TeamAffiliationContentPage({ team: propTeam }) {
    // URL에서 teamId 추출 (직접 URL로 접근한 경우에 사용)
    const { teamId } = useParams();
    const [team, setTeam] = useState(propTeam || null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const location = useLocation();   // ← 현재 경로 확인용
    useEffect(() => {
        // (1) 부모 컴포넌트에서 team 객체를 prop으로 넘겨준 경우 → 그대로 사용
        if (propTeam) {
            setTeam(propTeam);
            setLoading(false);
        }
        // (2) URL 파라미터(teamId)로 접근 → 서버에서 팀 상세 정보 요청
        else if (teamId) {
            axios
                .get(`/api/teams/${teamId}`)
                .then((res) => {
                    if (res.data) {
                        setTeam(res.data);
                    } else {
                        // 서버 응답은 성공했지만 데이터가 없으면 임시 데이터 사용
                        setTeam(DUMMY_TEAM);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("팀 상세 정보 불러오기 오류:", err);
                    // 서버 요청 실패 시 임시 데이터 사용
                    setTeam(DUMMY_TEAM);
                    setLoading(false);
                });
        } else {
            // teamId도 없고 propTeam도 없으면 임시 데이터 사용
            setTeam(DUMMY_TEAM);
            setLoading(false);
        }
    }, [teamId, propTeam]);

    if (loading) return <div>로딩 중...</div>;
    if (!team) return <div>팀 정보를 찾을 수 없습니다.</div>;

    // 현재 경로가 "/team/:teamId"인지 "/team/:teamId/todo"인지 체크
    const isMainPage = location.pathname === `/team/${teamId}`;
    const isTodoPage = location.pathname === `/team/${teamId}/todo`;

    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
                    <TeamDropdown/>
                </div>
            </div>

            {/* 목록 선택 탭 */}
            <div className="list-tap">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div className="list-tab-container">
                        {/* 메인 탭 */}
                        <div
                            className={`tab-item ${isMainPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}`)}
                        >
                            메인
                        </div>
                        {/* 팀 Todo 탭 */}
                        <div
                            className={`tab-item ${isTodoPage ? "active" : ""}`}
                            onClick={() => history.push(`/team/${teamId}/todo`)}
                        >
                            팀 Todo
                        </div>
                        {/* 소통 탭 (예: /team/:teamId/chat) - 경로 준비 시 추가 */}
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
            {/* 팀 상태 메시지 영역 (새 컴포넌트) */}
            <TeamStatusMessage/>
            <div className="team-affiliation-container">
                <TeamCalendarSection team={team}/>
                <TeamReadingList teamId={team.id} />
                <TeamTodoListContent/>
            </div>

        </div>
    );
}

export default TeamAffiliationContentPage;
