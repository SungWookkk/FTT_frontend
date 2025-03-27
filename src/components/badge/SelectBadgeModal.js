import React from "react";
import { badgeImages, badgeNameMapping } from "../badge/badgeNameMapping";

const SelectBadgeModal = ({ userBadges, onClose, onSelectBadge }) => {
    return (
        <div className="badge-modal-overlay" onClick={onClose}>
            <div className="badge-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="badge-modal-header">
                    <h2>뱃지 선택</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>
                <p>획득한 뱃지 중에서 선택할 수 있습니다.</p>
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
            </div>
        </div>
    );
};

export default SelectBadgeModal;
