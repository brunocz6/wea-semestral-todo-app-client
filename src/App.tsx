import { FC, useCallback, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/connect/login.component';
import Register from './components/connect/register.component';
import Dashboard from './components/dashboard/dashboard.component';
import Layout from './components/layout/layout.component';
import AuthorizationService from './services/authorize.service';

const App: FC = () => {
  // Získání usera.
  const user = AuthorizationService.getCurrentUser();

  // Handler pro notifikaci o přihlášení.
  const [isAuthenticated, setIsAutheticated] = useState(user != null);

  /** Callback volaný po úspěšném přihlášení uživatele */
  const onLoginSuccessHandler = useCallback(() => {
    setIsAutheticated(true);
  }, [setIsAutheticated]);

  /** Callback volaný po úspěšném odhlášení uživatele */
  const logoutSuccessHandler = useCallback(() => {
    setIsAutheticated(false);
  }, [setIsAutheticated]);

  const dashboardMemo = useMemo(() => (
    <Dashboard onLogout={logoutSuccessHandler} />
  ), [logoutSuccessHandler]);

  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? dashboardMemo : <Navigate to="login" />} />
          <Route path="login" element={!isAuthenticated ? <Login onSuccess={onLoginSuccessHandler} /> : dashboardMemo} />
          <Route path="register" element={!isAuthenticated ? <Register /> : dashboardMemo} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
