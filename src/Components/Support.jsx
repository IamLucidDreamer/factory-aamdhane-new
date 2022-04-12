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

export const Support = () => {
  const [support, setSupport] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    request('/api/support/all', 'GET')
      .then(async (data) => {
        setSupport(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  // const onDelete = (record) => {
  //   Modal.confirm({
  //     title: 'Are you sure, you want to delete?',
  //     okText: 'Yes, Delete',
  //     onOk: () => {
  //       setLoading(true);

  //       request(`/api/support/${record.id}`, 'DELETE')
  //         .then(async () => {
  //           setSupport(support.filter((elem) => record.id !== elem.id));
  //           setLoading(false);
  //         })
  //         .catch((err) => {
  //           setLoading(false);
  //           throw err;
  //         });
  //     },
  //   });
  // };

  const columns = [
    {
      title: 'Name',
      render: (record) => record.user?.name,
    },
    {
      title: 'Phone No.',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={record.user?.phone}>
          {record.user?.phone}
        </Tooltip>
      ),
    },
    {
      title: 'Query',
      dataIndex: 'query',
      ellipsis: {
        showTitle: false,
      },
      render: (query) => (
        <Tooltip placement="topLeft" title={query}>
          {query}
        </Tooltip>
      ),
    },
    {
      title: 'Raised On',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => moment(record.raisedOn).format('DD-MM-YYYY h:mm:ss A'),
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
      title="Support"
      actions={
        <Button type="primary" onClick={fetchData}>
          <ReloadOutlined />
        </Button>
      }
    >
      <DataTable usersData={support} loading={loading} columns={columns} />
    </HCLayout>
  );
};
