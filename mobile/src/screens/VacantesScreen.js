import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const MOCK_VACANTES = [
  { id_vacante: 1, titulo_puesto: "Gerente de Ventas", departamento: "Ventas", salario: 45000, estado: "activa", descripcion: "Gestión del equipo comercial automotriz.", fecha_publicacion: "2026-03-01T00:00:00Z" },
  { id_vacante: 2, titulo_puesto: "Director de Operaciones", departamento: "Operaciones", salario: 75000, estado: "activa", descripcion: "Supervisión de planta de manufactura automotriz.", fecha_publicacion: "2026-03-02T00:00:00Z" },
  { id_vacante: 3, titulo_puesto: "Ingeniero de Calidad", departamento: "Ingeniería", salario: 38000, estado: "activa", descripcion: "Control y aseguramiento de calidad en línea de producción.", fecha_publicacion: "2026-03-03T00:00:00Z" },
  { id_vacante: 4, titulo_puesto: "Analista de RH", departamento: "Recursos Humanos", salario: 28000, estado: "pausada", descripcion: "Gestión de nómina, contratación y desarrollo organizacional.", fecha_publicacion: "2026-03-04T00:00:00Z" },
  { id_vacante: 5, titulo_puesto: "Técnico de Mantenimiento", departamento: "Operaciones", salario: 22000, estado: "cerrada", descripcion: "Mantenimiento preventivo y correctivo de maquinaria industrial.", fecha_publicacion: "2026-03-05T00:00:00Z" },
];

const getBadgeStyle = (estado) => ({
  activa:  { bg: "#dcfce7", text: "#15803d" },
  pausada: { bg: "#fef9c3", text: "#a16207" },
  cerrada: { bg: "#fee2e2", text: "#b91c1c" },
}[estado] || { bg: "#f1f5f9", text: "#475569" });

export default function VacantesScreen({ navigation }) {
  const [vacantes] = useState(MOCK_VACANTES);

  return (
    <View style={styles.container}>
      <FlatList
        data={vacantes}
        keyExtractor={(item) => String(item.id_vacante)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => {
          const badge = getBadgeStyle(item.estado);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("VacanteDetalle", { vacante: item })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.titulo_puesto}</Text>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.text }]}>{item.estado}</Text>
                </View>
              </View>
              <Text style={styles.dept}>{item.departamento}</Text>
              <Text style={styles.salary}>${Number(item.salario).toLocaleString()} MXN</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 18, shadowColor: "#000", shadowOpacity: .06, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  title: { fontSize: 16, fontWeight: "700", color: "#1a2b4b", flex: 1, marginRight: 8 },
  dept: { fontSize: 13, color: "#64748b", marginBottom: 8 },
  salary: { fontSize: 15, fontWeight: "600", color: "#3b82f6" },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: "600" },
});
