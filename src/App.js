import React, {useEffect} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {AuthProvider, useAuth} from "./Auth/AuthContext";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css";
import TodoList from "./components/todolist/TodoList";
import TodoListWritePage from "./components/todolist/TodoListWritePage";
import TodoListAllListViewPage from "./components/todolist/TodoListAllListViewPage";
import TodoFolderCreatePage from "./components/todolist/TodoFolderCreatePage";
import TodoFolderAllPage from "./components/todolist/TodoFolderAllPage";
import StatisticsPage from "./components/statistics/StatisticsPage";
import BadgePage from "./components/badge/BadgePage";
import ProfilePage from "./components/profile/ProfilePage";
import TeamPage from "./components/team/TeamPage";
import TeamCreateModal from "./components/team/TeamCreateModal";
import TeamAffiliationPage from "./components/team/TeamAffiliationPage";
import TeamTodoPage from "./components/team/TeamTodoPage";
import TeamManagementPage from "./components/team/TeamManagementPage";
import TeamCommunityPage from "./components/team/TeamCommunityPage";
import ChannelDetailPage from "./components/team/ChannelDetailPage";
import { Client } from "@stomp/stompjs";
import CommunityPage from "./components/community/CommunityPage";
import CommunityBoardPage from "./components/community/CommunityBoardPage";
import CommunityMyPage from "./components/community/CommunityMyPage";
import CommunityDetailPage from "./components/community/CommunityDetailPage";

function PresenceManager() {
    const { auth, updatePresence } = useAuth();

    useEffect(() => {
        // 팀 정보가 준비되지 않았다면 중단
        if (!auth.userId || auth.teams.length === 0) return;

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            // 각 팀마다 join + subscribe
            auth.teams.forEach((tid) => {
                client.publish({
                    destination: "/app/presence/join",
                    body: JSON.stringify({ userId: auth.userId, teamId: tid }),
                });
                client.subscribe(`/topic/presence/${tid}`, (frame) => {
                    const online = JSON.parse(frame.body);
                    updatePresence(tid, online);
                });
            });
        };

        client.activate();

        // 언마운트 시 leave
        const onUnload = () => {
            auth.teams.forEach((tid) => {
                client.publish({
                    destination: "/app/presence/leave",
                    body: JSON.stringify({ userId: auth.userId, teamId: tid }),
                });
            });
            client.deactivate();
        };
        window.addEventListener("beforeunload", onUnload);

        return () => {
            window.removeEventListener("beforeunload", onUnload);
            client.deactivate();
        };
    }, [auth.userId, auth.teams, updatePresence]);

    return null;
}


const App = () => {

    return (
        <AuthProvider>
            {/* 전역 Presence 연결은 이 컴포넌트 하나로 관리 */}
            <PresenceManager />
            <Router>
                <div className="app-container">
                    <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/signup" component={Signup}/>
                        <Route path="/dashboard" component={Dashboard}/>
                        <Route path="/dasboard" component={Dashboard}/>

                        {/*커뮤니티 관련*/}
                        <Route exact path="/community" component={CommunityPage}/>
                        <Route exact path="/community/board" component={CommunityBoardPage}/>
                        <Route path="/community/my-page" component={CommunityMyPage}/>
                        <Route path="/community/board/:no" component={CommunityDetailPage}/>
                        {/*TodoList 관련*/}
                        <Route exact path="/todo" component={TodoList}/>
                        <Route path="/todo/write" component={TodoListWritePage}/>
                        <Route path="/todo/list-all" component={TodoListAllListViewPage}/>
                        <Route path="/todo/folder/create" component={TodoFolderCreatePage}/>
                        <Route path="/todo/folder/all" component={TodoFolderAllPage}/>

                        {/*통계 관련 */}
                        <Route path="/statistics" component={StatisticsPage}/>

                        {/*뱃지 관련*/}
                        <Route path="/badges" component={BadgePage}/>


                        {/* 프로필 관련: URL에 사용자 닉네임 포함 */}
                        <Route exact path="/profile" component={ProfilePage}/>
                        <Route path="/profile/:username" component={ProfilePage}/>

                        {/*팀 관련*/}
                        <Route exact path="/team" component={TeamPage}/>
                        <Route path="/teams/api/create" component={TeamCreateModal}/> {/*팀 생성 모달 */}

                        <Route exact path="/team/:teamId" component={TeamAffiliationPage} />
                        <Route path="/team/:teamId/todo" component={TeamTodoPage} />
                        <Route path="/team/:teamId/management" component={TeamManagementPage} />
                        <Route path="/team/:teamId/community" component={TeamCommunityPage} />
                        <Route path="/team/:teamId/community/:channelId?" component={ChannelDetailPage}/>
                    </Switch>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
