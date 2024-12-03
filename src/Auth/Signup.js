import React, { useState } from "react";
import "./css/Login.css";
import { signup } from "../api/api";
import { useHistory } from "react-router-dom";

const Signup = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        userId: "",
        username: "",
        email: "",
        phoneNumber: "",
        birthDate: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            setMessage("회원가입 성공! 로그인 해주세요.");
            history.push("/login"); // "/login"으로 이동
        } catch (error) {
            setMessage("회원가입 실패: " + error.message);
        }
    };

    return (
        <div className="login-container">
            <div className="left-content">
                <h1>회원가입</h1>
                <p>더 나은 하루를 위해 계획하고 실천을 도와주는 </p>
                <p>스마트 To-Do 서비스를 이용해 보아요!</p>
            </div>
            <div className="right-content">
                <div className="form-wrapper">
                    <h2>회원가입</h2>
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
                            <label>닉네임:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>이메일:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>핸드폰 번호:</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>생년월일:</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
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
                            회원가입
                        </button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Signup;
