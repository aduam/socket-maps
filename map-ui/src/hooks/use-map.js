import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWR1YW0iLCJhIjoiY2t3cGQ0dzI4MGJpNzJubnptb213YzlzZiJ9.x1H8DRLahohal7hS97mfDA';

export const useMap = ({ initialState }) => {
  const ref = useRef();
  const setRef = useCallback((node) => {
    ref.current = node;
  }, []);

  const markers = useRef({});

  const markerMovement = useRef(new Subject());
  const newMarker = useRef(new Subject());

  const map = useRef();
  const [coords, setCoords] = useState(initialState);

  const addMarker = useCallback((event, id) => {
    const { lng, lat } = event.lngLat || event;
      const marker = new mapboxgl.Marker();

      marker.id = id ?? v4();

      marker
        .setLngLat([ lng, lat ])
        .addTo(map.current)
        .setDraggable(true);

        markers.current[ marker.id ] = marker;

        if (!id) {
          newMarker.current.next({
            id: marker.id,
            lng,
            lat,
          });
        }

        marker.on('drag', ({ target }) => {
          const { id } = target;
          const { lng, lat } = target.getLngLat();
          markerMovement.current.next({
            id,
            lng,
            lat,
          });
        });
  }, []);

  const updateMarkerPosition = useCallback(({ id, lng, lat }) => {
    markers.current[id].setLngLat([ lng, lat ]);
  }, []);

  useEffect(() => {
    const createMap = new mapboxgl.Map({
      container: ref.current, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [initialState.lng, initialState.lat], // starting position [lng, lat]
      zoom: initialState.zoom // starting zoom
      });

      map.current = createMap;
  }, []);

  useEffect(() => {
    map.current?.on('move', () => {
      const { lng, lat } = map.current.getCenter();
      const zoom = map.current.getZoom();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: zoom.toFixed(2),
      });
    });

    return () => map.current?.off('move');
  }, []);

  useEffect(() => {
    map.current?.on('click', addMarker);
  }, [addMarker]);

  return {
    lng: coords.lng || null,
    lat: coords.lat || null,
    zoom: coords.zoom || null,
    setRef,
    markers,
    addMarker,
    newMarker$: newMarker.current,
    markerMovement$: markerMovement.current,
    updateMarkerPosition,
  };
};