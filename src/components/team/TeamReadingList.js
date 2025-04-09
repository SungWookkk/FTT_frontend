import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import TeamReadingListModal from "./TeamReadingListModal";
import "../team/css/TeamReadingList.css";

// 읽기 자료 아이템들을 카테고리별로 그룹화하는 함수
function groupReadingItemsByCategory(items) {
    const map = {};
    items.forEach((it) => {
        const cat = it.category || "기타";
        if (!map[cat]) {
            map[cat] = [];
        }
        map[cat].push({ title: it.title, link: it.link });
    });
    return Object.keys(map).map((cat) => ({
        category: cat,
        items: map[cat],
    }));
}

function TeamReadingList({ teamId }) {
    const [readingList, setReadingList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 모달을 열 때 미리 채워질 카테고리 값을 관리하는 state
    const [modalInitialCategory, setModalInitialCategory] = useState("");

    const fetchReadingList = useCallback(() => {
        if (!teamId) return;
        axios
            .get(`/api/team/${teamId}/readingList`)
            .then((res) => {
                const rawData = Array.isArray(res.data) ? res.data : [];
                const groupedData = groupReadingItemsByCategory(rawData);
                setReadingList(groupedData);
            })
            .catch((err) => {
                console.error("읽기 자료 불러오기 오류:", err);
                setReadingList([]);
            });
    }, [teamId]);

    useEffect(() => {
        fetchReadingList();
    }, [fetchReadingList]);

    // 최상단 "+ 작성하기" 버튼: 초기 카테고리 미지정
    const handleAddReadingList = () => {
        setModalInitialCategory("");
        setIsModalOpen(true);
    };

    // 각 카테고리 하단의 "+ 여기에 작성하기" 버튼 클릭 시, 해당 카테고리명을 기본값으로 지정
    const handleAddReadingListForCategory = (category) => {
        setModalInitialCategory(category);
        setIsModalOpen(true);
    };

    // 모달에서 저장 후 호출하는 콜백 (목록 갱신)
    const handleSaveReadingList = (newData) => {
        fetchReadingList();
    };

    return (
        <div className="team-reading-list">
            <div className="reading-list-header">
                <h2 className="reading-list-title">Reading List</h2>
                <button onClick={handleAddReadingList} className="add-reading-btn">
                    + 작성하기
                </button>
            </div>

            <div className="reading-list-board">
                {readingList.length === 0 ? (
                    <div className="reading-list-column">
                        <h3 className="column-title">No Data</h3>
                        <ul className="reading-items">
                            <li className="reading-item empty-reading-item">
                                아직 읽기 자료가 없습니다. <br />
                                읽기 자료를 추가하여 팀 작업에 기여해봐요!
                            </li>
                        </ul>
                    </div>
                ) : (
                    readingList.map((column, idx) => (
                        <div key={idx} className="reading-list-column">
                            <h3 className="column-title">{column.category}</h3>
                            <ul className="reading-items">
                                {column.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="reading-item">
                                        <a
                                            href={item.link || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="reading-link"
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            {/* 각 카테고리 하단에 추가 버튼 */}
                            <div
                                className="add-new-page"
                                onClick={() => handleAddReadingListForCategory(column.category)}
                            >
                                + 여기에 작성하기
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <TeamReadingListModal
                    teamId={teamId}
                    initialCategory={modalInitialCategory}
                    onClose={() => {
                        setIsModalOpen(false);
                        setModalInitialCategory("");
                    }}
                    onSave={handleSaveReadingList}
                />
            )}
        </div>
    );
}

export default TeamReadingList;
