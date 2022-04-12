/* eslint-disable prefer-template */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect, useContext } from 'react';
import {
  BuildOutlined,
  PicCenterOutlined,
  SwitcherOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from 'chart.js';
// import { Bar, Line } from 'react-chartjs-2';
import { AuthContext } from '../../context/Authcontext';

import { request } from '../../service/common';
import { HCLayout } from '../Layout/HCLayout';
import './dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

const blockStyle = {
  height: '140px',
  padding: 20,
  background: '#FFFEFE',
  color: '#0A6945',
  boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
};

const Dashboard = () => {
  const context = useContext(AuthContext);

  const { userContext, changeContext } = context;

  console.log(userContext);

  // eslint-disable-next-line react/jsx-filename-extension
  // eslint-disable-next-line no-console

  const [mills, setMills] = useState(0);
  const [labourers, setLabourers] = useState(0);
  const [middlemen, setMiddlemen] = useState(0);
  const [applications, setApplications] = useState(0);
  const [middlemanLabours, setMiddlemanLabours] = useState(0);
  const [acceptedApplications, setAcceptedApplications] = useState(0);
  const [inReviewApplications, setInReviewApplications] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);

  useEffect(() => {
    request(`/api/count/mills`, 'GET')
      .then(async (data) => {
        setMills(data.totalMills);
      })
      .catch((err) => {
        throw err;
      });

    request(`/api/count/labourers`, 'GET')
      .then(async (data) => {
        setLabourers(data.totalLabourers);
      })
      .catch((err) => {
        throw err;
      });

    request(`/api/count/middlemen`, 'GET')
      .then(async (data) => {
        setMiddlemen(data.totalMiddlemen);
        setMiddlemanLabours(data.totalMiddlemanLabourers);
      })
      .catch((err) => {
        throw err;
      });

    request(`/api/count/applications`, 'GET')
      .then(async (data) => {
        setApplications(data.totalApplications);
        setAcceptedApplications(data.acceptedApplications);
        setInReviewApplications(data.inReviewApplications);
        setPendingApplications(data.pendingApplications);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  return (
    <HCLayout title={`Hi,${userContext.name}`} subTitle="Welcome to AamDhanE">
      <Row gutter={[24, 24]}>
        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/factory')}
        >
          <div style={blockStyle} className=" rounded-lg block">
            <h2>Total Job Posts</h2>
            <BuildOutlined className="icon" /> <span className="num">0</span>
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/labourer')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Applications Pending</h2>
            <UserOutlined className="icon" /> <span className="num">{labourers + ''}</span>
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/agent')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Accepted Applications</h2>
            <PicCenterOutlined className="icon" /> <span className="num">{middlemen + ''}</span>
          </div>
        </Col>

        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/agent-labourer')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Total Complaints</h2>
            <BuildOutlined className="icon" /> <span className="num">{middlemanLabours + ''}</span>
          </div>
        </Col>
      </Row>
    </HCLayout>
  );
};

export { Dashboard };
