import React, { useEffect, useState } from "react";
import axios from "axios";
import "../badge/css/BadgeMainPage.css";
import { badgeImages } from "../badge/badgeNameMapping";
import SelectBadgeModal from "./SelectBadgeModal";
import { useAuth } from "../../Auth/AuthContext";

const BadgeMainPage = () => {
    const { auth, updateActiveBadge } = useAuth();
    const [allBadges, setAllBadges] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [activeBadge, setActiveBadge] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState("");

    // 뱃지별 그라디언트 매핑
    const gradientMapping = {
        "뚜벅뚜벅 초심자": "linear-gradient(135deg, #FEE140 0%, #FA709A 100%)",
        "목표를 위한 노력가!": "linear-gradient(135deg, #FBC2EB 0%, #A6C1EE 100%)",
        "꾸준한 실천러!": "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)",
        "열일 챔피언!": "linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)",
        "미루기를 모르는 사람!": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "갓생을 위한 노력": "linear-gradient(135deg, #FFDDE1 0%, #EE9CA7 100%)",
        "이정도면 미친 사람": "linear-gradient(135deg, #FA709A 0%, #FEE140 100%)",
        "갓생": "linear-gradient(135deg, #FBC2EB 0%, #A6C1EE 100%)"
    };
    // 뱃지별 "단색 컬러" 매핑  아래 border 등에 활용
    const colorMapping = {
        "뚜벅뚜벅 초심자": "#FEE140",
        "목표를 위한 노력가!": "#FBC2EB",
        "꾸준한 실천러!": "#FF9A9E",
        "열일 챔피언!": "#A1C4FD",
        "미루기를 모르는 사람!": "#84fab0",
        "갓생을 위한 노력": "#FFDDE1",
        "이정도면 미친 사람": "#FA709A",
        "갓생": "#FBC2EB"
    };

    // 컴포넌트 마운트 시 localStorage에서 activeBadge 불러오기
    useEffect(() => {
        const storedActiveBadge = localStorage.getItem("activeBadge");
        if (storedActiveBadge) {
            setActiveBadge(JSON.parse(storedActiveBadge));
        }
    }, []);

    //  activeBadge가 만약 userBadge 형식(즉, badge 객체가 아닌)이라면 badge 객체로 변환
    useEffect(() => {
        if (activeBadge && !activeBadge.badgeName && activeBadge.badge) {
            setActiveBadge(activeBadge.badge);
        }
    }, [activeBadge]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");

        // 전체 뱃지 목록
        axios
            .get("/api/badges")
            .then((res) => {
                const data = Array.isArray(res.data)
                    ? res.data
                    : res.data.badges || [];
                // completionThreshold 기준 정렬(옵션)
                data.sort((a, b) => (a.completionThreshold ?? 0) - (b.completionThreshold ?? 0));
                setAllBadges(data);
            })
            .catch((err) => console.error("전체 뱃지 불러오기 실패:", err));

        // 사용자 뱃지 목록
        if (storedUserId && token) {
            axios
                .get(`/api/user-badges/${storedUserId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    const data = Array.isArray(res.data)
                        ? res.data
                        : res.data.userBadges || [];
                    setUserBadges(data);
                })
                .catch((err) => {
                    console.error("사용자 뱃지 목록 가져오기 실패:", err);
                });
        }
    }, []);

    //--------------------사용자 닉네임 불러오기-------------
    useEffect(() => {
        const storedUsername = localStorage.getItem("userName");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    //--------------------사용자 닉네임 불러오기-------------

    useEffect(() => {
        console.log(auth);
    }, [auth]);

    // 사용자 뱃지 정렬
    const sortedUserBadges = [...userBadges].sort((a, b) => {
        const tA = a.badge?.completionThreshold ?? 0;
        const tB = b.badge?.completionThreshold ?? 0;
        return tB - tA;
    });

    // 가장 높은 등급(첫 번째)
    const highestBadge = sortedUserBadges[0] || null;

    // 현재 뱃지 : activeBadge가 존재하면 그걸, 없으면 가장 높은 뱃지를 사용
    // activeBadge는 badge 객체임을 가정 (위 useEffect에서 변환함)
    const currentBadgeObject = activeBadge || (highestBadge ? highestBadge.badge : null);
    const currentBadgeName = currentBadgeObject ? currentBadgeObject.badgeName : null;
    const currentBadgeImg = currentBadgeName ? badgeImages[currentBadgeName] : null;

    // "단색" 컬러 (없으면 #ccc 등 기본값)
    const currentBadgeColor = colorMapping[currentBadgeName] || "#ccc";

    // 아직 획득하지 않은 뱃지
    const userBadgeIds = userBadges.map((ub) => ub.badge.id);
    const unearnedBadges = Array.isArray(allBadges)
        ? allBadges.filter((b) => !userBadgeIds.includes(b.id))
        : [];

    // 모달 열기/닫기
    const handleOpenModal = () => setShowModal(true);
    console.log("open modal");
    const handleCloseModal = () => setShowModal(false);

    // 뱃지 선택 (수정 모달 내에서 호출됨)
    const handleSelectBadge = (badge) => {
        const found = userBadges.find((ub) => ub.badge.id === badge.id);
        if (!found) {
            console.error("해당 뱃지를 찾을 수 없습니다 (획득 안 함).");
            return;
        }
        axios
            .patch(`/api/user-badges/${found.id}/activate`)
            .then((res) => {
                const updatedList = Array.isArray(res.data) ? res.data : [];
                setUserBadges(updatedList);

                // 업데이트된 목록에서 activeBadgeId가 설정된 항목 찾기
                const sorted = [...updatedList].sort((a, b) => {
                    const tA = a.badge?.completionThreshold ?? 0;
                    const tB = b.badge?.completionThreshold ?? 0;
                    return tB - tA;
                });
                const newlyActive = sorted.find((ub) => ub.activeBadgeId != null);
                const newActiveBadge = newlyActive
                    ? newlyActive.badge
                    : sorted[0]
                        ? sorted[0].badge
                        : null;

                // 여기서 activeBadge는 badge 객체만 저장하도록 함
                setActiveBadge(newActiveBadge);
                updateActiveBadge(newActiveBadge);
                localStorage.setItem("activeBadge", JSON.stringify(newActiveBadge));
                setShowModal(false);
            })
            .catch((err) => console.error("활성 뱃지 변경 실패:", err));
    };

    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">뱃지</span>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner-todo">
                <p className="alert-text">
                    <span className="highlight-text"> 뱃지 </span>
                    <span className="normal-text">는 여러분의</span>
                    <span className="highlight-text"> 성취를 기록 </span>
                    <span className="normal-text">하고, </span>
                    <span className="highlight-text">꾸준한 노력</span>
                    <span className="normal-text">
                        을 격려하기 위해 만들어졌습니다. 매일{" "}
                    </span>
                    <span className="highlight-text">작업을 완료 </span>
                    <span className="normal-text">하며 </span>
                    <span className="highlight-text">성장해</span>
                    <span className="normal-text"> 나가는 모습을 </span>
                    <span className="highlight-text">뱃지</span>
                    <span className="normal-text">로 확인하세요!</span>
                </p>
            </div>

            {/* 좌우 배치 컨테이너 */}
            <div className="badge-page-container">
                {/* 왼쪽: 현재(활성) 뱃지 영역 */}
                <section className="user-badge-box">
                    <div
                        className="section-header1"
                        style={{
                            borderBottom: `5px solid ${currentBadgeColor}`,
                            width: "100%",
                            marginBottom: "20px",
                        }}>
                        <p className="section-header-text">{username}의 프로필 뱃지</p>
                    </div>
                    <div className="user-badge-profile">
                        {currentBadgeObject ? (
                            <div className="badge-display">
                                <img
                                    className="badge-image"
                                    src={currentBadgeImg}
                                    alt={currentBadgeObject.badgeName}
                                />
                                <div className="badge-info">
                                    <h2 className="badge-title">
                                        현재 뱃지의 등급은
                                        <button className="edit-icon-btn" onClick={handleOpenModal}>
                                            ✏️
                                        </button>
                                    </h2>
                                    <p className="badge-name">{currentBadgeObject.badgeName}</p>
                                    <p className="badge-desc">입니다.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="no-badge">아직 획득한 뱃지가 없습니다.</div>
                        )}
                    </div>
                </section>

                <section className="badge-row-container">
                    {/* 뱃지 가이드 헤더 (절대 위치) */}
                    <div className="badge-guide-header">
                        <h2 className="badge-guide-title">뱃지 가이드</h2>
                        <div className="guide-tooltip-icon">
                            ?
                            <div className="guide-tooltip-text">
                                뱃지 가이드는 작업 완료에 따라 획득되는 등급 시스템입니다.<br/>
                                꾸준히 작업을 완료하고 다양한 뱃지를 모아보세요!
                            </div>
                        </div>
                    </div>

                    {/* 실제 뱃지 리스트 (가로 배치) */}
                    <div className="badge-row">
                        {allBadges.map((badge, index) => {
                            const badgeImg = badgeImages[badge.badgeName];
                            const gradient = gradientMapping[badge.badgeName] || "#ddd";
                            const level = index + 1;
                            // 사용자 소유 여부 (true면 강조 / false면 반투명)
                            const isOwned = userBadgeIds.includes(badge.id);
                            return (
                                <div
                                    key={badge.id}
                                    style={{
                                        background: gradient,
                                    }}
                                    className={`badge-reflection-container ${isOwned ? "" : "not-owned"}`}
                                >
                                    {/* 달성 조건(설명)을 툴팁으로 보여주기 */}
                                    <div className="badge-hover-tooltip">{badge.description}</div>
                                    {/* LV 표시 */}
                                    <div className="badge-lv">LV{level}</div>
                                    {/* 뱃지 + 반사 */}
                                    <div className="badge-with-reflection">
                                        <img
                                            src={badgeImg}
                                            alt={badge.badgeName}
                                            className="badge-image"
                                        />
                                        <img
                                            src={badgeImg}
                                            alt={`${badge.badgeName} reflection`}
                                            className="badge-reflection"
                                        />
                                    </div>
                                    {/* 뱃지 이름 */}
                                    <div className="badge-reflection-name">{badge.badgeName}</div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* 모달 (획득 + 미획득 뱃지 목록) */}
            {showModal && (
                <SelectBadgeModal
                    userBadges={userBadges}
                    unearnedBadges={unearnedBadges}
                    onClose={handleCloseModal}
                    onSelectBadge={handleSelectBadge}
                />
            )}
        </div>
    );
};

export default BadgeMainPage;
