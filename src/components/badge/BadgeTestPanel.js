import React, { useState } from "react";
import axios from "axios";

const BadgeTestPanel = ({ userId: propUserId, onBadgeUpdate }) => {
    // 완료된 Task 수 입력 상태
    const [completedCount, setCompletedCount] = useState("");
    // 만약 prop으로 userId가 전달되지 않으면 localStorage에서 가져옴
    const userId = propUserId || localStorage.getItem("userId");

    const handleTest = async () => {
        if (!userId) {
            console.error("userId is null");
            alert("유효한 userId가 없습니다.");
            return;
        }
        try {
            await axios.post(`/api/user-badges/test/update-completed-count`, {
                userId,
                completedCount: parseInt(completedCount, 10),
            });
            // 테스트 실행 후 최신 뱃지 정보를 다시 가져오는 콜백 호출
            if (onBadgeUpdate) {
                onBadgeUpdate();
            }
        } catch (error) {
            console.error("테스트 업데이트 실패:", error);
        }
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", margin: "20px 0" }}>
            <h3>뱃지 테스트 패널</h3>
            <input
                type="number"
                placeholder="완료된 Task 수"
                value={completedCount}
                onChange={(e) => setCompletedCount(e.target.value)}
            />
            <button onClick={handleTest}>테스트 실행</button>
        </div>
    );
};

export default BadgeTestPanel;
