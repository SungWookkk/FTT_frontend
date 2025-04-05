import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthContext";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import MainNavigation from "./MainNavigation";
import "./App.css";
import CommunityBestPosts from "./components/community/CommunityBestPosts";
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

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <MainNavigation/>
                <div className="app-container">
                    <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/signup" component={Signup}/>
                        <Route path="/dashboard" component={Dashboard}/>
                        <Route path="/community" component={CommunityBestPosts}/>
                        <Route path="/dasboard" component={Dashboard}/>

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


                    </Switch>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
