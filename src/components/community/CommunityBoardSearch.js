import React, { useState } from 'react';
import './CommunityBoardSearch.css';

function CommunityBoardSearch({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        onSearch(query.trim());
    };

    return (
        <form className="cbs-form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="cbs-input"
                placeholder="제목·내용·작성자 검색..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className="cbs-button">검색</button>
        </form>
    );
}

export default CommunityBoardSearch;
