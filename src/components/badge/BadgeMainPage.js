import React, { useEffect, useState } from "react";
import axios from "axios";
import "../badge/css/BadgeMainPage.css";
import { badgeImages, badgeNameMapping } from "../badge/badgeNameMapping";
import SelectBadgeModal from "./SelectBadgeModal";
import { useAuth } from "../../Auth/AuthContext";

const BadgeMainPage = () => {
    const { auth, updateActiveBadge } = useAuth();
    const [allBadges, setAllBadges] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [activeBadge, setActiveBadge] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // 전체 뱃지 & 사용자 뱃지 목록 불러오기
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
                setAllBadges(data);
            })
            .catch((err) => console.error("전체 뱃지 불러오기 실패:", err));

        // 사용자 획득 뱃지 목록
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

    // 사용자 뱃지 정렬
    const sortedUserBadges = [...userBadges].sort((a, b) => {
        const tA = a.badge?.completionThreshold ?? 0;
        const tB = b.badge?.completionThreshold ?? 0;
        return tB - tA;
    });

    // 가장 높은 등급(첫 번째)
    const highestBadge = sortedUserBadges[0] || null;

    // "현재 뱃지" 결정
    const currentBadge = activeBadge || highestBadge;
    const currentBadgeName = currentBadge ? currentBadge.badge.badgeName : null;
    const currentBadgeImg = currentBadgeName ? badgeImages[currentBadgeName] : null;
    const displayName = currentBadgeName ? badgeNameMapping[currentBadgeName] : null;

    // 아직 획득하지 않은 뱃지 목록
    const userBadgeIds = userBadges.map((ub) => ub.badge.id);
    const unearnedBadges = Array.isArray(allBadges)
        ? allBadges.filter((b) => !userBadgeIds.includes(b.id))
        : [];

    // 모달 열기/닫기
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // 뱃지 선택 시 → 활성 뱃지 업데이트
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

                setActiveBadge(newlyActive || sorted[0] || null);
                updateActiveBadge(newActiveBadge);
                localStorage.setItem("activeBadge", JSON.stringify(newActiveBadge));
                setShowModal(false);
            })
            .catch((err) => console.error("활성 뱃지 변경 실패:", err));
    };

    useEffect(() => {
        console.log(auth)
    }, [auth]);

    return (
        <div className="dashboard-content">
            {/* 상단 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">뱃지</span>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner">
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

            {/* 사용자 뱃지 & 전체 목록을 담는 박스 */}
            <section className="user-badge-box">
                {/* 현재 활성 뱃지 프로필 */}
                <div className="user-badge-profile">
                    {currentBadge ? (
                        <div className="badge-display">
                            <img
                                className="badge-image"
                                src={currentBadgeImg}
                                alt={displayName || "뱃지 이미지"}
                            />
                            <div className="badge-info">
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <h2 style={{ margin: 0 }}>현재 뱃지의 등급은</h2>
                                    <button className="edit-icon-btn" onClick={handleOpenModal}>
                                        ✏️
                                    </button>
                                </div>
                                <p className="badge-name">
                                    {displayName || currentBadge.badge.badgeName}
                                </p>
                                <p> 입니다.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="no-badge">아직 획득한 뱃지가 없습니다.</div>
                    )}
                </div>
            </section>

            {/* 뱃지 가이드 영역 (하단 박스) */}
            <section className="badge-guide-section">
                <div className="badge-guide-header">
                    <h2>뱃지 가이드</h2>
                    <p>뱃지를 획득하기 위한 조건을 확인해 보아요!</p>
                </div>
                <div className="badge-guide-list">
                    {allBadges.map((badge) => {
                        const badgeImg = badgeImages[badge.badgeName];
                        return (
                            <div className="badge-guide-item" key={badge.id}>
                                <img
                                    src={badgeImg}
                                    alt={badge.badgeName}
                                    className="badge-guide-image"
                                />
                                <div className="guide-badge-name">"{badge.badgeName}"</div>
                                <div className="guide-badge-desc">{badge.description}</div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 모달 (획득 + 미획득 뱃지 목록) */}
            {showModal && (
                <SelectBadgeModal
                    userBadges={sortedUserBadges}
                    unearnedBadges={unearnedBadges} // 미획득 뱃지도 모달로 전달
                    onClose={handleCloseModal}
                    onSelectBadge={handleSelectBadge}
                />
            )}
        </div>
    );
};

export default BadgeMainPage;
