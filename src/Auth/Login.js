import React, { useContext, useState } from "react";
import "./css/Login.css";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "./AuthContext";
import axios from "axios";

const Login = () => {
    const history = useHistory();
    const { login,loginWithSocial} = useContext(AuthContext);
    const [formData, setFormData] = useState({ userId: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.userId, formData.password);
            setMessage("로그인 성공!");
            history.push("/dashboard");
        } catch (error) {
            setMessage("로그인 실패: " + error.message);
        }
    };
    //  구글 OAuth2 버튼 클릭 핸들러
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorize/google";
    };
    const handleNaverLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorize/naver";
    };


    const handleDemoLogin = async () => {
        try {
            const res = await axios.get("/api/auth/demo");
            const { token, userName, userId, userRole, profileImage, activeBadge } = res.data;

            // 컨텍스트에 직접 로그인
            loginWithSocial({
                token,
                userName,
                userId,
                userRole,
                profileImage,
                activeBadge,
            });

            history.push("/dashboard");
        } catch (err) {
            setMessage("체험판 로그인 실패: " + (err.response?.data || err.message));
        }
    };

    return (
        <div className="login-container">
            <div className="left-content">
                <h1>환영합니다!</h1>
                <p>
                    AI와 함께 더 나은 하루를 계획하고 실천하세요.
                    스마트 To-Do 리스트 서비스를 제공합니다.
                </p>
            </div>
            <div className="right-content">
                <div className="form-wrapper">
                    <h2>로그인</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>사용자 ID:</label>
                            <input
                                type="text"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>비밀번호:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">
                            로그인
                        </button>
                    </form>
                    {message && <p className="message">{message}</p>}
                    <div className="links">
                        <Link to="/forgot-password">비밀번호를 잊으셨나요?</Link>
                        <Link to="/signup">계정 생성하기</Link>
                    </div>
                    <div className="social-login-container">
                        <p>소셜 계정으로 로그인</p>
                        <div className="social-login-buttons">
                            <button
                                className="social-button"
                                onClick={handleGoogleLogin}
                            >
                                <img
                                    src={require("./css/img/google-btn.png")}
                                    alt="Google Login"
                                />
                            </button>
                            <button className="social-button" onClick={handleNaverLogin}>
                                <img src={require("./css/img/naver-btn.png")} alt="Naver Login"/>
                            </button>
                        </div>
                    </div>
                    <div className="main-page-link">
                         <Link to="#" className="main-page-link" onClick={(e) => {
                        e.preventDefault();
                        handleDemoLogin();
                    }}>
                        서비스 체험판으로 바로 가기
                    </Link>
                </div>
            </div>
        </div>
</div>
)
    ;
};

export default Login;
