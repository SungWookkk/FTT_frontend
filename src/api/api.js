import axios from "axios";

// 백엔드 API URL
const API_BASE_URL = "http://localhost:8080/api/auth";

// 로그인 API
export const login = async (userId, password) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/login`,
            { userId, password },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const { token } = response.data; // 응답에서 token 추출
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Axios 헤더에 토큰 설정
        return token;
    } catch (error) {
        console.error("로그인 실패:", error);
        throw new Error(error.response?.data || "로그인 중 문제가 발생했습니다.");
    }
};

// 회원가입 API
export const signup = async (userInfo) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/signup`, userInfo);
        return response.data;
    } catch (error) {
        console.error("Signup failed:", error);
        throw error.response?.data || "An error occurred during signup.";
    }
};
