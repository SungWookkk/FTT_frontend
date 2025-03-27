import React, { useEffect, useState } from "react";
import axios from "axios";
import "../badge/css/BadgeMainPage.css";
import { badgeImages, badgeNameMapping } from "../badge/badgeNameMapping";

// 모달 컴포넌트 (별도 파일에서 선언된 SelectBadgeModal 사용)
import SelectBadgeModal from "./SelectBadgeModal";
import {useAuth} from "../../Auth/AuthContext";

const BadgeMainPage = () => {
    // 모든 뱃지 (획득 여부 관계없이)
    const { auth, updateActiveBadge } = useAuth();
    const [allBadges, setAllBadges] = useState([]);
    // 사용자가 획득한 뱃지
    const [userBadges, setUserBadges] = useState([]);
    // 현재 선택된(활성) 뱃지
    const [activeBadge, setActiveBadge] = useState(null);
    // 모달 열림/닫힘
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {

    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");

        // 전체 뱃지 목록 불러오기
        axios
            .get("/api/badges")
            .then((res) => {
                // 응답 데이터가 배열인지 확인하고, 아니라면 빈 배열로 대체
                const data = Array.isArray(res.data)
                    ? res.data
                    : res.data.badges || [];
                setAllBadges(data);
            })
            .catch((err) => console.error("전체 뱃지 불러오기 실패:", err));

        // 사용자 획득 뱃지 목록 불러오기
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

    useEffect(() => {
        console.log(auth);
    }, [auth]);

    // userBadges를 completionThreshold 기준으로 내림차순 정렬
    const sortedUserBadges = [...userBadges].sort((a, b) => {
        const tA = a.badge?.completionThreshold ?? 0;
        const tB = b.badge?.completionThreshold ?? 0;
        return tB - tA;
    });

    // 가장 높은 등급(첫 번째 요소)
    const highestBadge = sortedUserBadges[0] || null;

    // "현재 뱃지"로 표시할 것: activeBadge가 있으면 우선, 없으면 highestBadge
    const currentBadge = activeBadge || highestBadge;
    const currentBadgeName = currentBadge ? currentBadge.badge.badgeName : null;
    const currentBadgeImg = currentBadgeName ? badgeImages[currentBadgeName] : null;
    const displayName = currentBadgeName ? badgeNameMapping[currentBadgeName] : null;

    // 아직 획득하지 않은 뱃지: allBadges 중, userBadges에 없는 것
    const userBadgeIds = userBadges.map((ub) => ub.badge.id);
    const unearnedBadges = Array.isArray(allBadges)
        ? allBadges.filter((b) => !userBadgeIds.includes(b.id))
        : [];

    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // 모달에서 뱃지 선택 시 → 활성 뱃지 업데이트 (수정된 handleSelectBadge)
    // 뱃지 선택 시: 선택한 뱃지를 활성화하고 AuthContext 업데이트
    const handleSelectBadge = (badge) => {
        const found = userBadges.find((ub) => ub.badge.id === badge.id);
        if (!found) {
            console.error("해당 뱃지를 찾을 수 없습니다 (획득 안 함).");
            return;
        }
        axios
            .patch(`/api/user-badges/${found.id}/activate`)
            .then((res) => {
                // res.data: 업데이트된 UserBadge 목록
                const updatedList = Array.isArray(res.data) ? res.data : [];
                setUserBadges(updatedList);

                // 내림차순 정렬 후 activeBadgeId가 설정된 항목 찾기
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

                // 로컬 상태와 AuthContext 업데이트
                setActiveBadge(newlyActive || sorted[0] || null);
                updateActiveBadge(newActiveBadge);

                // localStorage에도 업데이트
                localStorage.setItem("activeBadge", JSON.stringify(newActiveBadge));
                setShowModal(false);
            })
            .catch((err) => {
                console.error("활성 뱃지 변경 실패:", err);
            });
    };

    return (
        <div className="dashboard-content">
            {/* 헤더 */}
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
                    <span className="normal-text">을 격려하기 위해 만들어졌습니다. 매일 </span>
                    <span className="highlight-text">작업을 완료 </span>
                    <span className="normal-text">하며 </span>
                    <span className="highlight-text">성장해</span>
                    <span className="normal-text"> 나가는 모습을 </span>
                    <span className="highlight-text">뱃지</span>
                    <span className="normal-text">로 확인하세요!</span>
                </p>
            </div>

            <div className="badge-content-container">
                {/* 현재(활성) 뱃지 영역 */}
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

                {/* 전체 뱃지 목록 (획득한 뱃지와 아직 획득하지 않은 뱃지 모두 표시) */}
                {(sortedUserBadges.length > 0 || unearnedBadges.length > 0) && (
                    <div className="all-badges-section">
                        <h3>전체 뱃지 목록</h3>
                        <div className="badge-list">
                            {/* 획득한 뱃지 */}
                            {sortedUserBadges.map((ub) => {
                                const badge = ub.badge;
                                const badgeName = badge.badgeName;
                                const imgSrc = badgeImages[badgeName];
                                const label = badgeNameMapping[badgeName] || badgeName;
                                return (
                                    <div className="badge-list-item" key={badge.id}>
                                        <img
                                            className="badge-list-image"
                                            src={imgSrc}
                                            alt={label}
                                        />
                                        <p className="badge-list-label">{label}</p>
                                    </div>
                                );
                            })}
                            {/* 아직 획득하지 않은 뱃지 (반투명 처리) */}
                            {unearnedBadges.map((badge) => {
                                const badgeName = badge.badgeName;
                                const imgSrc = badgeImages[badgeName];
                                const label = badgeNameMapping[badgeName] || badgeName;
                                return (
                                    <div className="badge-list-item not-earned" key={badge.id}>
                                        <img
                                            className="badge-list-image"
                                            src={imgSrc}
                                            alt={label}
                                        />
                                        <p className="badge-list-label">{label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* 모달 (뱃지 선택) */}
            {showModal && (
                <SelectBadgeModal
                    userBadges={sortedUserBadges}
                    onClose={handleCloseModal}
                    onSelectBadge={handleSelectBadge}
                />
            )}
        </div>
    );
};

export default BadgeMainPage;
