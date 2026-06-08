import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectProfileOrders,
  selectProfileOrdersLoading
} from '../../services/selectors';
import {
  fetchProfileOrders,
  ordersWsConnect,
  ordersWsDisconnect
} from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);

  useEffect(() => {
    dispatch(fetchProfileOrders());
    dispatch(ordersWsConnect());

    return () => {
      dispatch(ordersWsDisconnect());
    };
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
