import React from "react";
import { badgeImages, badgeNameMapping } from "../badge/badgeNameMapping";

const SelectBadgeModal = ({ userBadges, unearnedBadges, onClose, onSelectBadge }) => {
    return (
        <div className="badge-modal-overlay" onClick={onClose}>
            <div className="badge-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="badge-modal-header">
                    <h2>뱃지 선택</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <p>사용 가능한 모든 뱃지를 확인하고 선택할 수 있습니다.</p>

                {/* 획득한 뱃지 */}
                {userBadges.length > 0 && (
                    <>
                        <h3>획득한 뱃지</h3>
                        <div className="badge-modal-list">
                            {userBadges.map((ub) => {
                                const badge = ub.badge;
                                const badgeName = badge.badgeName;
                                const imgSrc = badgeImages[badgeName];
                                const label = badgeNameMapping[badgeName] || badgeName;
                                return (
                                    <div
                                        key={badge.id}
                                        className="badge-modal-item"
                                        onClick={() => onSelectBadge(badge)}
                                    >
                                        <img className="badge-modal-image" src={imgSrc} alt={label} />
                                        <span>{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* 미획득 뱃지 */}
                {unearnedBadges.length > 0 && (
                    <>
                        <h3>아직 획득하지 않은 뱃지</h3>
                        <div className="badge-modal-list">
                            {unearnedBadges.map((badge) => {
                                const badgeName = badge.badgeName;
                                const imgSrc = badgeImages[badgeName];
                                const label = badgeNameMapping[badgeName] || badgeName;
                                return (
                                    <div
                                        key={badge.id}
                                        className="badge-modal-item not-earned"
                                        onClick={() => onSelectBadge(badge)}
                                    >
                                        <img className="badge-modal-image" src={imgSrc} alt={label} />
                                        <span>{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SelectBadgeModal;
