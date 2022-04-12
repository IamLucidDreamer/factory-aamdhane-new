/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-continue */
import React, { useContext, useState, useEffect } from 'react';
import { Button, Row, Col, Image, Modal, Input, Form, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { request } from '../service/common';
import './Layout/style.css';
import { AuthContext } from '../context/Authcontext';
import { HCLayout } from './Layout/HCLayout';
import { Gender } from '../utils/Helpers';

const { Option } = Select;

export const Factory = () => {
  const context = useContext(AuthContext);

  const [millInfoEdit, setMillInfoEdit] = useState(false);

  const [ownerInfoEdit, setOwnerInfoEdit] = useState(false);
  const [industries, setIndustries] = useState([]);

  const fetchIndustries = () => {
    request(`/api/admin-tasks/dropdown/industryType`, 'GET').then(async (data) => {
      setIndustries(data);
    });
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const { userContext } = context;
  console.log(userContext);

  const updateMill = (values) => {
    console.log(values);
    request('/api/mill', 'PATCH', { data: values }).then((data) => console.log(data));
  };

  const updateOwner = (values) => {
    console.log(values);
    request('/api/app-user', 'PATCH', { data: values }).then((data) => console.log(data));
  };

  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Factory Info"
    >
      <Row gutter={(16, 16)}>
        <Col span={14}>
          <div className="factory-profile-card">
            <div className="factory-profile-title">
              <Button
                type="primary"
                size="middle"
                onClick={() => setMillInfoEdit(true)}
                className=" float-icon"
              >
                {' '}
                Update{' '}
              </Button>
            </div>
            <Row>
              <Col span={12}>
                <center>
                  <Image
                    className="factory-profile-image "
                    src={userContext.imageUrl}
                    preview={false}
                  />
                  <h3>{userContext.millOwner.millInfo.millName}</h3>
                  <h3>
                    <b>Created On </b> <br />
                    {moment(userContext.millOwner.millInfo.createdAt).format('DD-MM-YYYY h:MM:s A')}
                  </h3>
                </center>
              </Col>
              <Col span={12}>
                <div>
                  <h5>Industry Type: {userContext.millOwner?.millInfo?.industryType}</h5>
                  <h5>Area: {userContext.millOwner?.millInfo?.area}</h5>
                  <h5>City : {userContext.millOwner?.millInfo?.city}</h5>
                  <h5>State : {userContext.millOwner?.millInfo?.state}</h5>
                  <h5>Pin Code : {userContext.millOwner?.millInfo?.pinCode}</h5>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={10}>
          <div className="factory-profile-card">
            <div className="factory-profile-title">
              <h2>{userContext.millOwner.millInfo.millName}</h2>
              <Button
                type="primary"
                size="middle"
                onClick={() => setOwnerInfoEdit(true)}
                className=" float-icon"
              >
                {' '}
                Update{' '}
              </Button>
            </div>
            <Row>
              <Col span={12}>
                <div>
                  <h5>Factory Owner : {userContext.name}</h5>
                  <h5>Phone Number : {userContext.phone}</h5>
                  <h5>Age : {userContext.age}</h5>
                  <h5>Gender : {Gender[userContext.gender]}</h5>
                  <h5>Bank Details : {userContext.bankDetails || 'N/A'}</h5>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <h3 className="page-title">Factory Images</h3>
      <Row gutter={16}>
        {userContext.millOwner?.millInfo?.millImages.map((image) => (
          <Col span={5}>
            <div className="image-wrapper">
              <Image key={image} preview={false} style={{ width: 250, height: 150 }} src={image} />
            </div>
          </Col>
        ))}
      </Row>
      <h3 className="page-title">Accommodation Images</h3>
      <Row gutter={16}>
        {userContext.millOwner?.millInfo?.accommodationImages.map((image) => (
          <Col span={5}>
            <div className="image-wrapper">
              <Image key={image} preview={false} style={{ width: 250, height: 150 }} src={image} />
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        visible={millInfoEdit}
        style={{ background: '#f6f6f6', borderRadius: 10, boxShadow: 'none', padding: 20 }}
        okText="Update"
        onCancel={() => setMillInfoEdit(false)}
        footer=" "
      >
        <Form layout="vertical" onFinish={updateMill}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter mill name',
              },
            ]}
            label="Mill Name"
            initialValue={userContext.millOwner.millInfo.millName}
            name="millName"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="industryType"
            rules={[
              {
                required: true,
                message: 'Please select industry type',
              },
            ]}
            label="Industry Type"
          >
            <Select showSearch>
              {industries.map((ind) => (
                <Option key={ind.id} value={ind.label}>
                  {ind.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter area',
              },
            ]}
            label="Area"
            name="area"
            initialValue={userContext.millOwner?.millInfo?.area}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter city',
              },
            ]}
            label="City"
            initialValue={userContext.millOwner?.millInfo?.city}
            name="city"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter state',
              },
            ]}
            label="State"
            name="state"
            initialValue={userContext.millOwner?.millInfo?.state}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter pin code',
              },
            ]}
            label="Pin Code"
            name="pinCode"
            initialValue={userContext.millOwner?.millInfo?.pinCode}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>{' '}
          &nbsp;
          <Button type="default" onClick={() => setMillInfoEdit(false)}>
            Cancel
          </Button>
        </Form>
      </Modal>

      <Modal
        visible={ownerInfoEdit}
        style={{ background: '#f6f6f6', borderRadius: 10, boxShadow: 'none', padding: 20 }}
        okText="Update"
        onCancel={() => setOwnerInfoEdit(false)}
        footer=" "
      >
        <Form layout="vertical" onFinish={updateOwner}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter Owner name',
              },
            ]}
            label="Owner Name"
            initialValue={userContext.name}
            name="name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={[
              {
                required: true,
                message: 'Please select Gender',
              },
            ]}
            label="Gender"
          >
            <Select showSearch>
              <Option key="male" value="1">
                Male
              </Option>
              <Option key="female" value="2">
                Female
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter age',
              },
            ]}
            label="Age"
            name="age"
            initialValue={userContext.age}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>{' '}
          &nbsp;
          <Button type="default" onClick={() => setMillInfoEdit(false)}>
            Cancel
          </Button>
        </Form>
      </Modal>
    </HCLayout>
  );
};
