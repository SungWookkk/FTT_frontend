import React from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import ProfileContentPage from "./ProfileContentPage";

const ProfilePage = () => {
    return (
        <div className="dashboard-wrapper">
            <Header />
            <Sidebar />
            <ProfileContentPage />
        </div>
    );
};

export default ProfilePage;