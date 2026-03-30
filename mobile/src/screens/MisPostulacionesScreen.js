import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MisPostulacionesScreen() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      cargarPostulaciones();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarPostulaciones();
    setRefreshing(false);
  }, []);

  const cargarPostulaciones = async () => {
    setLoading(true);
    try {
      // 1. Obtener ID del usuario logueado
      const userStr = await AsyncStorage.getItem("gear_user");
      if (!userStr) {
        Alert.alert("Error", "No estás logueado.");
        return;
      }
      const user = JSON.parse(userStr);

      // 2. Buscar si el usuario tiene un perfil de candidato (id_candidato)
      const candRes = await api.get("/candidatos");
      const miCandidato = candRes.data.find(c => c.email === user.email);

      if (!miCandidato) {
        setPostulaciones([]); // No es candidato o no ha llenado su perfil
        return;
      }

      // 3. Obtener todas las postulaciones y filtrar
      const postRes = await api.get("/postulaciones");
      
      // 4. Obtener vacantes para cruzar nombres
      const vacantesRes = await api.get("/vacantes");

      // Enriquecer datos
      const misPostulacionesList = postRes.data
        .filter(p => p.id_candidato === miCandidato.id_candidato)
        .map(p => {
          const vacanteRelacionada = vacantesRes.data.find(v => v.id_vacante === p.id_vacante);
          return {
            ...p,
            titulo_puesto: vacanteRelacionada ? vacanteRelacionada.titulo_puesto : "Vacante Desconocida"
          };
        });

      setPostulaciones(misPostulacionesList);
    } catch (error) {
      console.error("Error cargando postulaciones:", error);
      Alert.alert("Error", "No se pudieron cargar tus postulaciones.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "pendiente": return { bg: "#fef9c3", text: "#b45309" }; // amarillo
      case "revisado": return { bg: "#dbeafe", text: "#1d4ed8" }; // azul
      case "aceptado": return { bg: "#dcfce7", text: "#15803d" }; // verde
      case "rechazado": return { bg: "#fee2e2", text: "#b91c1c" }; // rojo
      default: return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  const renderPostulacion = ({ item }) => {
    const estadoReal = item.estado_postulacion || item.estado || "pendiente";
    const statusStyle = getStatusColor(estadoReal);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.positionText}>{item.titulo_puesto}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {estadoReal.charAt(0).toUpperCase() + estadoReal.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.dateLabel}>Aplicado el:</Text>
          <Text style={styles.dateText}>
            {new Date(item.fecha_postulacion).toLocaleDateString("es-MX", {
              year: "numeric", month: "long", day: "numeric"
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {postulaciones.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No hay postulaciones</Text>
          <Text style={styles.emptyText}>Aún no te has postulado a ninguna vacante.</Text>
        </View>
      ) : (
        <FlatList
          data={postulaciones}
          keyExtractor={(item) => item.id_postulacion.toString()}
          renderItem={renderPostulacion}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3b82f6"]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  listContainer: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: "#f1f5f9" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  positionText: { fontSize: 18, fontWeight: "700", color: "#1e293b", flex: 1, marginRight: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "700" },
  cardBody: { flexDirection: "row", alignItems: "center" },
  dateLabel: { fontSize: 13, color: "#64748b", marginRight: 6 },
  dateText: { fontSize: 13, color: "#334155", fontWeight: "500" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#1e293b", marginBottom: 8 },
  emptyText: { fontSize: 15, color: "#64748b", textAlign: "center" }
});
