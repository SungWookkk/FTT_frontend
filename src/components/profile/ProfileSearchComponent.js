import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../profile/css/ProfileContentPage.css";

function ProfileSearchComponent() {
    const [searchUsername, setSearchUsername] = useState("");
    const history = useHistory();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchUsername.trim()) return;
        history.push(`/profile/${searchUsername}`);
    };

    return (
        <form className="profile-search-form" onSubmit={handleSearch}>
            <input
                type="text"
                className="profile-search-input"
                placeholder="닉네임 검색"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
            />
            <button type="submit" className="profile-search-btn">
                🔍
            </button>
        </form>
    );
}

export default ProfileSearchComponent;
