import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

type CrimePoint = {
  name: string;
  lat: number;
  lon: number;
  count: number;
  risk: 'low' | 'medium' | 'high';
  info?: string;
};

interface Props {
  points: CrimePoint[];
  height?: number;
  styleUrl?: string; // custom Mapbox style (e.g., mapbox://styles/noeman5/<id>)
  center?: { lon: number; lat: number };
  zoom?: number;
}

export function MapboxCrimeMap({ points, height = 360, styleUrl, center, zoom }: Props) {
  // Fallback to provided public token if env not set
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoibm9lbWFuNSIsImEiOiJjbWY4bnRsaDgwenNqMmxxczVnZ21ka3U4In0.mE13jsJcn-uHw_mVuh3-Ng';

  // Minimal fallback if token missing
  if (!token) {
    return <View style={[styles.fallback, { height }]} />;
  }

  const html = `<!DOCTYPE html>
  <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.css" rel="stylesheet" />
      <style>
        html, body, #map { margin:0; padding:0; height:100%; width:100%; background:#0F172A; }
        .marker-wrap { position: relative; transform: translate(-50%, -50%); }
        .bubble { position:absolute; top:-22px; right:-14px; background:#0B1220; color:#FFFFFF; font:600 11px system-ui; padding:2px 6px; border-radius:10px; box-shadow:0 0 0 1px #0B1220; }
        .pin { width:18px; height:18px; border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(0,0,0,.35); border:2px solid rgba(255,255,255,.9) }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.js"></script>
      <script>
        const token = ${JSON.stringify(token)};
        const points = ${JSON.stringify(points)};
        mapboxgl.accessToken = token;
        const map = new mapboxgl.Map({
          container: 'map',
          style: ${JSON.stringify(styleUrl || 'mapbox://styles/mapbox/dark-v11')},
          center: ${JSON.stringify([center?.lon ?? 30.8, center?.lat ?? 26.8])},
          zoom: ${JSON.stringify(zoom ?? 4.7)},
        });
        map.addControl(new mapboxgl.NavigationControl({ showCompass:false }), 'top-right');

        const riskColor = (r)=> r==='high'? '#EF4444' : r==='medium'? '#F59E0B' : '#10B981';

        map.on('load', ()=>{
          points.forEach(p=>{
            const el = document.createElement('div');
            el.className = 'marker-wrap';
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.textContent = p.count > 999 ? Math.floor(p.count/1000)+'k' : String(p.count);
            const pin = document.createElement('div');
            pin.className = 'pin';
            pin.style.background = riskColor(p.risk);
            el.appendChild(bubble);
            el.appendChild(pin);
            const marker = new mapboxgl.Marker({ element: el }).setLngLat([p.lon, p.lat]).addTo(map);
            const html = '<div style="font:600 12px system-ui; color:#0B1220">'
              + '<div style="margin-bottom:4px">' + p.name + '</div>'
              + '<div style="font:500 11px system-ui">عدد الجرائم: ' + ((p.count && p.count.toLocaleString) ? p.count.toLocaleString() : p.count) + '</div>'
              + '<div style="font:500 11px system-ui">المخاطر: ' + (p.risk==='high'?'عالي':(p.risk==='medium'?'متوسط':'منخفض')) + '</div>'
              + (p.info ? '<div style="margin-top:4px; font:400 11px system-ui">' + p.info + '</div>' : '')
              + '</div>';
            const popup = new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(html);
            el.addEventListener('mouseenter', () => popup.setLngLat([p.lon, p.lat]).addTo(map));
            el.addEventListener('mouseleave', () => popup.remove());
            el.addEventListener('click', () => popup.setLngLat([p.lon, p.lat]).addTo(map));
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

const styles = StyleSheet.create({
  fallback: { backgroundColor: '#111827', borderRadius: 12 },
});
