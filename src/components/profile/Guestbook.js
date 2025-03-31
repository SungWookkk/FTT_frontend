import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../profile/css/Guestbook.css";

function Guestbook({ ownerId, writerId, isOwner }) {
    const [entries, setEntries] = useState([]);
    const [newContent, setNewContent] = useState("");
    const [hostComment, setHostComment] = useState("");
    const [selectedEntryId, setSelectedEntryId] = useState(null); // 주인이 댓글 달 entry 선택

    // 방명록 목록 불러오기
    const fetchEntries = useCallback(async () => {
        try {
            // 실제 ownerId를 사용
            if (!ownerId) return; // ownerId가 없으면 요청하지 않음
            const res = await axios.get(`/api/guestbook/${ownerId}`);
            setEntries(res.data);
        } catch (err) {
            console.error("방명록 목록 불러오기 실패:", err);
        }
    }, [ownerId]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    // 새 방명록 작성
    const handleAddEntry = async () => {
        if (!newContent.trim()) {
            alert("방명록 내용을 입력해주세요!");
            return;
        }
        try {
            await axios.post(`/api/guestbook/${ownerId}`, null, {
                params: {
                    writerId,
                    content: newContent,
                },
            });
            setNewContent("");
            fetchEntries(); // 목록 갱신
        } catch (err) {
            console.error("방명록 작성 실패:", err);
            alert(err.response?.data?.message || "방명록 작성에 실패했습니다.");
        }
    };

    // 주인 댓글 달기
    const handleAddHostComment = async (entryId) => {
        if (!hostComment.trim()) {
            alert("댓글 내용을 입력해주세요!");
            return;
        }
        try {
            await axios.patch(`/api/guestbook/comment/${entryId}`, null, {
                params: {
                    comment: hostComment,
                },
            });
            setHostComment("");
            setSelectedEntryId(null);
            fetchEntries(); // 목록 갱신
        } catch (err) {
            console.error("주인 댓글 작성 실패:", err);
            alert(err.response?.data?.message || "댓글 작성에 실패했습니다.");
        }
    };


    // 시간 포맷
    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return "";
        // 간단한 예: YYYY-MM-DD HH:mm 으로 변환
        const dt = new Date(dateTimeStr);
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, "0");
        const dd = String(dt.getDate()).padStart(2, "0");
        const hh = String(dt.getHours()).padStart(2, "0");
        const min = String(dt.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    return (
        <div className="guestbook-container">
            <h2 className="guestbook-title">방명록</h2>

            {/* 방명록 작성 폼 (프로필 주인이 아닐 때만, 혹은 권한에 따라) */}
            {!isOwner && (
                <div className="guestbook-form">
          <textarea
              className="guestbook-textarea"
              placeholder="방명록을 남겨보세요!"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
          />
                    <button className="guestbook-submit-btn" onClick={handleAddEntry}>
                        작성
                    </button>
                </div>
            )}

            {/* 방명록 목록 */}
            <div className="guestbook-list">
                {entries.length === 0 ? (
                    <p className="guestbook-empty">아직 방명록이 없습니다.</p>
                ) : (
                    entries.map((entry) => (
                        <div className="guestbook-card" key={entry.id}>
                            <div className="guestbook-header">
                                <span className="guestbook-writer">{entry.writer.username}</span>
                                <span className="guestbook-date">{formatDateTime(entry.createdAt)}</span>
                            </div>
                            <div className="guestbook-content">{entry.content}</div>

                            {/* 주인 댓글 영역 */}
                            {entry.hostComment ? (
                                <div className="guestbook-host-comment">
                                    <div className="host-comment-header">주인 댓글</div>
                                    <div className="host-comment-content">{entry.hostComment}</div>
                                    <div className="host-comment-date">
                                        {formatDateTime(entry.hostCommentCreatedAt)}
                                    </div>
                                </div>
                            ) : (
                                // 아직 주인 댓글이 없고, isOwner인 경우 댓글 작성 폼 표시
                                isOwner && (
                                    <div className="guestbook-host-form">
                                        {selectedEntryId === entry.id ? (
                                            <>
                        <textarea
                            className="host-comment-textarea"
                            placeholder="댓글을 남겨보세요 (1회 한정)"
                            value={hostComment}
                            onChange={(e) => setHostComment(e.target.value)}
                        />
                                                <button
                                                    className="host-comment-submit-btn"
                                                    onClick={() => handleAddHostComment(entry.id)}
                                                >
                                                    댓글 작성
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="host-comment-toggle-btn"
                                                onClick={() => setSelectedEntryId(entry.id)}
                                            >
                                                댓글 달기
                                            </button>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Guestbook;
