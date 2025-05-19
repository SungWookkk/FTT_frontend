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
        const err = validate();
        if (err) {
            setMessage(err);
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert("회원가입 성공! 로그인 해주세요.");
                history.push("/login");
            } else {
                const { message } = await response.json();
                throw new Error(message || "회원가입 실패");
            }
        } catch (error) {
            setMessage("회원가입 실패: " + error.message);
        }
    };


    const validate = () => {
        const { userId, username, email, phoneNumber, birthDate, password } = formData;
        // 1) 아이디/닉네임: 영숫자만 (3~20자)
        const idRe = /^[A-Za-z0-9]{3,20}$/;
        if (!idRe.test(userId))   return "아이디는 3~20자의 영문자, 숫자만 가능합니다.";
        if (!idRe.test(username)) return "닉네임은 3~20자의 영문자, 숫자만 가능합니다.";
        // 2) 이메일
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) return "올바른 이메일 주소를 입력해주세요.";
        // 3) 휴대폰: 숫자만 10~11자리
        const phoneRe = /^\d{10,11}$/;
        if (!phoneRe.test(phoneNumber)) return "휴대폰 번호는 '-' 없이 10~11자리 숫자만 입력해주세요.";
        // 4) 비밀번호: 최소 8자, 특수문자 1개 이상, 문자·숫자
        const pwdRe = /^(?=.*[!@#$%^&*])(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!pwdRe.test(password)) return "비밀번호는 8자 이상, 문자·숫자·특수문자(!@#$%…)를 모두 포함해야 합니다.";
        // 5) 생년월일: 만 7세 이상
        const birth = new Date(birthDate);
        const age = new Date().getFullYear() - birth.getFullYear() - ((new Date().getMonth() < birth.getMonth() || (new Date().getMonth() === birth.getMonth() && new Date().getDate() < birth.getDate())) ? 1 : 0);
        if (age < 7) return "만 7세 이상만 가입할 수 있습니다.";
        return "";
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
