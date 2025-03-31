import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../profile/css/Guestbook.css";

function Guestbook({ ownerId, writerId, isOwner }) {
    const [entries, setEntries] = useState([]);
    const [newContent, setNewContent] = useState("");
    const [isSecret, setIsSecret] = useState(false); // 비밀 글 체크박스
    const [hostComment, setHostComment] = useState("");
    const [selectedEntryId, setSelectedEntryId] = useState(null);

    // 모달 제어
    const [showAllModal, setShowAllModal] = useState(false);

    // 정렬 옵션 (최신순/오래된순)
    const [sortOption, setSortOption] = useState("latest");

    // 방명록 목록 불러오기
    const fetchEntries = useCallback(async () => {
        try {
            if (!ownerId) return;
            const res = await axios.get(`/api/guestbook/${ownerId}`);
            setEntries(res.data);
        } catch (err) {
            console.error("방명록 목록 불러오기 실패:", err);
        }
    }, [ownerId]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    // 글자 수 카운트
    const charCount = newContent.length;

    // 방명록 작성 (글자수 제한 + 비밀글)
    const handleAddEntry = async () => {
        if (charCount > 100) {
            alert("최대 100자까지 입력할 수 있습니다.");
            return;
        }
        if (!newContent.trim()) {
            alert("방명록 내용을 입력해주세요!");
            return;
        }
        try {
            await axios.post(`/api/guestbook/${ownerId}`, null, {
                params: {
                    writerId,
                    content: newContent,
                    secret: isSecret,
                },
            });
            setNewContent("");
            setIsSecret(false);
            fetchEntries();
        } catch (err) {
            console.error("방명록 작성 실패:", err);
            alert(err.response?.data?.message || "방명록 작성에 실패했습니다.");
        }
    };

    // 주인 댓글 작성 (글자수 제한)
    const handleAddHostComment = async (entryId) => {
        if (hostComment.length > 100) {
            alert("최대 100자까지 입력할 수 있습니다.");
            return;
        }
        if (!hostComment.trim()) {
            alert("댓글 내용을 입력해주세요!");
            return;
        }
        try {
            await axios.patch(`/api/guestbook/comment/${entryId}`, null, {
                params: { comment: hostComment },
            });
            setHostComment("");
            setSelectedEntryId(null);
            fetchEntries();
        } catch (err) {
            console.error("주인 댓글 작성 실패:", err);
            alert(err.response?.data?.message || "댓글 작성에 실패했습니다.");
        }
    };

    // 방명록 삭제 (빨간 휴지통 아이콘)
    const handleDeleteEntry = async (entryId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            // DELETE /api/guestbook/{entryId}?requesterId=...
            await axios.delete(`/api/guestbook/${entryId}`, {
                params: { requesterId: writerId },
            });
            fetchEntries();
        } catch (err) {
            console.error("방명록 삭제 실패:", err);
            alert("삭제 실패");
        }
    };

    // 비밀글 표시 로직 (본인 or 프로필 주인만 내용 확인)
    const getEntryContent = (entry) => {
        const isAuthor = parseInt(writerId) === entry.writer.id;
        if (entry.secret && !isAuthor && !isOwner) {
            return "비밀 글입니다.";
        }
        return entry.content;
    };

    // 시간 포맷
    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return "";
        const dt = new Date(dateTimeStr);
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, "0");
        const dd = String(dt.getDate()).padStart(2, "0");
        const hh = String(dt.getHours()).padStart(2, "0");
        const min = String(dt.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    // 모달 정렬
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };
    const getSortedEntries = () => {
        const sorted = [...entries];
        if (sortOption === "latest") {
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
            sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        return sorted;
    };

    return (
        <div className="guestbook-container">
            <h2 className="guestbook-title">방명록</h2>

            {/* 작성 폼 (프로필 주인이 아닐 때만) */}
            {!isOwner && (
                <div className="guestbook-form">
                    <div className="guestbook-form-row">
            <textarea
                className="guestbook-textarea"
                placeholder="방명록을 남겨보세요!"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                maxLength={100}
            />
                        <div className="char-counter">{charCount}/100</div>

                        <label className="secret-check-label">
                            <input
                                type="checkbox"
                                checked={isSecret}
                                onChange={(e) => setIsSecret(e.target.checked)}
                            />
                            비밀 글
                        </label>
                    </div>

                    <div className="guestbook-form-button-row">
                        <button className="guestbook-submit-btn" onClick={handleAddEntry}>
                            작성
                        </button>
                    </div>
                </div>
            )}

            {/* 메인 화면 방명록 (4개 제한) */}
            <div className="guestbook-list limit-4">
                {entries.length === 0 ? (
                    <p className="guestbook-empty">아직 방명록이 없습니다.</p>
                ) : (
                    entries.map((entry) => {
                        const isAuthor = parseInt(writerId) === entry.writer.id;
                        return (
                            <div className="guestbook-card" key={entry.id}>
                                <div className="guestbook-header">
                  <span className="guestbook-writer">
                    {entry.writer.username}
                      {entry.secret && <span className="secret-label"> (비밀글)</span>}
                  </span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className="guestbook-date">{formatDateTime(entry.createdAt)}</span>
                                        {isAuthor && (
                                            <button
                                                className="guestbook-delete-btn"
                                                onClick={() => handleDeleteEntry(entry.id)}
                                            >
                                                🗑
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="guestbook-content">{getEntryContent(entry)}</div>

                                {/* 주인 댓글 */}
                                {entry.hostComment ? (
                                    <div className="guestbook-host-comment">
                                        <div className="host-comment-header">주인 댓글</div>
                                        <div className="host-comment-content">{entry.hostComment}</div>
                                        <div className="host-comment-date">
                                            {formatDateTime(entry.hostCommentCreatedAt)}
                                        </div>
                                    </div>
                                ) : (
                                    isOwner && (
                                        <div className="guestbook-host-form">
                                            {selectedEntryId === entry.id ? (
                                                <>
                          <textarea
                              className="host-comment-textarea"
                              placeholder="댓글을 남겨보세요 (1회 한정)"
                              value={hostComment}
                              onChange={(e) => setHostComment(e.target.value)}
                              maxLength={100}
                          />
                                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                        <button
                                                            className="host-comment-submit-btn"
                                                            onClick={() => handleAddHostComment(entry.id)}
                                                        >
                                                            댓글 작성
                                                        </button>
                                                    </div>
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
                        );
                    })
                )}
            </div>

            {entries.length > 4 && (
                <button className="guestbook-more-btn" onClick={() => setShowAllModal(true)}>
                    더 보기
                </button>
            )}

            {/* 전체 목록 모달 */}
            {showAllModal && (
                <div className="guestbook-modal-overlay" onClick={() => setShowAllModal(false)}>
                    <div className="guestbook-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="guestbook-modal-close-icon" onClick={() => setShowAllModal(false)}>
                            ✕
                        </button>

                        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "flex-end" }}>
                            <select className="guestbook-sort-select" value={sortOption} onChange={handleSortChange}>
                                <option value="latest">최신순</option>
                                <option value="oldest">오래된순</option>
                            </select>
                        </div>

                        <h2 className="guestbook-modal-title">전체 방명록</h2>

                        <div className="guestbook-modal-list">
                            {getSortedEntries().map((entry) => {
                                const isAuthor = parseInt(writerId) === entry.writer.id;
                                return (
                                    <div className="guestbook-card" key={entry.id}>
                                        <div className="guestbook-header">
                      <span className="guestbook-writer">
                        {entry.writer.username}
                          {entry.secret && <span className="secret-label"> (비밀글)</span>}
                      </span>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span className="guestbook-date">{formatDateTime(entry.createdAt)}</span>
                                                {isAuthor && (
                                                    <button
                                                        className="guestbook-delete-btn"
                                                        onClick={() => handleDeleteEntry(entry.id)}
                                                    >
                                                        🗑
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="guestbook-content">{getEntryContent(entry)}</div>

                                        {entry.hostComment ? (
                                            <div className="guestbook-host-comment">
                                                <div className="host-comment-header">주인 댓글</div>
                                                <div className="host-comment-content">{entry.hostComment}</div>
                                                <div className="host-comment-date">
                                                    {formatDateTime(entry.hostCommentCreatedAt)}
                                                </div>
                                            </div>
                                        ) : (
                                            isOwner && (
                                                <div className="guestbook-host-form">
                                                    {selectedEntryId === entry.id ? (
                                                        <>
                              <textarea
                                  className="host-comment-textarea"
                                  placeholder="댓글을 남겨보세요 (1회 한정)"
                                  value={hostComment}
                                  onChange={(e) => setHostComment(e.target.value)}
                                  maxLength={100}
                              />
                                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                                <button
                                                                    className="host-comment-submit-btn"
                                                                    onClick={() => handleAddHostComment(entry.id)}
                                                                >
                                                                    댓글 작성
                                                                </button>
                                                            </div>
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
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Guestbook;
