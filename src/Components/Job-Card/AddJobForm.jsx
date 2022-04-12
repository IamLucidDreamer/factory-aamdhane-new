/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */

import React, { useRef, useState, useContext, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Switch, Checkbox } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faUtensils, faMedkit, faCar } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/Authcontext';
import { request } from '../../service/common';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import './jobs.css';
import { WORKING_HOURS } from '../../utils/Helpers';

const { Option } = Select;

const AddJobsForm = (props) => {
  const context = useContext(AuthContext);

  const { userContext } = context;

  const { onSubmit } = props;

  const formRef = useRef(null);

  const [mess, setMess] = useState(true);
  const [accommodation, setAccommodation] = useState(true);

  const [jobTitle, setJobTitle] = useState([]);
  const [skillTitle, setSkillTitle] = useState([]);

  console.log(jobTitle, 'HEllo');
  console.log(skillTitle, 'Hello12');

  const expOptions = [];

  console.log(userContext, 'ds');

  // Call to get Job Title and Skill Title Data
  const getTitleData = () =>
    request(`/api/admin-tasks/dropdown/industryType`, 'GET', {})
      .then((res) =>
        res.map((data) => {
          console.log(data);
          if (data?.label === userContext?.millOwner?.millInfo?.industryType) {
            setJobTitle(data.jobTitle);
            setSkillTitle(data.skill);
          }
          return {};
        }),
      )
      .catch((error) => console.log(error));

  useEffect(() => {
    getTitleData();
  }, []);

  for (let i = 1; i <= 20; i++) {
    expOptions.push(
      <Option key={i} value={i}>
        {`${i} Years`}
      </Option>,
    );
  }

  return (
    <Form
      onFinish={onSubmit}
      ref={formRef}
      required
      onBlur={() => {
        console.log(formRef.current);
        formRef.current?.submit();
      }}
      layout="vertical"
      style={{ margin: 20 }}
    >
      <Row gutter={[12, 12]} className="add-job-container">
        {/* <FontAwesomeIcon icon={faTimes} className="close-form-icon" /> */}
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please select a job title',
              },
            ]}
            required
            label="Job Title"
            name="jobTitle"
          >
            <Select className="custom-select" placeholder="Select Job Title">
              {jobTitle.map((jobTitle) => (
                <Option key={jobTitle.id.toString()} value={jobTitle.label}>
                  {jobTitle.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please select required experience',
              },
            ]}
            required
            name="expReq"
            label="Experience Required"
          >
            <Select placeholder="Select Experience Required">
              <Option key={0} value="0.5">
                0.5 Year
              </Option>
              {expOptions}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} />
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please select working hours',
              },
            ]}
            required
            name="workingHours"
            label="Daily Working Hours"
          >
            <Select placeholder="Select Daily Working Hours">
              {WORKING_HOURS.map((hours) => (
                <Option value={hours}>{hours} Hrs</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please select a skill',
              },
            ]}
            required
            name="skill"
            label="Skill Required"
          >
            <Select placeholder="Select Skill Required">
              {skillTitle.map((skill) => (
                <Option key={skill.id.toString()} value={skill.label}>
                  {skill.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please select a gender',
              },
            ]}
            required
            name="genderPreference"
            label="Gender"
          >
            <Select placeholder="Select Gender">
              <Option value="1">Male</Option>
              <Option value="2">Female</Option>
              <Option value="3">Any</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter a amount',
              },
            ]}
            required
            name="duringTraining"
            label="Salary During Training"
          >
            <Input placeholder="Enter Amount" />
          </Form.Item>
          <Form.Item required name="delisted" hidden initialValue="false" label="delisted">
            <Input placeholder="Enter Amount" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            required
            rules={[
              {
                required: true,
                message: 'Please enter a amount',
              },
            ]}
            name="salaryPerShift"
            label="Daily Salary (After Training)"
          >
            <Input placeholder="Enter Amount" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter required people',
              },
            ]}
            required
            name="peopleReq"
            label="No. of openings"
          >
            <Input placeholder="Enter no. of employees required" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <h3 className="label-heading"> Extra facilities </h3>
          <Row>
            <Col span={12}>
              <FontAwesomeIcon style={{ color: '#3076FF', fontSize: 20 }} icon={faBed} /> &nbsp;
              Accomodation:{' '}
            </Col>
            <Col span={12}>
              <Form.Item name="accommodation" label="" valuePropName="checked" initialValue>
                <Switch onChange={(value) => setAccommodation(value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FontAwesomeIcon style={{ color: '#EF5D5D', fontSize: 20 }} icon={faUtensils} />{' '}
              &nbsp; Mess Facility:{' '}
            </Col>
            <Col span={12}>
              <Form.Item name="messFacility" valuePropName="checked" initialValue>
                <Switch onChange={(value) => setMess(value)} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Form.Item label=" ">
            <Row>
              <Col span={12}>
                <FontAwesomeIcon style={{ color: '#00A642', fontSize: 20 }} icon={faMedkit} />
                &nbsp; Medical Facility:
              </Col>
              <Col span={12}>
                <Form.Item name="medicalFacility" valuePropName="checked" initialValue>
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FontAwesomeIcon style={{ color: '#F3954F', fontSize: 20 }} icon={faCar} /> &nbsp;
                Transportation:
              </Col>
              <Col span={12}>
                <Form.Item name="transportation" valuePropName="checked" initialValue>
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
        <Col span={8} />
        <Col span={24} hidden={!accommodation}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please Number of people in room',
              },
            ]}
            required
            name="numberOfPeopleInRoom"
            label="No. of people in room"
            initialValue="0"
          >
            <Input placeholder="Enter no. of employees required" />
          </Form.Item>
        </Col>
        <Col hidden={!mess} span={24}>
          <h3 className="label-heading"> Meal Type</h3>
          <Col span={12}>
            <Row>
              <Col style={{ display: 'flex' }} span={8}>
                <Form.Item
                  name="meal1"
                  valuePropName="checked"
                  initialValue={mess ? 'Morning' : ''}
                >
                  <Checkbox />
                </Form.Item>
                <h3 style={{ fontSize: 18 }}>&nbsp; Morning</h3>
              </Col>
              <Col style={{ display: 'flex' }} span={8}>
                <Form.Item
                  name="meal2"
                  valuePropName="checked"
                  initialValue={mess ? 'AfterNoon' : ''}
                >
                  <Checkbox />
                </Form.Item>
                <h3 style={{ fontSize: 18 }}>&nbsp; Afternoon</h3>
              </Col>
              <Col style={{ display: 'flex' }} span={8}>
                <Form.Item name="meal3" valuePropName="checked" initialValue={mess ? 'Night' : ''}>
                  <Checkbox />
                </Form.Item>
                <h3 style={{ fontSize: 18 }}>&nbsp; Night</h3>
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
    </Form>
  );
};

export { AddJobsForm };
