import { createBrowserRouter } from 'react-router';
import { MobileLayout } from './components/MobileLayout';
import { AWBSearchScreen } from './components/AWBSearchScreen';
import { ShipmentDetailScreen } from './components/ShipmentDetailScreen';
import { RecentAWBHistoryScreen } from './components/RecentAWBHistoryScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MobileLayout,
    children: [
      { index: true, Component: AWBSearchScreen },
      { path: 'awb/:id', Component: ShipmentDetailScreen },
      { path: 'history', Component: RecentAWBHistoryScreen },
    ],
  },
]);
