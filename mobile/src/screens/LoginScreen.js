import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    await AsyncStorage.setItem("gear_token", "mock_token");
    await AsyncStorage.setItem("gear_user", JSON.stringify({ nombre: "Admin", email: form.email, rol: "reclutador" }));
    navigation.replace("Main");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>GEAR</Text>
        <Text style={styles.subtitle}>Gestión Estratégica de Alto Rendimiento</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#94a3b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => setForm({ ...form, password: v })}
        />
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>¿No tienes cuenta? <Text style={{ color: "#3b82f6", fontWeight: "700" }}>Regístrate</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a2b4b", justifyContent: "center", padding: 24 },
  header: { alignItems: "center", marginBottom: 40 },
  logo: { fontSize: 52, fontWeight: "800", color: "#fff", letterSpacing: 8 },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,.6)", textAlign: "center", marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 28, shadowColor: "#000", shadowOpacity: .15, shadowRadius: 20, elevation: 10 },
  title: { fontSize: 22, fontWeight: "700", color: "#1a2b4b", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 14, fontSize: 15, color: "#1e293b", marginBottom: 14, backgroundColor: "#f8fafc" },
  btn: { backgroundColor: "#3b82f6", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 6 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  registerBtn: { marginTop: 16, alignItems: "center", padding: 10 },
  registerText: { color: "#94a3b8", fontSize: 14 },
});
