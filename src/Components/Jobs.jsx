/* eslint-disable no-loop-func */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable dot-notation */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Button, message, Modal, Alert } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { JobCard } from './Job-Card/JobCard';
import { AuthContext } from '../context/Authcontext';
import { HCLayout } from './Layout/HCLayout';
import { request } from '../service/common';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

import './jobs.css';
import { AddJobsForm } from './Job-Card/AddJobForm';
import { PreviewCard } from './Job-Card/PreviewCard';

SwiperCore.use([Pagination, Navigation]);

const Jobs = () => {
  const context = useContext(AuthContext);

  const { userContext } = context;

  const [allJobs, setAllJobs] = useState([]);

  const [jobFormCount, setJobFormCount] = useState(1);

  const [currentSlide, setCurrentSlide] = useState(1);

  const [previewModal, setPreviewModal] = useState(false);

  const [currentJobs, setCurrentJobs] = useState([]);

  // /////// get all the jobs of factory ////////

  const fetchJobs = () => {
    request('/api/job', 'GET')
      .then(async (data) => {
        setAllJobs(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    console.log(allJobs);
  }, [currentJobs]);

  useEffect(() => {
    fetchJobs();
  }, []);

  // ///////// jobs preview handler ///////

  const previewJobs = () => {
    currentJobs.length > 0 ? setPreviewModal(true) : message.warn('Add some jobs to preview');
  };

  // ////// bulk jobs upload api ////////

  const postJobs = () => {
    const allCurrentJobs = { jobs: currentJobs };

    console.log(allCurrentJobs, 'Job Upload Before request');

    request(`/api/job/bulk-insert/${userContext.millOwner.millInfo.id}`, 'POST', {
      data: allCurrentJobs,
    })
      .then(async (data) => {
        console.log(data, 'Job Upload');
        message.success('Jobs posted successfuly');
        setAllJobs([...allJobs, currentJobs.map((jobs) => jobs)]);
        setCurrentJobs([]);
        setJobFormCount(1);
        setPreviewModal(false);
      })
      .catch((error) => console.log(error));
  };

  const JobsForms = [];

  for (let i = 0; i < jobFormCount; i++) {
    JobsForms.push(
      <AddJobsForm
        key={i.toString()}
        onSubmit={(values) => {
          values.mealType = values.messFacility
            ? `${values.meal1}/${values.meal2}/${values.meal3}`
            : ``;

          if (currentJobs.length <= i) {
            setCurrentJobs([...currentJobs, values]);
          } else {
            setCurrentJobs(
              currentJobs.map((job, idx) => {
                if (idx === i) {
                  return values;
                }
                return job;
              }),
            );
          }
        }}
        id={i}
      />,
    );
  }

  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Build the best workforce with Aamdhane."
    >
      <Row>
        <Col span={21}>
          <h4>Live job posts</h4>
        </Col>
        <Col span={3}>View All Jobs</Col>
      </Row>

      <Swiper spaceBetween={25} slidesPerView={3} navigation style={{ padding: 5 }}>
        {allJobs.map((job) => (
          <SwiperSlide key={job.id}>
            <JobCard
              id={job.id}
              jobTitle={job.jobTitle}
              industry={job.industry}
              duration={job.duration}
              salaryPerShift={job.salaryPerShift}
              area={userContext.millOwner?.millInfo.area}
              city={userContext.millOwner?.millInfo.area}
              state={userContext.millOwner?.millInfo.area}
              experience={job.expReq}
              peopleReq={job.peopleReq}
              appliedBy={job.appliedBy}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <h3 style={{ padding: 10, fontSize: 18, color: '#6C6C6C' }}>Create a new job post</h3>

      {JobsForms}

      <Col className="add-form-btn-component">
        <Button
          onClick={() => {
            if (currentJobs.length === jobFormCount) {
              setJobFormCount(jobFormCount + 1);
            } else {
              message.warn('Please fill the form first');
            }
          }}
          type="text"
        >
          <FontAwesomeIcon className="icon" icon={faPlusCircle} /> &nbsp; Add another job post{' '}
        </Button>
      </Col>

      <Col span={24} className="bottom-fixed-row">
        &nbsp;
        <Button type="primary" onClick={previewJobs}>
          Preview
        </Button>
      </Col>

      <Modal
        visible={previewModal}
        className="jobs-preview-modal"
        onCancel={() => setPreviewModal(false)}
        title={
          <Row className="preview-modal-title">
            <Col>
              <h3>All Previews</h3>
            </Col>
            <Col>
              ({currentSlide}/{currentJobs.length})
            </Col>
          </Row>
        }
        footer={
          <Row className="preview-modal-footer">
            <Col>
              <h3 style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                Total Job Posts Created : {currentJobs.length}
              </h3>
            </Col>
            <Col>
              <Button
                style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}
                type="text"
                onClick={() => setPreviewModal(false)}
              >
                Cancel
              </Button>
              <Button className="add-job-btn" onClick={() => postJobs()}>
                Post
              </Button>
            </Col>
          </Row>
        }
      >
        <Swiper
          spaceBetween={25}
          slidesPerView={1}
          navigation
          onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          onSwiper={(swiper) => console.log(swiper)}
          style={{ padding: 5 }}
        >
          {currentJobs.map((cJob) => (
            <SwiperSlide>
              <PreviewCard jobData={cJob} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Modal>
    </HCLayout>
  );
};

export { Jobs };
