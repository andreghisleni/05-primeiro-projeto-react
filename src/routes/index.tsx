import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" component={Dashboard} exact />
    <Route path="/dashboard" component={() => <Redirect to="/" />} />
    <Route path="/repository/:repository+" component={Repository} />
  </Switch>
);

export default Routes;
