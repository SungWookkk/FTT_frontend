import { useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import AuthContext from "./AuthContext";

function OAuth2RedirectHandler() {
    const { loginWithSocial } = useContext(AuthContext);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const payload = {
            token:        params.get("token"),
            userName:     params.get("userName"),
            userId:       params.get("userId"),
            userRole:     params.get("userRole"),
            profileImage: params.get("profileImage"),
            activeBadge:  params.get("activeBadge")
                ? JSON.parse(params.get("activeBadge"))
                : null,
        };

        if (payload.token) {
            loginWithSocial(payload);
            history.replace("/dashboard");
        } else {
            history.replace("/login");
        }
    }, [location.search, loginWithSocial, history]);

    return <p>로그인 처리 중…</p>;
}

export default OAuth2RedirectHandler;
