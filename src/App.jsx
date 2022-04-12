import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { SHCLayout } from './Components/Layout/SHCLayout';
import { Login } from './Components/Login';
import { Dashboard } from './Components/Common/Dashboard';

import 'antd/dist/antd.css';

import { logout } from './service/auth';
import { AuthContext, AuthProvider } from './context/Authcontext';
import { Jobs } from './Components/Jobs';
import { resetToken, setToken } from './service/common';
import { Labor } from './Components/Labor';
import { Approval } from './Components/Approval';
import { Complaints } from './Components/Complaints';
import { Factory } from './Components/factory';
import { AddFactory } from './Components/createFactory';

const Logout = () => {
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const { changeContext } = useContext(AuthContext);

  useEffect(() => {
    logout()
      .catch(() => console.log('err'))
      .finally(() => {
        changeContext(undefined);
        setLogoutSuccess(true);
        resetToken();
        localStorage.removeItem('isUserLoggedIn');
        localStorage.removeItem('token');
      });
  }, []);
  if (!logoutSuccess) return null;

  return <Redirect to="/login" />;
};

export const App = () => {
  if (localStorage.token) {
    setToken(localStorage.token);
  }

  return (
    <BrowserRouter>
      <Switch>
        <AuthProvider>
          <SHCLayout>
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/" exact component={Dashboard} />
            <Route path="/jobs" exact component={Jobs} />
            <Route path="/factory" exact component={Factory} />
            <Route path="/createFactory" exact component={AddFactory} />
            <Route path="/labor" exact component={Labor} />
            <Route path="/approval" exact component={Approval} />
            <Route path="/complaints" exact component={Complaints} />
          </SHCLayout>
        </AuthProvider>
      </Switch>
    </BrowserRouter>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;
