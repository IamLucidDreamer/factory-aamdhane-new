/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable dot-notation */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, Upload, Select } from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import { HCLayout } from './Layout/HCLayout';
import { request } from '../service/common';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import './jobs.css';

const { Option } = Select;

const AddFactory = () => {
  const [industries, setIndustries] = useState([]);

  const fetchIndustries = () => {
    request(`/api/admin-tasks/dropdown/industryType`, 'GET').then(async (data) => {
      setIndustries(data);
    });
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const addFactory = (values) => {
    console.log(values);
    request(`/api/mill`, 'POST', {
      data: values,
    })
      .then(async (data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  };

  const actionBtn = [];
  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Add Factory Details"
      actions={actionBtn}
    >
      <Form onFinish={addFactory} layout="vertical">
        <Row gutter={[12, 12]} className="add-job-container">
          <Col span={8}>
            <Form.Item name="millName" label="Factory Name">
              <Input placeholder="Enter Factory Name" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="address" label="Address">
              <Input placeholder="Enter Factory Address" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="area" label="Area">
              <Input placeholder="Enter Factory Area" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="state" label="State">
              <Input placeholder="Enter Factory State" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="city" label="City">
              <Input placeholder="Enter Factory City" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="industryType" label="Industry Type">
              <Select>
                {industries.map((ind) => (
                  <Option key={ind.id} value={ind.label}>
                    {ind.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item label=" ">
              <Button style={{ width: 400, height: 50 }} htmlType="submit" type="primary">
                Add Factory
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <br />

        <Row gutter={16}>
          <Col span={12}>
            <div className="add-job-container">
              <h3 className="label-heading">Upload Mill Images</h3>
              <Upload.Dragger multiple action="" listType="picture">
                <UploadOutlined style={{ fontSize: 30, color: 'blueviolet' }} /> <br />
                <h3>Drag and Drop or Click to upload</h3>
              </Upload.Dragger>
            </div>
          </Col>
          <Col span={12}>
            {' '}
            <div className="add-job-container">
              <h3 className="label-heading">Upload Accommodation Images</h3>

              <Upload.Dragger multiple action="" listType="picture">
                <h3>
                  {' '}
                  <UploadOutlined style={{ fontSize: 30, color: 'blueviolet' }} /> <br /> Drag and
                  Drop or Click to upload
                </h3>
              </Upload.Dragger>
            </div>
          </Col>
        </Row>
      </Form>
    </HCLayout>
  );
};

export { AddFactory };
