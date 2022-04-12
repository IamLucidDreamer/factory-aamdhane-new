/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-continue */
import React, { useState, useEffect } from 'react';
import { Tooltip, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { request } from '../service/common';
import { DataTable } from './Table/Table';
import './Layout/style.css';
import { HCLayout } from './Layout/HCLayout';

export const Complaints = () => {
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    request('/api/complaint/millOwner', 'GET')
      .then(async (data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const columns = [
    {
      key: 'Name',
      title: 'Name',
      render: (record) => record.labour?.userInfo?.name,
    },
    {
      key: 'Phone No.',
      title: 'Phone No.',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={record.labour?.userInfo?.phone}>
          {record.labour?.userInfo?.phone}
        </Tooltip>
      ),
    },
    {
      key: 'complaint',
      title: 'Complaint',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={record.issue}>
          {record.issue}
        </Tooltip>
      ),
    },
    {
      key: 'Raised On',
      title: 'Raised On',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip
          placement="topLeft"
          title={moment(record.dateOfIssue).format('DD-MM-YYYY h:mm:ss A')}
        >
          {moment(record.dateOfIssue).format('DD-MM-YYYY')}
        </Tooltip>
      ),
    },
    // {
    //   key: 'action',
    //   title: 'Action',
    //   render: (record) => (
    //     <>
    //       <DeleteOutlined style={innerTableActionBtnDesign} onClick={() => onDelete(record)} />
    //     </>
    //   ),
    // },
  ];

  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Complaints"
      actions={
        <Button type="primary" onClick={fetchData}>
          <ReloadOutlined />
        </Button>
      }
    >
      <DataTable usersData={complaints} pagination={false} loading={loading} columns={columns} />
    </HCLayout>
  );
};
