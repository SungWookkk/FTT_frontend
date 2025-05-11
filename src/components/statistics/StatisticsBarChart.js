import React from "react";
import PropTypes from "prop-types";
import "../statistics/css/StatisticsContentPage.css";

const StatisticsBarChart = ({
                                data,
                                title,
                                viewBy,
                                onViewByChange,
                                onBarClick,
                            }) => {
    const maxVal = data.length ? Math.max(...data.map(x => x.value)) : 0;

    return (
        <div className={`statistics-chart statistics-chart--${viewBy}`}>
            <div className="chart-header">
                <p className="chart-title">{title}</p>
                <select
                    className="chart-select chart-select--wide"
                    value={viewBy}
                    onChange={e => onViewByChange(e.target.value)}
                >
                    <option value="month">Month</option>
                    <option value="day">Day</option>
                </select>
            </div>

            <div className="bar-chart">
                {data.map((m, i) => (
                    <div
                                    key={i}
                                    className="bar-wrapper"
                                    onClick={() => {
                                        // 5월 같은 한글 레이블에서도 숫자만 파싱
                                        const x = parseInt(m.label, 10);
                                        onBarClick(x);
                                    }}
                                    >
                        <div
                            className="bar"
                            style={{
                                height: `${maxVal ? (m.value / maxVal) * 100 : 0}%`,
                            }}
                        />
                        <span className="bar-label">{m.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

StatisticsBarChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ).isRequired,
    title: PropTypes.string,
    viewBy: PropTypes.oneOf(["month", "day"]).isRequired,
    onViewByChange: PropTypes.func.isRequired,
    onBarClick: PropTypes.func.isRequired,
};

StatisticsBarChart.defaultProps = {
    title: "작업 시작 통계",
};

export default StatisticsBarChart;
