import React, { useState } from "react";
import Header from "../dashboard/Header";
import Sidebar from "../dashboard/Sidebar";
import ChatSidebar from "./ChatSidebar";
import TeamCommunityContentPage from "./TeamCommunityContentPage";

function TeamCommunityPage() {
    // false: 기본 사이드바, true: 채팅 사이드바
    const [useChatSidebar, setUseChatSidebar] = useState(false);

    // Sidebar에서 "채팅" 버튼 클릭 시 호출할 콜백
    const handleShowChat = () => {
        setUseChatSidebar(true);
    };

    // ChatSidebar에서 "기본" 버튼 클릭 시 호출할 콜백
    const handleShowDefault = () => {
        setUseChatSidebar(false);
    };

    return (
        <div className="dashboard-wrapper">
            <Header />

            {useChatSidebar ? (
                <ChatSidebar onBack={handleShowDefault} />
            ) : (
                <Sidebar onToggle={handleShowChat} />
            )}

            <TeamCommunityContentPage />
        </div>
    );
}

export default TeamCommunityPage;
