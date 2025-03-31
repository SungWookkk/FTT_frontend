import "../profile/css/ProfileContentPage.css";
import React, { useEffect, useRef, useState} from "react";
import axios from "axios";
import ProfileCommunity from "./ProfileCommunity";
import { useAuth } from "../../Auth/AuthContext";
import BadgeTestPanel from "../badge/BadgeTestPanel";
// 프로필 이미지는 임시로 유지
import defaultUser from "../../Auth/css/img/default-user.svg";
import Guestbook from "./Guestbook";
import ProfileSearchComponent from "./ProfileSearchComponent";
import {useParams} from "react-router-dom";


const ProfileContentPage = ({ ownerId, writerId }) => {
    const { auth, setAuth } = useAuth();
    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState("");

    // 한 줄 소개 & 소개를 state로 관리
    const [introduction, setIntroduction] = useState("");
    const [description, setDescription] = useState("");

    // 모달 상태 (한 줄 소개 수정, 소개 수정)
    const [showIntroModal, setShowIntroModal] = useState(false);
    const [showDescModal, setShowDescModal] = useState(false);

    // 모달에서 편집 중인 값
    const [editIntro, setEditIntro] = useState("");
    const [editDesc, setEditDesc] = useState("");

    // 현재 로그인된 유저 ID & 페이지 유저 ID
    const userId = localStorage.getItem("userId");
    const [profileUserId, setProfileUserId] = useState(null);
    const [username, setUsername] = useState("");

    // 라우트 파라미터에서 username 또는 ownerId를 추출
    const { username: routeUsername, ownerId: routeOwnerId } = useParams();

    //--------------------- 사용자 닉네임 가져오기 ---------------
    useEffect(() => {
        // 로그인 시 localStorage에 저장한 username 불러오기
        const storedUsername = localStorage.getItem("userName");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);
    // ---------------------- auth 사용을 위한 useEffect ----------------------
    useEffect(() => {
        if (auth) {
            console.log("사용자 ", auth);
        }
    }, [auth]);
    // ----------------------------------------------------------------------

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                let res;
                // URL에 username 또는 ownerId가 있으면 해당 사용자를 조회
                if (routeUsername) {
                    res = await axios.get(`/api/users/by-username/${routeUsername}`);
                    // 받아온 데이터로 상태 업데이트
                    setProfileImage(res.data.profile_image || "");
                    setIntroduction(res.data.introduction || "");
                    setUsername(res.data.username || "");
                    setDescription(res.data.description || "");
                    setProfileUserId(res.data.id); // DB PK
                } else if (routeOwnerId) {
                    res = await axios.get(`/api/users/${routeOwnerId}`);
                } else {
                    // 기본: 로그인한 사용자의 정보를 조회
                    res = await axios.get(`/api/users/${userId}`);
                }

                // 받아온 데이터로 상태 업데이트
                if (res.data.profile_image) {
                    setProfileImage(res.data.profile_image);
                }
                if (res.data.introduction) {
                    setIntroduction(res.data.introduction);
                }
                if (res.data.username) {
                    setUsername(res.data.username);
                }
                if (res.data.description) {
                    setDescription(res.data.description);
                }
                setProfileUserId(res.data.id);
            } catch (err) {
                console.error("사용자 정보를 찾을 수 없습니다", err);
            }
        };
        fetchUserInfo();
    }, [userId, routeUsername, routeOwnerId]);


    // 파일 업로드
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`/api/users/${userId}/profile-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.profile_image) {
                // 1) 로컬 state 업데이트
                setProfileImage(response.data.profile_image);
                // 2) localStorage에 반영
                localStorage.setItem("profileImage", response.data.profile_image);
                // 3) AuthContext의 profileImage도 갱신
                setAuth((prev) => ({
                    ...prev,
                    profileImage: response.data.profile_image,
                }));
            }
        } catch (err) {
            console.error("업로드 애러 ", err);
        }
    };

    // 모달 열기 (한 줄 소개)
    const openIntroModal = () => {
        setEditIntro(introduction);
        setShowIntroModal(true);
    };
    // 모달 열기 (소개)
    const openDescModal = () => {
        setEditDesc(description);
        setShowDescModal(true);
    };

    // 모달 닫기
    const closeIntroModal = () => setShowIntroModal(false);
    const closeDescModal = () => setShowDescModal(false);

    // 저장 (한 줄 소개)
    const handleSaveIntro = async () => {
        try {
            await axios.patch(`/api/users/${userId}/profile`, {
                introduction: editIntro,
            });
            // 성공 시 state 업데이트
            setIntroduction(editIntro);
            setShowIntroModal(false);
        } catch (err) {
            console.error("Failed to update introduction:", err);
        }
    };

    // 저장 (소개)
    const handleSaveDesc = async () => {
        try {
            await axios.patch(`/api/users/${userId}/profile`, {
                description: editDesc,
            });
            // 성공 시 state 업데이트
            setDescription(editDesc);
            setShowDescModal(false);
        } catch (err) {
            console.error("Failed to update description:", err);
        }
    };

    // 로그인한 사용자의 id와 프로필 페이지의 사용자 id를 비교
    const isOwner = parseInt(userId) === profileUserId;


    return (
        <div className="dashboard-content">
            {/* 대시보드 헤더 */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <span className="title-text">프로필</span>
                </div>
            </div>

            {/* 알림 배너 */}
            <div className="alert-banner">
                <p className="alert-text">
                    <span className="normal-text">프로필 페이지에서 </span>
                    <span className="highlight-text">개인 정보</span>
                    <span className="normal-text">를 확인하고, </span>
                    <span className="highlight-text">프로필 사진</span>
                    <span className="normal-text"> 및 </span>
                    <span className="highlight-text">연락처</span>
                    <span className="normal-text">
                        {" "}
                        등의 정보를 최신 상태로 업데이트해 보세요!
                    </span>
                </p>
            </div>

            {/* 레이아웃 컨테이너 */}
            <div className="container">
                {/* ------ 왼쪽 열 (프로필 카드 + 커뮤니티 목록) ------ */}
                <div className="profile-left-column">
                    {/* 프로필 카드 */}
                    <div className="profile-card">
                        {/* 프로필 이미지 */}
                        <div className="avatar-container">
                            <div className="avatar">
                                <img className="avatar-img" src={profileImage || defaultUser} alt=""/>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{display: "none"}}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {/* 사진 등록 버튼 (본인만) */}
                            {isOwner && (
                                <button className="avatar-upload-btn" onClick={handleUploadClick}>
                                    사진 등록
                                </button>
                            )}
                        </div>

                        {/* 예시: Top rated / job-success / favorite 등 */}
                        <div className="top-rated">Top rated</div>
                        <div className="job-success">79% 완료율</div>
                        <div className="favorite">{username}</div>

                        {/* 한 줄 자기소개 */}
                        <p className="introduction">
                            {introduction || "한 줄 자기소개가 없습니다."}
                            {isOwner && (
                                <button className="edit-icon-btn" onClick={openIntroModal}>
                                    ✏️
                                </button>
                            )}
                        </p>

                        {/* 소개 */}
                        <div className="overview">
                            소개
                            {isOwner && (
                                <button className="edit-icon-btn" onClick={openDescModal}>
                                    ✏️
                                </button>
                            )}
                        </div>
                        <p className="description">{description || "소개 내용이 없습니다."}</p>

                        {/* 하단 통계 영역 (4개 칸) */}
                        <div className="bottom-stats-container">
                            <div className="stat-box">
                                <div className="stat-value">1542</div>
                                <div className="stat-label">생성한 작업 수</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">1350</div>
                                <div className="stat-label">완료한 작업 수</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">182</div>
                                <div className="stat-label">실패한 작업 수</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">2849위</div>
                                <div className="stat-label">작업에 따른 사용자 랭킹</div>
                            </div>
                        </div>
                    </div>

                    {/* 커뮤니티 게시글 목록 (프로필 카드 하단) */}
                    <ProfileCommunity/>
                </div>

                {/* ------ 가운데 세로 구분선 ------ */}
                <div className="vertical-divider"></div>

                <div className="profile-right-column">
                    <Guestbook ownerId={profileUserId} writerId={userId} isOwner={isOwner} />
                </div>
              <ProfileSearchComponent/>
                </div>

            {/* 한 줄 소개 수정 모달 */}
            {showIntroModal && (
                <div className="modal-overlay1" onClick={closeIntroModal}>
                    <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
                        <h2>한 줄 소개 수정</h2>
                        <textarea
                            value={editIntro}
                            onChange={(e) => setEditIntro(e.target.value)}
                            rows={3}
                            style={{ width: "100%" }}
                        />
                        <div className="modal-buttons">
                            <button className="btn-save" onClick={handleSaveIntro}>
                                저장
                            </button>
                            <button className="btn-cancel" onClick={closeIntroModal}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 소개 수정 모달 */}
            {showDescModal && (
                <div className="modal-overlay" onClick={closeDescModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>소개 수정</h2>
                        <textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            rows={6}
                            style={{ width: "100%" }}
                        />
                        <div className="modal-buttons">
                            <button className="btn-save" onClick={handleSaveDesc}>
                                저장
                            </button>
                            <button className="btn-cancel" onClick={closeDescModal}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <BadgeTestPanel/>
        </div>
    );
};

export default ProfileContentPage;
