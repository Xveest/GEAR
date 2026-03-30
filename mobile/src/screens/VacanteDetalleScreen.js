import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";                                                                            
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function VacanteDetalleScreen({ route, navigation }) {
  const { vacante } = route.params;
  const [submitting, setSubmitting] = useState(false);

  const handlePostular = async () => {
    if (vacante.estado === 'cerrada') {
      Alert.alert("Error", "No puedes postularte a una vacante cerrada.");
      return;
    }

    setSubmitting(true);
    try {
      const userStr = await AsyncStorage.getItem("gear_user");
      if (!userStr) throw new Error("No estás autenticado.");
      const user = JSON.parse(userStr);

      const candRes = await api.get('/candidatos');
      let miCand = candRes?.data?.find(c => c.email === user.email);

      if (!miCand) {
        // Auto-crear candidato
        const newCandRes = await api.post('/candidatos', {
          nombre: user.nombre || "",
          apellido: user.apellido || "",
          email: user.email,
          telefono: user.telefono || "",
          experiencia_anios: 0,
          nivel_estudios: "No especificado",
          es_interno: user.email.endsWith("@gear.com") || user.email.endsWith("@gear.mx")
        });
        miCand = newCandRes.data || newCandRes;
      }

      await api.post("/postulaciones", {
        id_candidato: miCand.id_candidato,
        id_vacante: vacante.id_vacante,
        estado_postulacion: "pendiente"
      });

      Alert.alert("¡Éxito!", "Postulación registrada correctamente", [
        { text: "OK", onPress: () => navigation.navigate("Vacantes") },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo realizar la postulación");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>                                                                                     
      <View style={styles.headerCard}>
        <Text style={styles.title}>{vacante.titulo_puesto}</Text>
        <Text style={styles.dept}>{vacante.region}</Text>
        {vacante.salario ? (
          <Text style={styles.salary}>${Number(vacante.salario).toLocaleString()} MXN</Text> 
        ) : null}                                                                           
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción del puesto</Text>
        <Text style={styles.description}>{vacante.descripcion || "Sin descripción disponible."}</Text>                                                                
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles</Text>
        <View style={styles.detail}><Text style={styles.label}>Estado:</Text><Text style={styles.value}>{vacante.estado}</Text></View>                                  
        <View style={styles.detail}><Text style={styles.label}>Publicado:</Text><Text style={styles.value}>{new Date(vacante.fecha_publicacion).toLocaleDateString("es-MX")}</Text></View>                                                            
      </View>

      {vacante.estado !== 'cerrada' && (
        <TouchableOpacity
          style={[styles.btn, submitting && styles.btnDisabled]}
          onPress={handlePostular}
          disabled={submitting}
        >
          {submitting ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.btnText}>Postularme a esta vacante</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerCard: { backgroundColor: "#1a2b4b", borderRadius: 14, padding: 22, marginBottom: 16 },                                                                    
  title: { fontSize: 20, fontWeight: "800", color: "#fff", marginBottom: 6 },
  dept: { fontSize: 14, color: "rgba(255,255,255,.7)", marginBottom: 10 },
  salary: { fontSize: 18, fontWeight: "700", color: "#60a5fa" },
  section: { backgroundColor: "#fff", borderRadius: 12, padding: 18, marginBottom: 14, shadowColor: "#000", shadowOpacity: .05, shadowRadius: 8, elevation: 2 },  
  sectionTitle: { fontSize: 13, fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },                            
  description: { fontSize: 15, color: "#334155", lineHeight: 22 },
  detail: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },                      
  label: { fontSize: 14, color: "#64748b" },
  value: { fontSize: 14, fontWeight: "600", color: "#1e293b", textTransform: "capitalize" },
  btn: { backgroundColor: "#3b82f6", padding: 18, borderRadius: 12, alignItems: "center", marginTop: 8 },
  btnDisabled: { backgroundColor: "#93c5fd" },                                                         
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
