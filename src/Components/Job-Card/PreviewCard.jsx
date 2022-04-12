import React from 'react';
import { Row, Col, Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faUtensils, faMedkit, faCar } from '@fortawesome/free-solid-svg-icons';

import { Gender } from '../../utils/Helpers';

import './PreviewCard.css';

function PreviewCard(props = []) {
  const { jobData } = props;

  return (
    <Card
      key={jobData.id}
      style={{
        background: '#FAFAF7 !important',
        width: '85%',
        marginLeft: '10%',
        borderRadius: 10,
        padding: 20,
      }}
    >
      <Row style={{ paddingBottom: 10 }}>
        <Col span={8} className="card-content-title">
          <h3> Job Title</h3>
          <h2>{jobData.jobTitle}</h2>
        </Col>
        <Col span={8} className="card-content-title">
          <h3> Experience Required</h3>
          <h2>{jobData.expReq} Years</h2>
        </Col>
        <Col span={8} />
      </Row>

      <Row style={{ paddingBottom: 10 }}>
        <Col span={8} className="card-content-title">
          <h3> Working Hours</h3>
          <h2>{jobData.workingHours} Hours</h2>
        </Col>
        <Col span={8} className="card-content-title">
          <h3>Skills Required</h3>
          <h2> {jobData.skill}</h2>
        </Col>
        <Col span={8} className="card-content-title">
          <h3>Gender </h3>
          <h2> {Gender[jobData.genderPreference]}</h2>
        </Col>
      </Row>

      <Row style={{ paddingBottom: 10 }}>
        <Col span={8} className="card-content-title">
          <h3> Salary During Training</h3>
          <h2>
            {jobData.salaryPerShift * 31} <span> / Per month</span>
          </h2>
        </Col>
        <Col span={8} className="card-content-title">
          <h3>Daily Salary (After Training)</h3>
          <h2>
            {jobData.duringTraining * 31} <span> / Per month</span>
          </h2>
        </Col>
        <Col span={8} className="card-content-title">
          <h3>No. Of Openings </h3>
          <h2> {jobData.peopleReq}</h2>
        </Col>
      </Row>

      <Row style={{ paddingBottom: 10 }}>
        <Col span={24} className="card-content-title">
          <h3>Extra Facilities</h3>
          <Row>
            {jobData.accommodation ? (
              <Col span={6}>
                <h3>
                  <FontAwesomeIcon style={{ color: '#3076FF', fontSize: 20 }} icon={faBed} /> &nbsp;
                  Accommodation
                </h3>
              </Col>
            ) : (
              ''
            )}
            {jobData.medicalFacility ? (
              <Col span={6}>
                <h3>
                  <FontAwesomeIcon style={{ color: '#00A642', fontSize: 20 }} icon={faMedkit} />{' '}
                  &nbsp; Medical Facility
                </h3>
              </Col>
            ) : (
              ''
            )}
            {jobData.messFacility ? (
              <Col span={6}>
                <h3>
                  <FontAwesomeIcon style={{ color: '#EF5D5D', fontSize: 20 }} icon={faUtensils} />
                  &nbsp; Mess Facility
                </h3>
              </Col>
            ) : (
              ''
            )}
            {jobData.transportation ? (
              <Col span={6}>
                <h3>
                  <FontAwesomeIcon style={{ color: '#F3954F', fontSize: 20 }} icon={faCar} /> &nbsp;
                  Transportation
                </h3>
              </Col>
            ) : (
              ''
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
}

export { PreviewCard };
