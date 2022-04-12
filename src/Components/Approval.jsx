/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState, useContext } from 'react';
import { Button, Tooltip, Row, Col, Input, DatePicker } from 'antd';
import { SearchOutlined, CalendarOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import QS from 'query-string';
import { HCLayout } from './Layout/HCLayout';
import { AuthContext } from '../context/Authcontext';
import { DataTable } from './Table/Table';
import { request } from '../service/common';
import './Layout/style.css';
import { innerTableActionBtnDesign } from './Layout/FormBtnStyle';

const Approval = () => {
  const context = useContext(AuthContext);

  const { userContext } = context;

  const [totalApplications, setTotalApplications] = useState(0);
  const [totalAccepted, setTotalAccepted] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [totalInReview, setTotalInReview] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [disableModifyStatusButton, setDisableModifyStatusButton] = useState(true);
  const [applications, setApplications] = useState([]);
  const [isFilterChanged, setIsFilterChanged] = useState(false);

  const [filters, setFilters] = useState({});

  const [loading, setLoading] = useState(true);

  const refreshTable = (queryString) => {
    setLoading(true);
    request(`/api/applications/all?${queryString}`, 'GET')
      .then(async (data) => {
        data.map((item) => (item.key = item.id));
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isFilterChanged) {
      refreshTable(QS.stringify(filters));
      setIsFilterChanged(false);
    }
  }, [isFilterChanged]);

  useEffect(() => {
    fetchData();

    request(`/api/count/applications`, 'GET')
      .then(async (data) => {
        setTotalApplications(data.totalApplications);
        setTotalAccepted(data.acceptedApplications);
        setTotalInReview(data.inReviewApplications);
        setTotalPending(data.pendingApplications);
        setTotalRejected(data.rejectedApplications);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  const onTableFilterChange = (query) => {
    setFilters({ ...filters, ...query });
  };

  const clearFilter = (type) => {
    setFilters({ ...filters, [type]: '' });
    setIsFilterChanged(true);
  };

  const setFilterChange = () => {
    setIsFilterChanged(true);
    // setFilters({ ...filters, isChanged: true });
  };

  const fetchData = (pageParam) => {
    setLoading(true);
    request(
      pageParam === undefined || pageParam === null
        ? `/api/applications/all`
        : `/api/applications/all${pageParam}`,
      'GET',
    )
      .then(async (data) => {
        data.map((item) => (item.key = item.id));
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const modifyStatus = (record, status) => {
    setLoading(true);
    setDisableModifyStatusButton(false);
    const obj = status === '4' ? { status, employedOn: new Date() } : { status };
    request(`/api/applications/${record.id}`, `PATCH`, {
      data: obj,
    })
      .then(async () => {
        setApplications(
          applications.map((application) =>
            application.id === record.id
              ? status === '4'
                ? { ...application, status: 4 }
                : status === '5'
                ? { ...application, status: 5 }
                : { ...application, status }
              : application,
          ),
        );

        if (status === '5') {
          setTotalRejected(totalRejected + 1);
          if (totalAccepted > 0) {
            setTotalAccepted(totalAccepted - 1);
          }
        }

        if (status === '4') {
          setTotalAccepted(totalAccepted + 1);
          setTotalRejected(totalRejected - 1);
        }
        setDisableModifyStatusButton(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setDisableModifyStatusButton(true);
        setLoading(false);
      });
  };

  const columns = [
    {
      key: 'Labour',
      title: 'Labour',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={record.labour.userInfo.name}>
          {record.labour.userInfo.name}
        </Tooltip>
      ),

      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.labourName}
              autoFocus
              onChange={(e) => {
                onTableFilterChange({
                  labourName: e.target.value,
                });
              }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => {
                setFilterChange();
              }}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => clearFilter('labourName')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
    },
    {
      key: 'Agent',
      title: 'Agent',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip
          placement="topLeft"
          title={record.middlemanId ? record.middleman.userInfo.name : 'N/A'}
        >
          {record.middlemanId ? record.middleman.userInfo.name : 'N/A'}
        </Tooltip>
      ),

      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.middlemanName}
              autoFocus
              onChange={(e) => {
                onTableFilterChange({ middlemanName: e.target.value });
              }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => {
                setFilterChange();
              }}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => clearFilter('middlemanName')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      onFilter: (value, record) =>
        record?.middleman?.userInfo?.name &&
        record?.middleman?.userInfo?.name?.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 'Phone',
      title: 'Phone',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip
          placement="topLeft"
          title={
            record.middlemanId ? record.middleman.userInfo.phone : record.labour.userInfo.phone
          }
        >
          {record.middlemanId ? record.middleman.userInfo.phone : record.labour.userInfo.phone}
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
        record.middleman?.userInfo?.phone?.includes(value) ||
        record?.labour?.userInfo?.phone?.includes(value),
    },
    {
      key: 'JobTitle',
      title: 'Job Title',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="top" title={record.job.jobTitle}>
          {record.job.jobTitle}
        </Tooltip>
      ),
      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.jobTitle}
              autoFocus
              onChange={(e) => {
                onTableFilterChange({
                  jobTitle: e.target.value,
                });
              }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => {
                setFilterChange();
              }}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => clearFilter('jobTitle')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
    },
    {
      key: 'MillName',
      title: 'Mill Name',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="top" title={record.job.mill.millName}>
          {record.job.mill.millName}
        </Tooltip>
      ),
      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.millName}
              autoFocus
              onChange={(e) => {
                onTableFilterChange({
                  millName: e.target.value,
                });
              }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => {
                setFilterChange();
              }}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => clearFilter('millName')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
    },
    {
      key: 'MillPhone',
      title: 'Mill Phone',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="top" title={record.job.mill.millOwner.userInfo.phone}>
          {record.job.mill.millOwner.userInfo.phone}
        </Tooltip>
      ),

      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.millPhone}
              autoFocus
              onChange={(e) => {
                onTableFilterChange({
                  millPhone: e.target.value,
                });
              }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => {
                setFilterChange();
              }}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => clearFilter('millPhone')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      // onFilter: (value, record) => record.job?.mill?.millOwner?.userInfo?.phone?.includes(value),
    },
    {
      key: 'AppliedOn',
      title: 'Applied On',
      render: (record) => (
        <Tooltip
          placement="top"
          title={`${new Date(record.createdAt).toLocaleDateString()} ${new Date(
            record.createdAt,
          ).toLocaleTimeString()}`}
        >
          {`${new Date(record.createdAt).toLocaleDateString()}`}
        </Tooltip>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <Row className="p-3 shadow-lg">
          <Col>
            <DatePicker
              value={moment(selectedKeys[0])}
              format="M/D/YYYY"
              onChange={(date, dateString) => {
                setSelectedKeys(dateString ? [dateString] : []);
                confirm({ closeDropdown: false });
              }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <CalendarOutlined style={{ fontSize: 18 }} />,
      onFilter: (value, record) => new Date(record.createdAt).toLocaleDateString().includes(value),
    },
    {
      key: 'Status',
      title: 'Status',
      render: (record) =>
        record.status === undefined
          ? 'Pending'
          : record.status === 2
          ? 'InReview'
          : record.status === 3
          ? 'Shortlisted'
          : record.status === 4
          ? 'Accepted'
          : record.status === 5
          ? 'Rejected'
          : 'Pending',
      // filters: [
      //   { text: 'Accepted', value: 4 },
      //   { text: 'Rejected', value: 5 },
      //   { text: 'In Review', value: 2 },
      //   { text: 'Pending', value: 1 },
      //   { text: 'Shortlisted', value: 3 },
      // ],

      onFilter: (value) => {
        // console.log(value);
        onTableFilterChange({
          status: value,
        });
        setFilterChange();
      },
      width: '100px',
    },
    {
      key: 'Actions',
      title: 'Actions',
      width: '220px',
      render: (record) => (
        <>
          {record.status !== 4 && (
            <Button
              type="primary"
              className={innerTableActionBtnDesign}
              onClick={() => modifyStatus(record, '4', record.millId)}
              disabled={!disableModifyStatusButton}
              style={{ marginRight: 10 }}
            >
              Accept
            </Button>
          )}
          {record.status !== 5 && (
            <Button
              type="primary"
              className={innerTableActionBtnDesign}
              onClick={() => modifyStatus(record, '5', record.millId)}
              disabled={!disableModifyStatusButton}
            >
              Reject
            </Button>
          )}
        </>
      ),
    },
  ];

  // eslint-disable-next-line react/jsx-filename-extension
  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Job Approvals"
      actions={
        <Button type="primary" onClick={fetchData}>
          <ReloadOutlined />
        </Button>
      }
    >
      <Row gutter={24} className="p-3">
        <Col xs={24} md={4} sm={12} lg={4} className="gutter-row ">
          <div className="tileStyle">
            <h2>Total Applications</h2>
            <span>{totalApplications}</span>
          </div>
        </Col>
        <Col xs={24} md={5} sm={12} lg={5} className="gutter-row">
          <div className="tileStyle">
            <h2>Total Accepted</h2>
            <span>{totalAccepted}</span>
          </div>
        </Col>

        <Col xs={24} md={5} sm={12} lg={5}>
          <div className="tileStyle">
            <h2>Total Rejected</h2>
            <span>{totalRejected}</span>
          </div>
        </Col>

        <Col xs={24} md={5} sm={12} lg={5} className="gutter-row">
          <div className="tileStyle">
            <h2>In Review</h2>
            <span>{totalInReview}</span>
          </div>
        </Col>

        <Col xs={24} md={5} sm={12} lg={5} className="gutter-row">
          <div className="tileStyle">
            <h2>Pending</h2>
            <span>{totalPending}</span>
          </div>
        </Col>
      </Row>

      <DataTable usersData={applications} loading={loading} columns={columns} />
      <Row gutter={[8, 8]} className="p-5">
        <Col offset={21}>
          <Button
            type="primary"
            onClick={() => fetchData(`?direction=b&lastRecordId=${applications[0].id}`)}
            title="Prev"
          >
            Prev
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() =>
              fetchData(`?direction=f&lastRecordId=${applications[applications.length - 1].id}`)
            }
            title="Next"
          >
            Next
          </Button>
        </Col>
      </Row>
    </HCLayout>
  );
};

export { Approval };
