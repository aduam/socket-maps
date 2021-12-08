import { MapPage } from './pages/map';
import { SocketProvider } from './context/socket-context';

export const MapsApp = () => {
  return (
    <SocketProvider>
      <MapPage />
    </SocketProvider>
  );
};
