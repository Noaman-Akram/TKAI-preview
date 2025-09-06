import React from 'react';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Platform, Text } from 'react-native';

export type CrimePoint = {
  id: string;
  name: string; // Arabic
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

type Props = { height?: number; data: CrimePoint[] };

const riskColor = (lvl: CrimePoint['riskLevel']) => lvl === 'high' ? '#EF4444' : lvl === 'medium' ? '#F59E0B' : '#10B981';
const trendEmoji = (t: CrimePoint['trend']) => t === 'up' ? '↗️' : t === 'down' ? '↘️' : '➡️';

export default function CrimeMap({ height = 360, data }: Props) {
  return (
    <View style={{ height, borderRadius: 16, overflow: 'hidden' }}>
      <MapView
        style={{ flex: 1 }}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: 26.8206, // Egypt center
          longitude: 30.8025,
          latitudeDelta: 12,  // zoom
          longitudeDelta: 12,
        }}
      >
        {data.map((c) => (
          <Marker
            key={c.id}
            coordinate={{ latitude: c.lat, longitude: c.lng }}
            pinColor={riskColor(c.riskLevel)}
          >
            <Callout>
              <View style={{ minWidth: 220 }}>
                <Text style={{ fontWeight: '700', marginBottom: 6 }}>{c.name} {trendEmoji(c.trend)}</Text>
                {c.info ? <Text style={{ color: '#6b7280', marginBottom: 4 }}>{c.info}</Text> : null}
                {c.population ? <Text style={{ color: '#374151' }}>السكان: <Text style={{ fontWeight: '700' }}>{c.population}</Text></Text> : null}
                <Text style={{ color: '#374151' }}>الجرائم: <Text style={{ fontWeight: '700' }}>{c.totalCrimes}</Text></Text>
                {c.categories ? (
                  <View style={{ marginTop: 4 }}>
                    <Text style={{ color: '#6b7280' }}>سرقة: {c.categories.theft} • احتيال: {c.categories.fraud}</Text>
                    <Text style={{ color: '#6b7280' }}>اعتداء: {c.categories.assault} • إلكترونية: {c.categories.cybercrime}</Text>
                  </View>
                ) : null}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
