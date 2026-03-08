import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const MOCK_POSTULACIONES = [
  {
    id: 1,
    titulo_puesto: "Gerente de Ventas",
    empresa: "GEAR Automotriz",
    departamento: "Ventas",
    fecha_postulacion: "2026-03-01",
    estado: "En revision",
    nota: "Tu CV fue recibido y está siendo evaluado por el equipo de RH.",
  },
  {
    id: 2,
    titulo_puesto: "Director de Operaciones",
    empresa: "GEAR Automotriz",
    departamento: "Operaciones",
    fecha_postulacion: "2026-02-20",
    estado: "Entrevista agendada",
    nota: "Tienes una entrevista programada para el 15 de marzo a las 10:00 AM.",
  },
  {
    id: 3,
    titulo_puesto: "Ingeniero de Calidad",
    empresa: "GEAR Automotriz",
    departamento: "Ingeniería",
    fecha_postulacion: "2026-02-10",
    estado: "Rechazada",
    nota: "Agradecemos tu interés. El perfil no corresponde al requerido en este momento.",
  },
  {
    id: 4,
    titulo_puesto: "Analista de RH",
    empresa: "GEAR Automotriz",
    departamento: "Recursos Humanos",
    fecha_postulacion: "2026-01-28",
    estado: "Aceptada",
    nota: "Felicidades, fuiste seleccionado. El equipo de RH se pondrá en contacto contigo.",
  },
];

const ESTADO_CONFIG = {
  "En revision":          { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6",  border: "#bfdbfe" },
  "Entrevista agendada":  { bg: "#fefce8", text: "#92400e", dot: "#f59e0b",  border: "#fde68a" },
  "Rechazada":            { bg: "#fff1f2", text: "#be123c", dot: "#f43f5e",  border: "#fecdd3" },
  "Aceptada":             { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e",  border: "#bbf7d0" },
};

function EstadoBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8", border: "#e2e8f0" };
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <View style={[styles.badgeDot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.badgeText, { color: cfg.text }]}>{estado}</Text>
    </View>
  );
}

export default function MisPostulacionesScreen() {
  const formatDate = (iso) => {
    const [y, m, d] = iso.split("-");
    const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    return `${d} ${meses[parseInt(m) - 1]} ${y}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.puesto}>{item.titulo_puesto}</Text>
          <Text style={styles.depto}>{item.departamento} — {item.empresa}</Text>
        </View>
        <EstadoBadge estado={item.estado} />
      </View>

      {item.nota ? (
        <View style={styles.notaBox}>
          <Text style={styles.notaText}>{item.nota}</Text>
        </View>
      ) : null}

      <Text style={styles.fecha}>Postulado el {formatDate(item.fecha_postulacion)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_POSTULACIONES}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={() => (
          <View style={styles.summary}>
            <Text style={styles.summaryTotal}>{MOCK_POSTULACIONES.length}</Text>
            <Text style={styles.summaryLabel}>postulaciones en total</Text>
            <View style={styles.summaryPills}>
              {[
                { label: "En revision",         color: "#3b82f6" },
                { label: "Entrevista agendada",  color: "#f59e0b" },
                { label: "Aceptada",             color: "#22c55e" },
                { label: "Rechazada",            color: "#f43f5e" },
              ].map(({ label, color }) => {
                const count = MOCK_POSTULACIONES.filter((p) => p.estado === label).length;
                if (!count) return null;
                return (
                  <View key={label} style={[styles.pill, { borderColor: color }]}>
                    <View style={[styles.pillDot, { backgroundColor: color }]} />
                    <Text style={[styles.pillText, { color }]}>{count} {label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },

  summary: {
    backgroundColor: "#1a2b4b",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTotal: { fontSize: 42, fontWeight: "800", color: "#fff", lineHeight: 48 },
  summaryLabel: { fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 14 },
  summaryPills: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  pill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1, borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  pillDot:  { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontSize: 11, fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  puesto:     { fontSize: 15, fontWeight: "700", color: "#0f172a", marginBottom: 2 },
  depto:      { fontSize: 12, color: "#94a3b8" },

  badge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    borderWidth: 1, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeDot:  { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: "700" },

  notaBox: {
    backgroundColor: "#f8fafc",
    borderLeftWidth: 3, borderLeftColor: "#e2e8f0",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  notaText: { fontSize: 13, color: "#475569", lineHeight: 18 },

  fecha: { fontSize: 11, color: "#cbd5e1", textAlign: "right" },
});
