import { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";                                                                                 
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

export default function VacantesScreen({ navigation }) {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVacantes = async () => {
    try {
      const response = await api.get("/vacantes");
      if (response?.data) {
        // Filtramos las vacantes para que no aparezcan las cerradas
        setVacantes(response.data.filter(v => v.estado !== 'cerrada'));
      }
    } catch (error) {
      console.error("Error cargando vacantes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVacantes();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchVacantes();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate("VacanteDetalle", { vacante: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.titulo_puesto}</Text>
        <Text style={styles.status}>{item.estado}</Text>
      </View>
      <Text style={styles.region}>{item.region} • Publicada: {new Date(item.fecha_publicacion).toLocaleDateString()}</Text>
      <Text style={styles.desc} numberOfLines={2}>
        {item.descripcion}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <FlatList
          data={vacantes}
          keyExtractor={(item) => item.id_vacante.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
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
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  title: { fontSize: 16, fontWeight: "700", color: "#1e293b", flex: 1, marginRight: 8 },
  status: { fontSize: 11, backgroundColor: "#e2e8f0", color: "#475569", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, overflow: "hidden" },
  region: { fontSize: 13, color: "#64748b", marginBottom: 8 },
  desc: { fontSize: 14, color: "#475569", lineHeight: 20 },
});
