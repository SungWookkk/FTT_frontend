import badge01 from "../../Auth/css/img/badge_design/Badge_01.svg";
import badge02 from "../../Auth/css/img/badge_design/Badge_02.svg";
import badge03 from "../../Auth/css/img/badge_design/Badge_03.svg";
import badge04 from "../../Auth/css/img/badge_design/Badge_04.svg";
import badge05 from "../../Auth/css/img/badge_design/Badge_05.svg";
import badge06 from "../../Auth/css/img/badge_design/Badge_06.svg";
import badge07 from "../../Auth/css/img/badge_design/Badge_07.svg";
import badge08 from "../../Auth/css/img/badge_design/Badge_08.svg";

/**
 * 백엔드 DB의 badge_name 필드 예:
 * - "뚜벅뚜벅 초심자"
 * - "목표를 위한 노력가!"
 * - "꾸준한 실천러!"
 * - "열일 챔피언!"
 * - "미루기를 모르는 사람!"
 * - "갓생을 위한 노력"
 * - "이정도면 미친 사람"
 * - "갓생"
 *
 * 이를 그대로 키로 사용해서 프론트에서 매핑.
 */

// (1) "뚜벅뚜벅 초심자" → 실제 SVG 파일
export const badgeImages = {
    "뚜벅뚜벅 초심자": badge01,
    "목표를 위한 노력가!": badge02,
    "꾸준한 실천러!": badge03,
    "열일 챔피언!": badge04,
    "미루기를 모르는 사람!": badge05,
    "갓생을 위한 노력": badge06,
    "이정도면 미친 사람": badge07,
    "갓생": badge08,
};

// (2) "뚜벅뚜벅 초심자" → 화면에 표시할 문구
export const badgeNameMapping = {
    "뚜벅뚜벅 초심자": "뚜벅뚜벅 초심자",
    "목표를 위한 노력가!": "목표를 위한 노력가!",
    "꾸준한 실천러!": "꾸준한 실천러!",
    "열일 챔피언!": "열일 챔피언!",
    "미루기를 모르는 사람!": "미루기를 모르는 사람!",
    "갓생을 위한 노력": "갓생을 위한 노력",
    "이정도면 미친 사람": "이정도면 미친 사람",
    "갓생": "갓생",
};
