import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Modal, FlatList,
} from "react-native";

const MOCK_CANDIDATOS = [
  { id_candidato: 1, nombre: "Carlos", apellido: "Mendoza" },
  { id_candidato: 2, nombre: "Ana", apellido: "Torres" },
  { id_candidato: 3, nombre: "Luis", apellido: "Ramírez" },
  { id_candidato: 4, nombre: "Sofía", apellido: "Castillo" },
];

export default function PostularseScreen({ route, navigation }) {
  const { vacante } = route.params;
  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePostular = () => {
    if (!selectedCandidato) { Alert.alert("Error", "Selecciona un candidato"); return; }
    Alert.alert("¡Éxito!", "Postulación registrada correctamente", [
      { text: "OK", onPress: () => navigation.navigate("Vacantes") },
    ]);
  };

  const selectedLabel = selectedCandidato
    ? `${selectedCandidato.nombre} ${selectedCandidato.apellido}`
    : "-- Seleccionar candidato --";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.vacanteCard}>
        <Text style={styles.vacanteTitle}>{vacante.titulo_puesto}</Text>
        <Text style={styles.vacanteDept}>{vacante.departamento}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Selecciona candidato</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
          <Text style={[styles.selectorText, !selectedCandidato && { color: "#94a3b8" }]}>
            {selectedLabel}
          </Text>
          <Text style={styles.arrow}>v</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={handlePostular}>
          <Text style={styles.btnText}>Confirmar postulación</Text>
        </TouchableOpacity>
      </View>

      {/* Modal selector — pure JS, no native module needed */}
      <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setModalVisible(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Selecciona un candidato</Text>
          <FlatList
            data={MOCK_CANDIDATOS}
            keyExtractor={(item) => String(item.id_candidato)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, selectedCandidato?.id_candidato === item.id_candidato && styles.optionSelected]}
                onPress={() => { setSelectedCandidato(item); setModalVisible(false); }}
              >
                <Text style={styles.optionText}>{item.nombre} {item.apellido}</Text>
                {selectedCandidato?.id_candidato === item.id_candidato && <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>+</Text></View>}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  vacanteCard: { backgroundColor: "#1a2b4b", borderRadius: 14, padding: 20, marginBottom: 20 },
  vacanteTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 4 },
  vacanteDept: { fontSize: 13, color: "rgba(255,255,255,.6)" },
  form: { backgroundColor: "#fff", borderRadius: 12, padding: 20, shadowColor: "#000", shadowOpacity: .05, shadowRadius: 8, elevation: 2 },
  label: { fontSize: 13, fontWeight: "600", color: "#64748b", marginBottom: 8, textTransform: "uppercase" },
  selector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 14, marginBottom: 20 },
  selectorText: { fontSize: 15, color: "#1e293b" },
  arrow: { fontSize: 16, color: "#64748b" },
  btn: { backgroundColor: "#3b82f6", padding: 16, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: 360 },
  sheetTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b", marginBottom: 12 },
  option: { padding: 16, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  optionSelected: { backgroundColor: "#eff6ff" },
  optionText: { fontSize: 15, color: "#1e293b" },
});
