import React, { useState } from "react";
import "./css/Login.css";
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
        smsOptIn: false,
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 서버로 POST 요청
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // 폼 데이터를 JSON으로 변환
            });

            if (response.ok) {
                setMessage("회원가입 성공! 로그인 해주세요.");
                alert("회원가입 성공! 로그인 해주세요.");
                history.push("/login"); // 로그인 페이지로 이동
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "회원가입 실패");
            }
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

                        {/* SMS 수신 동의 체크박스 */}
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="smsOptIn"
                                    checked={formData.smsOptIn}
                                    onChange={handleChange}
                                />
                                &nbsp;SMS 알림 수신 동의
                            </label>
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
