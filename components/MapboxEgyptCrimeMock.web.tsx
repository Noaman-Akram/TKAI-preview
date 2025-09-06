import React from 'react';
import { View } from 'react-native';

type CrimePoint = {
  id: string;
  name: string;
  nameEn?: string;
  lat: number;
  lng: number;
  population?: string;
  info?: string;
  riskLevel: 'low' | 'medium' | 'high';
  totalCrimes: number;
  trend: 'up' | 'down' | 'stable';
  categories?: { theft: number; fraud: number; assault: number; cybercrime: number };
};

export function MapboxEgyptCrimeMock({ height = 400, data = [] as CrimePoint[] }: { height?: number; data?: CrimePoint[] }) {
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || 'YOUR_FALLBACK_TOKEN';

  const markers = data.map(d => ({
    lng: d.lng,
    lat: d.lat,
    label: `${d.name}: ${d.totalCrimes}`,
    popup: `${d.name} • الجرائم: ${d.totalCrimes}<br/>المخاطر: ${d.riskLevel}<br/>الاتجاه: ${d.trend}`
  }));

  const html = `<!DOCTYPE html>
  <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.css" rel="stylesheet" />
      <style>
        html, body, #map { margin:0; padding:0; height:100%; width:100%; }
        .label { background:#111827; color:#fff; padding:6px 12px; border-radius:8px; font:700 13px system-ui; box-shadow:0 1px 4px rgba(0,0,0,.35); }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.js"></script>
      <script>
        mapboxgl.accessToken = ${JSON.stringify(token)};
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [30.8025, 26.8206],
          zoom: 5
        });
        const mock = ${JSON.stringify(markers)};
        map.on('load', ()=>{
          mock.forEach(({lng, lat, label, popup})=>{
            const el = document.createElement('div');
            el.className = 'label';
            el.textContent = label;
            const marker = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
            const pop = new mapboxgl.Popup({ offset: 12 }).setHTML(popup);
            marker.setPopup(pop);
          });
        });
      </script>
    </body>
  </html>`;

  return (
    <View style={{ height, borderRadius: 12, overflow: 'hidden' }}>
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      {/* @ts-ignore: iframe is web-only and not in RN types */}
      <iframe
        srcDoc={html}
        style={{ border: 'none', width: '100%', height: '100%' }}
        sandbox="allow-scripts allow-same-origin"
      />
    </View>
  );
}
