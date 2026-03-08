import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";

const MOCK_CANDIDATO = {
  id: 7,
  nombre: "Carlos",
  apellido: "Mendoza",
  email: "carlos.mendoza@gmail.com",
  telefono: "+52 55 1234 5678",
  rol: "Candidato",
  puesto_actual: "Jefe de Ventas Regional",
  anos_experiencia: 8,
  vacante_interes: "Gerente de Ventas",
  empresa_actual: "Nissan Mexicana",
  ciudad: "Monterrey, NL",
  cv_url: "https://drive.google.com/carlos-mendoza-cv",
  estado_postulacion: "En revision",
};

export default function PerfilScreen({ navigation }) {
  const user = MOCK_CANDIDATO;
  const initial = user.nombre[0].toUpperCase();

  const confirmLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: () => navigation.replace("Login") },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

      {/* Hero card */}
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.heroName}>{user.nombre} {user.apellido}</Text>
        <Text style={styles.heroPuesto}>{user.puesto_actual}</Text>
        <Text style={styles.heroEmpresa}>{user.empresa_actual} — {user.ciudad}</Text>
        <View style={styles.estadoBadge}>
          <View style={styles.estadoDot} />
          <Text style={styles.estadoText}>{user.estado_postulacion}</Text>
        </View>
      </View>

      {/* Datos de contacto */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        {[
          { label: "Email",    value: user.email },
          { label: "Telefono", value: user.telefono },
          { label: "Ciudad",   value: user.ciudad },
        ].map(({ label, value }, i, arr) => (
          <View key={label} style={[styles.row, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Perfil profesional */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perfil profesional</Text>
        {[
          { label: "Puesto actual",       value: user.puesto_actual },
          { label: "Anos de experiencia", value: `${user.anos_experiencia} años` },
          { label: "Vacante de interes",  value: user.vacante_interes },
        ].map(({ label, value }, i, arr) => (
          <View key={label} style={[styles.row, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      {/* CV */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Curriculum</Text>
        <View style={[styles.row, { borderBottomWidth: 0, alignItems: "center" }]}>
          <Text style={styles.label}>Archivo CV</Text>
          <Text style={[styles.value, { color: "#3b82f6", maxWidth: 180 }]} numberOfLines={1}>
            {user.cv_url}
          </Text>
        </View>
      </View>

      {/* Cerrar sesion */}
      <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },

  heroCard: {
    backgroundColor: "#1a2b4b",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#3b82f6",
    justifyContent: "center", alignItems: "center",
    marginBottom: 14,
    shadowColor: "#3b82f6", shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  avatarText:   { color: "#fff", fontSize: 32, fontWeight: "800" },
  heroName:     { fontSize: 22, fontWeight: "700", color: "#fff" },
  heroPuesto:   { fontSize: 14, color: "rgba(255,255,255,.65)", marginTop: 4 },
  heroEmpresa:  { fontSize: 13, color: "rgba(255,255,255,.4)", marginTop: 4, marginBottom: 14 },
  estadoBadge: {
    flexDirection: "row", alignItems: "center", gap: 7,
    backgroundColor: "rgba(251,191,36,.15)",
    paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 999,
  },
  estadoDot:  { width: 7, height: 7, borderRadius: 4, backgroundColor: "#fbbf24" },
  estadoText: { color: "#fde68a", fontSize: 12, fontWeight: "600" },

  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: {
    fontSize: 12, fontWeight: "700", color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: "#f1f5f9",
  },
  label: { fontSize: 14, color: "#64748b" },
  value: { fontSize: 14, fontWeight: "600", color: "#1e293b", textAlign: "right", flex: 1, marginLeft: 16 },

  logoutBtn: {
    backgroundColor: "#fee2e2",
    padding: 16, borderRadius: 12,
    alignItems: "center",
    borderWidth: 1, borderColor: "#fecaca",
  },
  logoutText: { color: "#b91c1c", fontWeight: "700", fontSize: 16 },
});

