import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

// Simple, self-contained mock based on the snippet you shared.
// Uses Mapbox GL JS inside a WebView so it works in Expo (web + native).
export function MapboxEgyptCrimeMock({ height = 400 }: { height?: number }) {
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoibm9lbWFuNSIsImEiOiJjbWY0aTJ4djcwM3o5MmxzNGczM3B6NGZsIn0.nkPmrDDCQYXpBmrHLta4vg';

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
        const mock = [
          [31.2357, 30.0444, 'Cairo: 120'],
          [31.2110, 29.9870, 'Giza: 80'],
          [32.6396, 25.6872, 'Luxor: 45'],
          [29.9187, 31.2001, 'Alex: 60'],
          [32.8998, 24.0889, 'Aswan: 30']
        ];
        map.on('load', ()=>{
          mock.forEach(([lng, lat, label])=>{
            const el = document.createElement('div');
            el.className = 'label';
            el.textContent = label;
            new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
          });
        });
      </script>
    </body>
  </html>`;

  return (
    <View style={{ height, borderRadius: 12, overflow: 'hidden' }}>
      <WebView originWhitelist={["*"]} source={{ html }} style={{ flex: 1 }} />
    </View>
  );
}

