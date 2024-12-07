import React from 'react';
import '../css/Dashboard.css';

const DashboardContent = () => {
    return (
        <div className="main-content">
            <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8">
                <div className="container-fluid">
                    <div className="header-body">
                        <div className="row">
                            {/* 예제 카드 */}
                            <div className="col-xl-3 col-lg-6">
                                <div className="card card-stats mb-4 mb-xl-0">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="card-title text-uppercase text-muted mb-0">Traffic</h5>
                                                <span className="h2 font-weight-bold mb-0">350,897</span>
                                            </div>
                                            <div className="col-auto">
                                                <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                    <i className="fas fa-chart-bar"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up"></i> 3.48%
                      </span>
                                            <span>지난달 대비</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* 추가 카드 추가 가능 */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
