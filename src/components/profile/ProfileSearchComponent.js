import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function ProfileSearchComponent() {
    const [searchUsername, setSearchUsername] = useState("");
    const history = useHistory();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchUsername.trim()) return;

        history.push(`/profile/${searchUsername}`);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="조회할 username 입력"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                />
                <button type="submit">검색</button>
            </form>
        </div>
    );
}
export default ProfileSearchComponent;
