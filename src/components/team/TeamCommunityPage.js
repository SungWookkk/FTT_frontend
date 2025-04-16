import React, { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Header from "../dashboard/Header";
import Sidebar from "../dashboard/Sidebar";
import ChatSidebar from "./ChatSidebar";
import TeamCommunityContentPage from "./TeamCommunityContentPage";
import ChannelDetailContentPage from "./ChannelDetailContentPage";

function TeamCommunityPage() {
    const { path } = useRouteMatch();
    // false: 기본 사이드바, true: 채팅 사이드바 (두 사이드바 전환을 위한 상태)
    const [useChatSidebar, setUseChatSidebar] = useState(true);

    // 채팅 사이드바와 기본 사이드바 전환 함수
    const handleShowChat = () => setUseChatSidebar(true);
    const handleShowDefault = () => setUseChatSidebar(false);

    return (
        <div className="dashboard-wrapper">
            <Header />
            {useChatSidebar ? (
                <ChatSidebar onBack={handleShowDefault} />
            ) : (
                <Sidebar onToggle={handleShowChat} />
            )}

            {/* 중첩 라우트 영역 */}
            <Switch>
                {/* 채널 ID가 없는 경우 기본 커뮤니티 화면 */}
                <Route exact path={path} component={TeamCommunityContentPage} />
                {/* 채널 ID가 있는 경우 채널 상세 화면 */}
                <Route path={`${path}/:channelId`} component={ChannelDetailContentPage} />
            </Switch>
        </div>
    );
}

export default TeamCommunityPage;
