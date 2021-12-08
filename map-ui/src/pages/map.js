import { useEffect, useContext } from 'react';

import { useMap } from '../hooks/use-map';
import { SocketContext } from '../context/socket-context';

const initialState = {
  lng: -122.4605,
  lat: 37.8077,
  zoom: 13.5,
};

export const MapPage = () => {
  const {
    lat,
    lng,
    zoom,
    setRef,
    newMarker$,
    markerMovement$,
    addMarker,
    updateMarkerPosition,
  } = useMap({ initialState });

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    newMarker$.subscribe((marker) => {
      socket.emit('add-marker', marker);
    });
  }, [newMarker$, socket]);

  useEffect(() => {
    markerMovement$.subscribe((marker) => {
      socket.emit('update-marker', marker);
    })
  }, [markerMovement$, socket]);

  useEffect(() => {
    socket.on('acitve-markers', (markers) => {
      for (let key of Object.keys(markers)) {
        addMarker(markers[key], key);
      }
    });

    socket.on('new-marker', (marker) => {
      addMarker(marker, marker.id);
    });

    socket.on('update-a-marker', (marker) => {
      updateMarkerPosition(marker);
    })
  }, [socket]);

  return (
    <>
      <div className='info'>
        lng: { lng } | lat: { lat} | zoom: { zoom }
      </div>
      <div
        ref={setRef}
        className='mapContainer'
      />
      mapa page
    </>
  );
};