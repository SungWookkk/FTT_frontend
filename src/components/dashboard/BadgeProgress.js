import React, { useState, useEffect } from "react";
import axios from "axios";
import "../dashboard/css/BadgeProgress.css";

export default function BadgeProgress() {
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get("/api/badges/progress", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        })();
    }, []);

    if (!data) return null;

    const pct = Math.round(data.progressRate * 100);

    return (
        <div className="progress-container">
            <div className="labels">
                <span>{data.currentBadgeName}</span>
                <span>{data.nextBadgeName}까지 {pct}%</span>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="progress-labels">
                <span>0</span>
                <span>{data.lowerThreshold}</span>
                <span>{data.upperThreshold}</span>
            </div>
        </div>
    );
}
