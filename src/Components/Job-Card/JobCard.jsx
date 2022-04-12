import React from 'react';
import { Row, Col, Button, Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRupeeSign, faMapMarker, faSuitcase, faUser } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './jobs.css';

function JobCard(props = []) {
  const {
    id,
    jobTitle,
    industry,
    duration,
    salaryPerShift,
    area,
    city,
    state,
    peopleReq,
    experience,
    appliedBy,
  } = props;
  return (
    <Card
      key={id}
      style={{ background: '#FAFAF7', boxShadow: '0px 0px 4px rgba(0,0,0,0.3)' }}
      title={
        <Col className="card-title">
          <h3>{jobTitle}</h3>
          <span>{industry} </span>
        </Col>
      }
      extra={
        <Col className="card-extra">
          <span>{duration} </span>
          <span>
            <FontAwesomeIcon icon={faBookmark} /> Save{' '}
          </span>
          <span>
            <FontAwesomeIcon icon={faWhatsapp} /> Share
          </span>
        </Col>
      }
    >
      <Row>
        <Col className="card-content-title">
          <span>
            <b>
              <FontAwesomeIcon icon={faRupeeSign} /> {salaryPerShift} /-
            </b>
            &nbsp; Per Day
          </span>
          <br />
          <span>
            <b>
              <FontAwesomeIcon icon={faRupeeSign} /> {salaryPerShift * 31}/-
            </b>
            &nbsp; Per Month
          </span>
        </Col>
      </Row>
      <Row span={24}>
        <Col span={12} className="card-content">
          <span>
            <FontAwesomeIcon icon={faMapMarker} /> {`${area}, ${city}, ${state}`}
          </span>
          <span>
            <FontAwesomeIcon icon={faSuitcase} /> {`${experience} Years`}
          </span>
          <span>
            <FontAwesomeIcon icon={faUser} /> {`${peopleReq} People Required`}
          </span>
        </Col>
        <Col className="card-content" span={12}>
          <Button>{appliedBy} Workers Applied</Button>
        </Col>
      </Row>
    </Card>
  );
}

export { JobCard };
