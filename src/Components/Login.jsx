/* eslint-disable no-console */
import React, { useState, useContext, useEffect } from 'react';

import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { Row, Col, Image, Button, Input, message, Spin } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { request, setToken } from '../service/common';
import './Login.css';
import logo from './Assets/images/logo.svg';
import slider from './Assets/images/slider.png';
import logo1 from './Assets/company-logos/logo1.png';
import logo2 from './Assets/company-logos/logo2.png';
import logo3 from './Assets/company-logos/logo3.png';
import logo4 from './Assets/company-logos/logo4.png';
import { AuthContext } from '../context/Authcontext';
import { auth } from '../utils/firebase-auth';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import { StateLessLoader } from './Common/Loader';

export const Login = () => {
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpField, setOtpField] = useState(false);
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { userContext, changeContext } = context;
  const history = useHistory();

  const onOtpCancel = () => setOtpField(false);

  useEffect(() => {
    if (userContext) history.push('/');
  }, [userContext]);

  // /////// recaptcha Verification ///////////////

  const recaptchaVarification = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha',
      {
        size: 'invisible',
        callback: (response) => {},
      },
      auth,
    );
  };

  // ////////// OTP Varification ////////////////

  const otpVarification = () => {
    // eslint-disable-next-line no-unused-expressions
    if (number.length === 10) {
      setLoading(true);
      setOtpField(true);
    } else {
      message.warn('Enter A Vaid Number');
      return;
    }

    recaptchaVarification();
    const appVarifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+91${number}`, appVarifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        message.success('OTP sent successfuly');
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);

        message.error('Too Many Attempts.! Try after some time');
      });
  };

  // /////////// Validating OTP and login API call ////////////////

  const varifyOtp = () => {
    setLoading(true);
    const otpVerify = window.confirmationResult;
    otpVerify.confirm(otp).then((result) => {
      request('/api/auth/app-user/login', 'POST', {
        data: { idToken: result.user.accessToken },
      })
        .then(async (data) => {
          setToken(data.token);
          localStorage.setItem('token', data.token);

          request('/api/auth/app-user/login', 'GET').then(async (userData) => {
            changeContext(userData);
            localStorage.setItem('isUserLoggedIn', true);
            history.push('/');
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);

          localStorage.setItem('isUserLoggedIn', false);
        });
    });
  };

  return (
    <>
      <Row
        className="shadow-md"
        style={{ position: 'relative', width: '100%', zIndex: 9, background: 'white' }}
      >
        <Col span={4} sm={4} md={4} lg={4} xl={4}>
          <Image src={logo} preview={false} />
        </Col>
        <Col span={16} sm={16} md={16} lg={16} xl={16} />
        <Col className="p-2" span={4} sm={4} md={4} lg={4} xl={4}>
          <Button type="ghost">
            {' '}
            <FontAwesomeIcon icon={faHeadphones} /> &nbsp; Support
          </Button>
        </Col>
      </Row>
      <Row style={{ zIndex: -2, background: 'white' }}>
        <Col span={12} xs={24} sm={24} md={12} lg={12} xl={12} className="p-3">
          <center>
            <Image src={slider} style={{ width: 500 }} />
          </center>
          <Swiper
            spaceBetween={50}
            pagination={{ clickable: true }}
            navigation
            direction="horizontal"
            effect="coverflow"
            autoplay
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
            <SwiperSlide>
              <Col span={24} style={{ padding: 60 }}>
                <center>
                  <h3 style={{ fontSize: 26, fontWeight: 700 }}>
                    Hire the best blue collar workers <br /> across the country
                  </h3>
                  <p style={{ fontSize: 18 }}>
                    One stop-solution for all worker market <br /> interactions
                  </p>
                </center>
              </Col>
            </SwiperSlide>

            <SwiperSlide>
              <Col span={24} style={{ padding: 60 }}>
                <center>
                  <h3 style={{ fontSize: 26, fontWeight: 700 }}>
                    Hire the best blue collar workers <br /> across the country
                  </h3>
                  <p style={{ fontSize: 18 }}>
                    One stop-solution for all worker market <br /> interactions
                  </p>
                </center>
              </Col>
            </SwiperSlide>

            <SwiperSlide>
              <Col span={24} style={{ padding: 60 }}>
                <center>
                  <h3 style={{ fontSize: 26, fontWeight: 700 }}>
                    Hire the best blue collar workers <br /> across the country
                  </h3>
                  <p style={{ fontSize: 18 }}>
                    One stop-solution for all worker market <br /> interactions
                  </p>
                </center>
              </Col>
            </SwiperSlide>
          </Swiper>
          <Col span={24}>
            <center>
              <p style={{ fontSize: 18 }}>Trusted by 500+ factories across India</p>
            </center>
          </Col>
          <Row style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Col>
              <Image src={logo1} preview={false} />
            </Col>
            <Col>
              <Image src={logo2} preview={false} />
            </Col>
            <Col>
              <Image src={logo3} preview={false} />
            </Col>
            <Col>
              <Image src={logo4} preview={false} />
            </Col>
          </Row>
        </Col>
        <Col
          style={{ zIndex: 0, background: '#DDFFF5' }}
          span={12}
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
        >
          <div id="recaptcha" />
          {loading ? (
            <Col
              style={{
                display: 'flex',
                paddingTop: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spin />
            </Col>
          ) : (
            <Row
              gutter={16}
              style={{
                display: 'flex',
                paddingTop: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Col span={20} style={{ display: 'grid', padding: 30, justifyContent: 'start' }}>
                <h3 style={{ fontSize: 26, fontWeight: 700 }}>Employer sign in</h3>
                <p style={{ fontSize: 18 }}>Enter your mobile no.</p>
              </Col>
              <Col span={20} style={{ display: 'grid', justifyContent: 'start' }}>
                <Row gutter={16} style={{ display: 'flex', padding: 30, justifyContent: 'center' }}>
                  {otpField ? (
                    <>
                      <Col span={24} style={{ display: 'grid', justifyContent: 'start' }}>
                        <Input
                          maxLength={6}
                          minLength={6}
                          autoFocus
                          placeholder="Enter OTP"
                          style={{
                            width: 400,
                            background: 'white',
                            color: 'black',
                            height: 48,
                            fontSize: 18,
                            borderRadius: 5,
                            border: 0,
                          }}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </Col>
                      <Col
                        span={24}
                        style={{ display: 'grid', paddingTop: 20, justifyContent: 'start' }}
                      >
                        <Button
                          type="primary"
                          onClick={varifyOtp}
                          disabled={!otp}
                          style={{
                            width: 400,
                            height: 48,
                            borderRadius: 5,
                            border: 0,
                            background: otp ? '#00B983' : '#A6EDD9',
                          }}
                        >
                          Verify OTP
                        </Button>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col span={4}>
                        <Input
                          style={{
                            width: 60,
                            background: 'white',
                            color: 'black',
                            height: 48,
                            fontSize: 18,
                            borderRadius: 5,
                            border: 0,
                            textAlign: 'center',
                          }}
                          value="+91"
                          disabled
                        />
                      </Col>
                      <Col span={20}>
                        <Input
                          maxLength={10}
                          minLength={10}
                          autoFocus
                          placeholder="Enter your mobile number"
                          style={{
                            width: 400,
                            background: 'white',
                            color: 'black',
                            height: 48,
                            fontSize: 18,
                            borderRadius: 5,
                            border: 0,
                          }}
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          // prefix={<PhoneOutlined />}
                        />
                        <div id="recaptcha" />
                      </Col>

                      <Col
                        span={24}
                        style={{ display: 'grid', paddingTop: 20, justifyContent: 'start' }}
                      >
                        <Button
                          type="primary"
                          onClick={otpVarification}
                          disabled={!number}
                          style={{
                            width: 500,
                            height: 48,
                            borderRadius: 5,
                            border: 0,
                            background: number ? '#00B983' : '#A6EDD9',
                          }}
                        >
                          Get OTP
                        </Button>
                      </Col>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
          )}
          {/* <Divider>OR</Divider> */}
        </Col>
      </Row>
    </>
  );
};
