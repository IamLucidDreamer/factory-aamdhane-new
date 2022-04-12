/* eslint-disable react/jsx-curly-newline */
/* eslint-disable dot-notation */
/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-continue */
import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Radio,
  Input,
  Form,
  Row,
  Col,
  Drawer,
  Modal,
  Image,
  message,
  Tabs,
  Tooltip,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  LoginOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { CSVLink } from 'react-csv';
import moment from 'moment';
import { innerTableActionBtnDesign } from './Layout/FormBtnStyle';
import { AuthContext } from '../context/Authcontext';
import { Desc } from './Common/Description';

import { request } from '../service/common';
import { DataTable } from './Table/Table';
import './Layout/style.css';
import { HCLayout } from './Layout/HCLayout';

export const Labor = () => {
  const { TabPane } = Tabs;

  const { TextArea } = Input;

  const [workers, setworkers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [drawer, setDrawer] = useState(false);

  const [siderProps, setSiderProps] = useState({});

  const [editData, setEditData] = useState({});

  const [editModalVisiblity, setEditModalVisiblity] = useState(false);

  const { userContext } = useContext(AuthContext);

  const [title, setTitle] = useState('');

  const [body, setBody] = useState('');

  const [totalworkerss, setTotalworkerss] = useState(0);

  const [unempworkerss, setUnempworkerss] = useState(0);

  const [empworkerss, setEmpworkerss] = useState(0);

  const [bannedworkerss, setBannedworkerss] = useState(0);

  const [disableNotificationButton, setDisableNotificationButton] = useState(true);

  const requestsCaller = (pageParam) => {
    setLoading(true);

    request(
      pageParam === undefined || pageParam === null
        ? `/api/applications/current-mill-labourers?platform=CRM`
        : `/api/applications/current-mill-labourers?platform=CRM${pageParam}`,
      'GET',
    )
      .then(async (data) => {
        data.map((item) => {
          item.key = item.id;
        });

        setworkers(data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    requestsCaller();

    // request(`/api/count/workersers`, 'GET')
    //   .then(async (data) => {
    //     setTotalworkerss(data.totalworkersers);
    //     setEmpworkerss(data.employedworkersers);
    //     setUnempworkerss(data.unemployedworkersers);
    //     setBannedworkerss(data.bannedworkersers);
    //   })
    //   .catch((err) => {
    //     throw err;
    //   });

    // const interval = setInterval(requestsCaller, 300000);
    // return () => clearInterval(interval);
  }, []);

  const actionBtn = [
    <Button type="primary" onClick={() => requestsCaller()}>
      <ReloadOutlined />
    </Button>,

    <Button className="w-44" type="primary" style={{ border: 'none' }}>
      <CSVLink
        filename="workersers.csv"
        data={workers.map((workers) => {
          const updatedworkers = { ...workers };
          updatedworkers.expLevel = ``.concat(`${updatedworkers.expLevel} years`);
          updatedworkers.empStatus = updatedworkers.empStatus ? 'Employed' : 'Unemployed';
          updatedworkers.name = updatedworkers.userInfo?.name;
          updatedworkers.phone = `=""`.concat(updatedworkers.userInfo?.phone, `""`);
          updatedworkers.age = updatedworkers.userInfo?.age;
          updatedworkers.gender = updatedworkers.userInfo?.gender === 1 ? 'Male' : 'Female';
          updatedworkers.locale =
            updatedworkers.userInfo?.locale === 3
              ? 'ta'
              : updatedworkers.userInfo?.locale === 2
              ? 'hi'
              : 'en';
          updatedworkers.imageUrl = updatedworkers.userInfo?.imageUrl;
          updatedworkers.state = updatedworkers.userInfo?.state;
          delete updatedworkers.id;
          delete updatedworkers.userId;
          delete updatedworkers.middlemanId;
          delete updatedworkers.key;
          delete updatedworkers.userInfo;
          return updatedworkers;
        })}
        onClick={() => {
          message.success('The file is downloading');
        }}
        className="w-44"
      >
        Export to CSV
      </CSVLink>
    </Button>,
  ];

  const sendNotification = () => {
    setLoading(true);
    setDisableNotificationButton(false);
    const notif = {
      title,
      body,
      timeStamp: new Date().toJSON(),
      // FCMToken: data.fcmtoken,
      // to: data.name,
      // role: 'workers',
      // type: 'token',
    };

    request(`/api/notification?token=${data.userInfo?.authentication?.fcmtoken}`, 'POST', {
      data: notif,
    })
      .then(async () => {
        // setNotification(...notification, data);
        setDisableNotificationButton(true);
        setLoading(false);
        setTitle('');
        setBody('');
        setDrawer(false);
      })
      .catch((err) => {
        setLoading(false);
        setDisableNotificationButton(true);
        setTitle('');
        setBody('');
        throw err;
      });
  };

  const onEdit = (record) => {
    setEditModalVisiblity(true);
    setEditData(record);
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to Ban this workers',
      okText: 'Yes, Ban',
      onOk: () => {
        setLoading(true);
        request(`/api/app-user?userId=${record.userId}`, 'DELETE')
          .then(async () => {
            setworkers(
              workers.map((workers) =>
                workers.id === record.id
                  ? { ...workers, userInfo: { ...workers.userInfo, isBanned: true } }
                  : workers,
              ),
            );
            setBannedworkerss(bannedworkerss + 1);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            throw err;
          });
      },
    });
  };

  const onUnban = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to un-ban this workers',
      okText: 'Yes, Un-ban',
      onOk: () => {
        setLoading(true);
        request(`/api/app-user/restore?userId=${record.userId}`, 'PATCH')
          .then(async () => {
            setworkers(
              workers.map((workers) =>
                workers.id === record.id
                  ? { ...workers, userInfo: { ...workers.userInfo, isBanned: false } }
                  : workers,
              ),
            );
            setBannedworkerss(bannedworkerss - 1);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            throw err;
          });
      },
    });
  };

  const onDrawerClose = () => {
    setSiderProps({});
    setDrawer(false);
  };
  const onDrawerOpen = (record) => {
    setSiderProps({
      title: record.name,
      data: record,
    });
    setDrawer(true);
  };

  const onEditModalClose = () => {
    setEditModalVisiblity(false);
    setEditData({});
  };
  console.log(workers);
  const editModalSave = () => {
    setEditModalVisiblity(false);
    setLoading(true);
    request(`/api/app-user?userId=${editData.userId}`, 'PATCH', {
      data: {
        name: editData.userInfo.name,
        gender: editData.userInfo.gender.toString(),
        age: editData.userInfo.age,
      },
    })
      .then(async () => {
        setworkers(workers.map((item) => (item.id === editData.id ? editData : item)));
        setLoading(false);
        setEditData({});
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  const data = siderProps.data || {};

  const columns = [
    {
      key: 'Name',
      title: 'Name',
      render: (record) => record.userInfo.name,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={selectedKeys[0]}
              autoFocus
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={confirm}
              onBlur={confirm}
            />
          </Col>
          <Col>
            <Button
              onClick={confirm}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      onFilter: (value, record) =>
        record.userInfo?.name.toLowerCase().includes(value.toLowerCase()),
    },

    {
      key: 'Phone',
      title: 'Phone',
      render: (record) => record.userInfo.phone,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={selectedKeys[0]}
              autoFocus
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={confirm}
              onBlur={confirm}
            />
          </Col>
          <Col>
            <Button
              onClick={confirm}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      onFilter: (value, record) => record.userInfo?.phone.includes(value),
    },
    {
      key: 'gender',
      title: 'Gender',
      render: (record) => (record.userInfo.gender === 2 ? 'Female' : 'Male'),
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' },
      ],
      onFilter: (value, record) =>
        value === 'Male' ? record.userInfo?.gender === 1 : record.userInfo?.gender === 2,
    },
    {
      key: 'Age',
      title: 'Age',
      render: (record) => record.userInfo.age,
      sorter: {
        compare: (param1, param2) => param1.userInfo.age - param2.userInfo.age,
      },
    },
    {
      key: 'skill',
      title: 'Skills',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip
          placement="topLeft"
          title={
            record.skills !== undefined || record.skills.length > 0
              ? record.skills.toString()
              : 'N/A'
          }
        >
          {record.skills !== undefined || record.skills.length > 0
            ? record.skills.toString()
            : 'N/A'}
        </Tooltip>
      ),

      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={selectedKeys[0]}
              autoFocus
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={confirm}
              onBlur={confirm}
            />
          </Col>
          <Col>
            <Button
              onClick={confirm}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      onFilter: (value, record) =>
        record?.skills?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 'status',
      title: 'Status',
      render: (record) => (record.empStatus ? 'Employed' : 'Unemployed'),
      filters: [
        { text: 'Unemployed', value: 'Unemployed' },
        { text: 'Employed', value: 'Employed' },
      ],
      onFilter: (value, record) =>
        value === 'Employed' ? record.empStatus !== undefined : record.empStatus === undefined,
    },
    {
      key: 'createAt',
      title: 'Reg. Date',
      render: (record) => (
        <Tooltip
          placement="top"
          title={`${new Date(record.userInfo?.createdAt).toLocaleDateString()} ${new Date(
            record.userInfo?.createdAt,
          ).toLocaleTimeString()}`}
        >
          {`${new Date(record.userInfo?.createdAt).toLocaleDateString()}`}
        </Tooltip>
      ),
    },
    {
      key: 7,
      title: 'Action',
      render: (record) => (
        <>
          <EyeOutlined
            style={innerTableActionBtnDesign}
            onClick={() => {
              onDrawerOpen(record);
            }}
          />

          {/* {record.userInfo.isBanned === true ? (
            <LoginOutlined style={innerTableActionBtnDesign} onClick={() => onUnban(record)} />
          ) : userContext.access['workersers'][3] ? (
            <DeleteOutlined style={innerTableActionBtnDesign} onClick={() => onDelete(record)} />
          ) : null} */}
        </>
      ),
    },
  ];

  const skillData = data.skills || [];

  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="workers"
      actions={
        <Button type="primary" onClick={requestsCaller}>
          <ReloadOutlined />
        </Button>
      }
    >
      <DataTable usersData={workers} loading={loading} columns={columns} />
      <Row gutter={[8, 8]} className="p-5">
        <Col offset={21}>
          <Button
            type="primary"
            onClick={() => requestsCaller(`&direction=b&lastRecordId=${workers[0].id}`)}
            title="Prev"
          >
            Prev
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() =>
              requestsCaller(`&direction=f&lastRecordId=${workers[workers.length - 1].id}`)
            }
            title="Next"
          >
            Next
          </Button>
        </Col>
      </Row>
      <Drawer
        title={siderProps.title}
        width="750px"
        placement="right"
        onClose={onDrawerClose}
        visible={drawer}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="workers information" key="1">
            <Row>
              <Col span={12} lg={12} md={12} sm={32} xs={32}>
                <Desc title="Name" content={data.userInfo?.name} />
                <Desc title="Phone" content={data.userInfo?.phone} />
                <Desc
                  title="Employment Status"
                  content={data.empStatus ? 'Employed' : 'Unemployed'}
                />
                {data.empStatus !== undefined ? (
                  <div>
                    <Desc title="Job Title" content={data.empStatus?.job.jobTitle} />
                    <Desc title="Mill Name" content={data.empStatus?.mill.millName} />
                    <Desc
                      title="Employed on"
                      content={data.empStatus?.employedOn?.substring(0, 10)}
                    />
                  </div>
                ) : (
                  ''
                )}
              </Col>
              <Col span={12} lg={12} md={12} sm={32} xs={32}>
                <Desc title="Age" content={data.userInfo?.age} />
                <Desc title="Gender" content={data.userInfo?.gender === 2 ? `Female` : 'Male'} />
                <Desc
                  title="Experience"
                  content={data.expLevel === 1 ? `${data.expLevel} year` : `${data.expLevel} years`}
                />
                <Desc title="Skills" content={skillData.map((skill) => `${skill}, `)} />
                {data.empStatus !== undefined ? (
                  <div>
                    <Desc
                      title="Mill Owner Name"
                      content={data.empStatus?.mill?.millOwner?.userInfo?.name}
                    />
                    <Desc
                      title="Mill Owner Phone No."
                      content={data.empStatus?.mill?.millOwner?.userInfo?.phone}
                    />
                  </div>
                ) : (
                  ''
                )}
              </Col>

              <Col span={32} className="p-3 mt-3">
                <h2>
                  <b>Image : </b>
                </h2>
                <Image src={data.userInfo?.imageUrl} height="200px" width="200px" />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Drawer>
    </HCLayout>
  );
};
