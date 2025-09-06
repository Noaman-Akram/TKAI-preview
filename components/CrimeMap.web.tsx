import React from 'react';
import { View } from 'react-native';
import { MapboxEgyptCrimeMock } from './MapboxEgyptCrimeMock';

export type CrimePoint = {
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

export default function CrimeMap({ height = 360, data }: { height?: number; data: CrimePoint[] }) {
  // Web-safe fallback using Mapbox GL JS inside a WebView/iframe
  return (
    <View style={{ height, borderRadius: 16, overflow: 'hidden' }}>
      <MapboxEgyptCrimeMock height={height} data={data} />
    </View>
  );
}
