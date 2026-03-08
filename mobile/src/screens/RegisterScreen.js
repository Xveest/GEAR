import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MOCK_VACANTES = [
  { id: 1, titulo: "Gerente de Ventas Audi" },
  { id: 2, titulo: "Director de Operaciones BMW" },
  { id: 3, titulo: "Ingeniero de Planta Toyota" },
  { id: 4, titulo: "Jefe de Finanzas Mercedes" },
  { id: 5, titulo: "Analista de Logística Ford" },
];

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", telefono: "",
    password: "", confirmPassword: "",
    puesto_actual: "", años_experiencia: "", vacante_id: null, vacante_titulo: "",
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleNext = () => {
    if (!form.nombre || !form.apellido) { Alert.alert("Error", "Ingresa nombre y apellido"); return; }
    if (!form.email.includes("@")) { Alert.alert("Error", "Correo inválido"); return; }
    if (form.password.length < 6) { Alert.alert("Error", "La contraseña debe tener mínimo 6 caracteres"); return; }
    if (form.password !== form.confirmPassword) { Alert.alert("Error", "Las contraseñas no coinciden"); return; }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!form.puesto_actual) { Alert.alert("Error", "Ingresa tu puesto actual"); return; }
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!form.vacante_id) { Alert.alert("Error", "Selecciona una vacante a la que postularte"); return; }
    await AsyncStorage.setItem("gear_token", "mock_token");
    await AsyncStorage.setItem("gear_user", JSON.stringify({
      nombre: form.nombre, apellido: form.apellido,
      email: form.email, rol: "candidato",
    }));
    Alert.alert(
      "¡Postulacion enviada!",
      `Bienvenido/a, ${form.nombre}. Tu postulacion para "${form.vacante_titulo}" fue registrada.`,
      [{ text: "Continuar", onPress: () => navigation.replace("Main") }]
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
        {/* Progress indicator — 3 pasos */}
        <View style={styles.progress}>
          <View style={styles.progressRow}>
            <View style={[styles.dot, { backgroundColor: "#3b82f6" }]}><Text style={styles.dotText}>1</Text></View>
            <View style={[styles.line, { backgroundColor: step >= 2 ? "#3b82f6" : "#e2e8f0" }]} />
            <View style={[styles.dot, { backgroundColor: step >= 2 ? "#3b82f6" : "#e2e8f0" }]}><Text style={[styles.dotText, step < 2 && { color: "#94a3b8" }]}>2</Text></View>
            <View style={[styles.line, { backgroundColor: step >= 3 ? "#3b82f6" : "#e2e8f0" }]} />
            <View style={[styles.dot, { backgroundColor: step >= 3 ? "#3b82f6" : "#e2e8f0" }]}><Text style={[styles.dotText, step < 3 && { color: "#94a3b8" }]}>3</Text></View>
          </View>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressLabel, { color: "#3b82f6" }]}>Datos personales</Text>
            <Text style={[styles.progressLabel, { color: step >= 2 ? "#3b82f6" : "#94a3b8", textAlign: "center" }]}>Perfil</Text>
            <Text style={[styles.progressLabel, { color: step >= 3 ? "#3b82f6" : "#94a3b8", textAlign: "right" }]}>Postulate</Text>
          </View>
        </View>

        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Datos personales</Text>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput style={styles.input} placeholder="Carlos" placeholderTextColor="#94a3b8"
                  value={form.nombre} onChangeText={(v) => set("nombre", v)} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Apellido *</Text>
                <TextInput style={styles.input} placeholder="Mendoza" placeholderTextColor="#94a3b8"
                  value={form.apellido} onChangeText={(v) => set("apellido", v)} />
              </View>
            </View>

            <Text style={styles.label}>Correo electrónico *</Text>
            <TextInput style={styles.input} placeholder="correo@gmail.com" placeholderTextColor="#94a3b8"
              keyboardType="email-address" autoCapitalize="none"
              value={form.email} onChangeText={(v) => set("email", v)} />

            <Text style={styles.label}>Teléfono *</Text>
            <TextInput style={styles.input} placeholder="5512345678" placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={form.telefono} onChangeText={(v) => set("telefono", v)} />

            <Text style={styles.label}>Contraseña *</Text>
            <TextInput style={styles.input} placeholder="Mínimo 6 caracteres" placeholderTextColor="#94a3b8"
              secureTextEntry
              value={form.password} onChangeText={(v) => set("password", v)} />

            <Text style={styles.label}>Confirmar contraseña *</Text>
            <TextInput style={styles.input} placeholder="Repite tu contraseña" placeholderTextColor="#94a3b8"
              secureTextEntry
              value={form.confirmPassword} onChangeText={(v) => set("confirmPassword", v)} />

            <TouchableOpacity style={styles.btn} onPress={handleNext}>
              <Text style={styles.btnText}>Continuar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Perfil profesional</Text>

            <Text style={styles.label}>Puesto actual *</Text>
            <TextInput style={styles.input} placeholder="Ej. Gerente de ventas" placeholderTextColor="#94a3b8"
              value={form.puesto_actual} onChangeText={(v) => set("puesto_actual", v)} />

            <Text style={styles.label}>Años de experiencia</Text>
            <View style={styles.chips}>
              {["0-1", "1-3", "3-5", "5-10", "10+"].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, form.años_experiencia === opt && styles.chipActive]}
                  onPress={() => set("años_experiencia", opt)}
                >
                  <Text style={[styles.chipText, form.años_experiencia === opt && styles.chipTextActive]}>
                    {opt} años
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
              <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: "#f1f5f9" }]} onPress={() => setStep(1)}>
                <Text style={[styles.btnText, { color: "#64748b" }]}>Atras</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { flex: 2 }]} onPress={handleNextStep2}>
                <Text style={styles.btnText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Postulate</Text>
            <Text style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
              Selecciona la vacante a la que deseas aplicar con tu nuevo perfil.
            </Text>

            <Text style={styles.label}>Vacante de interes *</Text>
            {MOCK_VACANTES.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[styles.vacanteOption, form.vacante_id === v.id && styles.vacanteOptionActive]}
                onPress={() => { set("vacante_id", v.id); set("vacante_titulo", v.titulo); }}
              >
                <Text style={[styles.vacanteText, form.vacante_id === v.id && { color: "#3b82f6", fontWeight: "700" }]}>
                  {v.titulo}
                </Text>
                {form.vacante_id === v.id && (
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
              <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: "#f1f5f9" }]} onPress={() => setStep(2)}>
                <Text style={[styles.btnText, { color: "#64748b" }]}>Atras</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { flex: 2, backgroundColor: "#1a2b4b" }]} onPress={handleSubmit}>
                <Text style={styles.btnText}>Postularme</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{ marginTop: 14, alignItems: "center", padding: 10 }}
              onPress={async () => {
                await AsyncStorage.setItem("gear_token", "mock_token");
                await AsyncStorage.setItem("gear_user", JSON.stringify({
                  nombre: form.nombre, apellido: form.apellido,
                  email: form.email, rol: "candidato",
                }));
                navigation.replace("Main");
              }}
            >
              <Text style={{ color: "#94a3b8", fontSize: 14 }}>
                Postularme después
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  progress: { marginBottom: 24 },
  progressRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  dot: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  dotText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  line: { flex: 1, height: 3, marginHorizontal: 8, borderRadius: 2 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, paddingHorizontal: 0 },
  progressLabel: { fontSize: 11, fontWeight: "600", flex: 1 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 24, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1a2b4b", marginBottom: 20 },
  row: { flexDirection: "row" },
  label: { fontSize: 13, fontWeight: "600", color: "#64748b", marginBottom: 6, textTransform: "uppercase" },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 13, fontSize: 15, color: "#1e293b", marginBottom: 16, backgroundColor: "#f8fafc" },
  btn: { backgroundColor: "#3b82f6", padding: 16, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  backBtn: { marginTop: 14, alignItems: "center", padding: 10 },
  backText: { color: "#64748b", fontSize: 14 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "#f8fafc" },
  chipActive: { backgroundColor: "#eff6ff", borderColor: "#3b82f6" },
  chipText: { fontSize: 13, color: "#64748b" },
  chipTextActive: { color: "#3b82f6", fontWeight: "700" },
  vacanteOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#e2e8f0", marginBottom: 8, backgroundColor: "#f8fafc" },
  vacanteOptionActive: { backgroundColor: "#eff6ff", borderColor: "#3b82f6" },
  vacanteText: { fontSize: 14, color: "#1e293b", flex: 1, marginRight: 8 },
});
