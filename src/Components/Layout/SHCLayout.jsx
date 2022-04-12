import React, { useState, useContext } from 'react';
import { Layout, Button, Row, Col, Avatar, Image } from 'antd';
import { useHistory } from 'react-router-dom';
import { SearchOutlined, BellOutlined } from '@ant-design/icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'antd/dist/antd.css';
import fav from '../Assets/images/fav.png';
import { Sidebar } from '../Common/Sidebar';
import { AuthContext } from '../../context/Authcontext';

const { Header, Content } = Layout;

// eslint-disable-next-line react/prop-types
export const SHCLayout = ({ children }) => {
  const [state, setState] = useState({
    collapsed: false,
  });

  const style = {
    fontFamily: 'poppins',
  };

  const { userContext } = useContext(AuthContext);
  const history = useHistory();

  return (
    // eslint-disable-next-line react/jsx-filename-extension

    <Layout className="h-screen m-0" style={style}>
      {!!userContext && <Sidebar collapsed={state} setCollapsed={setState} />}

      <Layout className="site-layout">
        {!!userContext && (
          <Header
            className="site-layout-background"
            theme="light"
            style={{
              color: '#fff',
              boxShadow: '4px 0px 4px rgba(0,0,0,.5)',
              background: '#fff',
              fontSize: '21px',
            }}
          >
            <Layout>
              <Row style={{ background: '#fff' }}>
                <Col>
                  {userContext.millOwner?.millInfo ? (
                    <span style={{ color: '#0A6945', fontWeight: 'bold' }}>
                      {userContext.millOwner.millInfo.millName}
                    </span>
                  ) : (
                    <Button
                      type="primary"
                      style={{
                        background: '#FDE939',
                        color: '#226A45',
                        border: '1px dashed #226A45',
                        borderRadius: '5px',
                      }}
                      onClick={() => {
                        history.push('/createFactory');
                      }}
                      size="large"
                    >
                      <FontAwesomeIcon icon={faPlusCircle} /> &nbsp; Set Up Your Factory
                    </Button>
                  )}
                </Col>
                <Row style={{ width: 300, position: 'absolute', background: '#fff', right: 0 }}>
                  <Col span={5}>
                    <SearchOutlined style={{ color: '#000' }} />
                  </Col>
                  <Col span={5}>
                    <BellOutlined style={{ color: '#000' }} />
                  </Col>
                  <Col span={5}>
                    <Avatar size={36} src={<Image src={fav} />} />
                  </Col>
                </Row>
              </Row>
            </Layout>
          </Header>
        )}
        {/* ) : null} */}
        <Content
          className="site-layout-background"
          style={{
            margin: '8px 16px',
            // padding: ,
            minHeight: 280,
            overflowX: 'scroll',
            background: '#F5F5F5',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
