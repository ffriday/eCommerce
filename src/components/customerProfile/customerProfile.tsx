import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './customerProfile.scss';
import { apiContext } from '../App';
import { RoutePath } from '../../constants/types';

export const CustomerProfile = () => {
  const navigate = useNavigate();
  const api = useContext(apiContext);

  useEffect(() => {
    if (api.api.userData.isLogged) navigate(`/${RoutePath.account}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>TEST</div>;
};
