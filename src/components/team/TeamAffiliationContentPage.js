import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../team/css/TeamAffiliationContentPage.css";

// ★ 임시 팀 상세 정보 (예시)
const DUMMY_TEAM = {
    id: 9999,
    teamName: "임시팀 상세",
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

    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-left">
                    <span className="title-text">팀 공간</span>
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
        <div className="team-affiliation-container">
            <h2>{team.teamName} 상세 페이지</h2>
            <p>팀 설명: {team.description}</p>
            <p>팀 공지사항: {team.announcement}</p>
            <p>카테고리: {team.category}</p>
            <h3>팀원 목록</h3>
            {team.members && team.members.length > 0 ? (
                <ul>
                    {team.members.map((member) => (
                        <li key={member.id}>{member.username}</li>
                    ))}
                </ul>
            ) : (
                <p>팀원이 없습니다.</p>
            )}
            {/* 추가적으로 팀 작업(TodoList) 등 표시 가능 */}
        </div>
        </div>
    );
}

export default TeamAffiliationContentPage;
