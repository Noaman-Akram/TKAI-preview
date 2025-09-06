import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Mapbox from "@rnmapbox/maps";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "YOUR_FALLBACK_TOKEN");

type Risk = "low" | "medium" | "high";
type Trend = "up" | "down" | "stable";

export type CrimePoint = {
  id: string;
  name: string; // Arabic
  nameEn?: string;
  lat: number;
  lng: number;
  population?: string;
  info?: string;
  riskLevel: Risk;
  totalCrimes: number;
  trend: Trend;
  categories?: { theft: number; fraud: number; assault: number; cybercrime: number };
};

const getRiskColor = (lvl: Risk) => (lvl === "high" ? "#EF4444" : lvl === "medium" ? "#F59E0B" : "#10B981");
const getRiskText  = (lvl: Risk) => (lvl === "high" ? "عالي" : lvl === "medium" ? "متوسط" : "منخفض");
const getTrendText = (t: Trend) => (t === "up" ? "↗️" : t === "down" ? "↘️" : "➡️");

function MarkerBubble({ loc }: { loc: CrimePoint }) {
  return (
    <View style={[styles.marker, { backgroundColor: getRiskColor(loc.riskLevel) }]}>
      <Text style={styles.markerText}>{loc.totalCrimes}</Text>
    </View>
  );
}

function renderMarker(loc: CrimePoint) {
  return (
    <Mapbox.PointAnnotation key={loc.id} id={loc.id} coordinate={[loc.lng, loc.lat] as [number, number]}>
      <MarkerBubble loc={loc} />
      <Mapbox.Callout title={loc.name}>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{loc.name} {getTrendText(loc.trend)}</Text>
          {loc.info ? <Text style={styles.calloutInfo}>{loc.info}</Text> : null}
          {loc.population ? (
            <View style={styles.calloutRow}><Text style={styles.calloutLabel}>السكان:</Text><Text style={styles.calloutValue}>{loc.population}</Text></View>
          ) : null}
          <View style={styles.calloutRow}><Text style={styles.calloutLabel}>الجرائم:</Text><Text style={styles.calloutValue}>{loc.totalCrimes}</Text></View>
          {loc.categories ? (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.calloutLabel}>تفصيل:</Text>
              <Text style={styles.calloutInfo}>سرقة: {loc.categories.theft} • احتيال: {loc.categories.fraud}</Text>
              <Text style={styles.calloutInfo}>اعتداء: {loc.categories.assault} • إلكترونية: {loc.categories.cybercrime}</Text>
            </View>
          ) : null}
          <View style={[styles.calloutRow, { marginTop: 8 }]}>
            <Text style={styles.calloutLabel}>المخاطر:</Text>
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(loc.riskLevel) }]}>
              <Text style={styles.riskText}>{getRiskText(loc.riskLevel)}</Text>
            </View>
          </View>
        </View>
      </Mapbox.Callout>
    </Mapbox.PointAnnotation>
  );
}

export default function CrimeMap({ height = 400, data }: { height?: number; data: CrimePoint[] }) {
  return (
    <View style={{ height, borderRadius: 12, overflow: "hidden" }}>
      <Mapbox.MapView style={styles.map} styleURL={"mapbox://styles/mapbox/dark-v11"}>
        <Mapbox.Camera centerCoordinate={[31.0, 26.8]} zoomLevel={5.5} />
        {data.map(renderMarker)}
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  marker: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: "center", alignItems: "center",
    borderWidth: 3, borderColor: "#fff",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
  },
  markerText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  callout: { padding: 12, minWidth: 200, backgroundColor: "#fff", borderRadius: 8 },
  calloutTitle: { fontSize: 18, fontWeight: "bold", color: "#1f2937", marginBottom: 8, textAlign: "right" },
  calloutInfo: { fontSize: 14, color: "#6b7280", marginBottom: 8, textAlign: "right" },
  calloutRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  calloutLabel: { fontSize: 14, color: "#374151" },
  calloutValue: { fontSize: 14, fontWeight: "bold", color: "#1f2937" },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  riskText: { fontSize: 12, fontWeight: "bold", color: "#fff" }
});
