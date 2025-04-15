import React, { useState } from "react";
import "../team/css/AddChannelModal.css";

function AddChannelModal({ onCreateChannel, onCancel }) {
    const [channelName, setChannelName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!channelName.trim()) return;
        onCreateChannel(channelName.trim());
    };

    return (
        <div className="modal-overlay-channel" onClick={onCancel}>
            <div className="modal-content-channel" onClick={(e) => e.stopPropagation()}>
                <h3>새 채널 추가</h3>
                <input
                    type="text"
                    className="channel-input"
                    placeholder="채널 이름을 입력하세요"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                />
                <div className="modal-buttons">
                    <button onClick={handleSubmit} className="create-button">생성</button>
                    <button onClick={onCancel} className="cancel-button">취소</button>
                </div>
            </div>
        </div>
    );
}

export default AddChannelModal;
