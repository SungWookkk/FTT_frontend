// src/dashboard/components/BadgeProgress.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { badgeImages, badgeNameMapping } from "../badge/badgeNameMapping";
import "../dashboard/css/BadgeProgress.css";

export default function BadgeProgress() {
    const [data, setData] = useState(null);
    const [fillPct, setFillPct] = useState(0);

    // 1) 프로그레스 데이터 불러오기
    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get("/api/badges/progress", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(res.data);
        })();
    }, []);

    // 2) 데이터가 준비되면 애니메이션 트리거
    useEffect(() => {
        if (data) {
            const target = Math.round(data.progressRate * 100);
            // 초기화 후 짧은 딜레이 뒤에 설정해야 트랜지션이 작동합니다
            setFillPct(0);
            setTimeout(() => setFillPct(target), 50);
        }
    }, [data]);

    if (!data) return null;

    const currentKey = data.currentBadgeName;
    const nextKey    = data.nextBadgeName;
    const currentIcon = badgeImages[currentKey];
    const nextIcon    = badgeImages[nextKey];

    return (
        <div className="progress-container">
            <div className="progress-header">
                {/* 현재 등급 블록 */}
                <div className="badge-block">
                    {currentIcon && (
                        <img
                            src={currentIcon}
                            alt={badgeNameMapping[currentKey]}
                            className="badge-icon"
                        />
                    )}
                    <span className="badge-name">
            {badgeNameMapping[currentKey] || "없음"}
          </span>
                </div>

                {/* 다음 등급 블록 */}
                <div className="badge-block">
                    {nextIcon && (
                        <img
                            src={nextIcon}
                            alt={badgeNameMapping[nextKey]}
                            className="badge-icon"
                        />
                    )}
                    <span className="badge-name">
            {badgeNameMapping[nextKey] || "다음"}
          </span>
                </div>
            </div>

            {/* 프로그래스 바 */}
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{width: `${fillPct}%`}}
                />
            </div>
            <span className="until-label">{fillPct}%까지</span>
            {/* 수치 레이블 */}
            <div className="progress-labels">
                <span>0</span>
                <span>{data.lowerThreshold}</span>
                <span>{data.upperThreshold}</span>
            </div>
        </div>
    );
}
