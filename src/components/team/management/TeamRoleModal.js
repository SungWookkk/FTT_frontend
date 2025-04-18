import React, { useState, useEffect } from "react";
import axios from "axios";
import "../management/css/TeamPromoteMemberModal.css";


export default function TeamRoleModal({ teamId, members, onClose }) {
    // members === [{id, username, role}, …]
    const [roles, setRoles] = useState({});

    useEffect(() => {
        const init = {};
        members.forEach(u => {
            init[u.id] = u.role;
        });
        setRoles(init);
    }, [members]);

    const handleChange = (userId, newRole) => {
        setRoles(prev => ({ ...prev, [userId]: newRole }));
        axios.patch(`/api/teams/${teamId}/members/${userId}/role`, { role: newRole })
            .catch(() => {
                alert("역할 변경 실패");
                setRoles(prev => ({ ...prev, [userId]: members.find(u=>u.id===userId).role }));
            });
    };

    return (
        <div className="team-promote-overlay" onClick={onClose}>
            <div className="team-promote-container" onClick={e=>e.stopPropagation()}>
                <h2>팀 내 역할 변경</h2>
                <ul className="team-promote-list">
                    {members.map(u =>
                        <li key={u.id} className="team-promote-item">
                            <span>{u.username}</span>
                            <select
                                value={roles[u.id] || u.role}
                                onChange={e => handleChange(u.id, e.target.value)}
                            >
                                {["MEMBER","ADMIN","TEAM_LEADER"].map(o =>
                                    <option key={o} value={o}>{o}</option>
                                )}
                            </select>
                        </li>
                    )}
                </ul>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}