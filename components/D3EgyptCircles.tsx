import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export function D3EgyptCircles({ height = 360 }: { height?: number }) {
  const html = `<!DOCTYPE html>
  <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
      <style>
        html,body,#c { margin:0; padding:0; height:100%; width:100%; background:#0F172A }
        .title { position:absolute; top:10px; right:12px; color:#E5E7EB; font:600 14px system-ui }
      </style>
      <script src="https://unpkg.com/d3@7/dist/d3.min.js"></script>
    </head>
    <body>
      <div id="c"></div>
      <script>
        const W = document.body.clientWidth, H = document.body.clientHeight;
        const svg = d3.select('#c').append('svg').attr('width', W).attr('height', H);

        const projection = d3.geoMercator().center([31, 27]).scale(1800).translate([W/2, H/2]);
        const path = d3.geoPath(projection);

        // Simple graticule backdrop
        const grat = d3.geoGraticule10();
        svg.append('path').attr('d', path(grat)).attr('fill','none').attr('stroke','#1F2937').attr('opacity',0.6);

        const pts = [
          { name:'القاهرة', lon:31.2357, lat:30.0444, v:120 },
          { name:'الجيزة', lon:31.2110, lat:29.9870, v:80 },
          { name:'الإسكندرية', lon:29.9187, lat:31.2001, v:60 },
          { name:'الأقصر', lon:32.6396, lat:25.6872, v:45 },
          { name:'أسوان', lon:32.8998, lat:24.0889, v:30 }
        ];

        const r = d3.scaleSqrt().domain([0, 140]).range([3, 18]);
        const col = d3.scaleLinear().domain([30, 120]).range(['#10B981','#F59E0B']).interpolate(d3.interpolateHcl);

        const g = svg.append('g');
        g.selectAll('circle').data(pts).join('circle')
          .attr('cx', d => projection([d.lon, d.lat])[0])
          .attr('cy', d => projection([d.lon, d.lat])[1])
          .attr('r', d => r(d.v))
          .attr('fill', d => col(d.v))
          .attr('stroke', '#0B1220').attr('stroke-width', 2)
          .append('title').text(d => d.name + ' • ' + d.v);

        // labels
        g.selectAll('text').data(pts).join('text')
          .attr('x', d => projection([d.lon, d.lat])[0])
          .attr('y', d => projection([d.lon, d.lat])[1] - r(d.v) - 6)
          .attr('text-anchor','middle')
          .attr('fill','#E5E7EB')
          .style('font','600 11px system-ui')
          .text(d => d.v);
      </script>
    </body>
  </html>`;

  return (
    <View style={{ height, borderRadius: 12, overflow: 'hidden' }}>
      <WebView originWhitelist={["*"]} source={{ html }} style={{ flex: 1 }} />
    </View>
  );
}

