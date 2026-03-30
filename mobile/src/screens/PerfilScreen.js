import { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function PerfilScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [candidato, setCandidato] = useState(null);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPwd, setLoadingPwd] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const userStr = await AsyncStorage.getItem("gear_user");
          if (userStr) {
            const parsedUser = JSON.parse(userStr);
            setUser(parsedUser);
            // fetch candidato associated with user
            const res = await api.get('/candidatos');
            const myCandidato = res?.data?.find(c => c.email === parsedUser.email);
            if (myCandidato) setCandidato(myCandidato);
          }
        } catch (error) {
          console.error("Error al obtener perfil", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUser();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("gear_token");
    await AsyncStorage.removeItem("gear_user");
    navigation.replace("Login");
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Completa todos los campos de contraseña.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas nuevas no coinciden.");
      return;
    }

    setLoadingPwd(true);
    try {
      await api.put("/auth/change-password", {
        email: user.email,
        oldPassword,
        newPassword
      });
      Alert.alert("Éxito", "Contraseña actualizada correctamente.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo actualizar la contraseña.");
    } finally {
      setLoadingPwd(false);
    }
  };

  if (loading) {
    return <View style={[styles.container, { justifyContent: 'center' }]}><ActivityIndicator size="large" color="#3b82f6" /></View>;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{candidato ? candidato.nombre[0]+candidato.apellido[0] : (user?.nombre?.[0] || "U")}</Text>
          </View>
          <Text style={styles.name}>{candidato ? `${candidato.nombre} ${candidato.apellido}` : user?.nombre}</Text>
          <Text style={styles.role}>{candidato?.puesto_actual || user?.rol}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
          
          {candidato && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.value}>{candidato.telefono || "No registrado"}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.label}>Talento Interno</Text>
                <Text style={styles.value}>{candidato.es_interno ? "Sí" : "No"}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
          
          <Text style={styles.inputLabel}>Contraseña Actual</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry 
            value={oldPassword} 
            onChangeText={setOldPassword}
            placeholder="********"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.inputLabel}>Nueva Contraseña</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry 
            value={newPassword} 
            onChangeText={setNewPassword}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry 
            value={confirmPassword} 
            onChangeText={setConfirmPassword}
            placeholder="Repite tu nueva contraseña"
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity style={styles.pwdBtn} onPress={handleChangePassword} disabled={loadingPwd}>
            {loadingPwd ? <ActivityIndicator color="#fff" /> : <Text style={styles.pwdBtnText}>Actualizar Contraseña</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { alignItems: "center", marginBottom: 32, marginTop: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: "700", color: "#fff", textTransform: "uppercase" },
  name: { fontSize: 24, fontWeight: "700", color: "#1a2b4b", marginBottom: 4 },
  role: { fontSize: 15, color: "#64748b", textTransform: "capitalize" },
  section: { backgroundColor: "#fff", borderRadius: 16, padding: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1a2b4b", marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  label: { fontSize: 14, color: "#64748b", fontWeight: "500" },
  value: { fontSize: 15, color: "#0f172a", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 8 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#64748b", marginBottom: 6, textTransform: "uppercase" },
  input: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 13, fontSize: 15, color: "#1e293b", marginBottom: 16, backgroundColor: "#f8fafc" },
  pwdBtn: { backgroundColor: "#3b82f6", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 8 },
  pwdBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  logoutBtn: { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 40 },
  logoutText: { color: "#ef4444", fontWeight: "700", fontSize: 16 },
});
