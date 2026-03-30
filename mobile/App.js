import { useState } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

import SplashScreenComponent from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import VacantesScreen from "./src/screens/VacantesScreen";
import VacanteDetalleScreen from "./src/screens/VacanteDetalleScreen";
import MisPostulacionesScreen from "./src/screens/MisPostulacionesScreen";
import PerfilScreen from "./src/screens/PerfilScreen";

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const HEADER = {
  headerStyle: { backgroundColor: "#1a2b4b" },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "700" },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...HEADER,
        tabBarStyle: {
          backgroundColor: "#1a2b4b",
          borderTopColor: "rgba(255,255,255,0.08)",
          height: 80,
          paddingBottom: 18,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Vacantes:          focused ? "briefcase"         : "briefcase-outline",
            MisPostulaciones:  focused ? "document-text"     : "document-text-outline",
            Perfil:            focused ? "person-circle"     : "person-circle-outline",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Vacantes"
        component={VacantesScreen}
        options={{ title: "Vacantes", headerTitle: "Vacantes Disponibles" }}
      />
      <Tab.Screen
        name="MisPostulaciones"
        component={MisPostulacionesScreen}
        options={{ title: "Postulaciones", headerTitle: "Mis Postulaciones" }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: "Mi Perfil" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={HEADER}>
          <Stack.Screen name="Login"    component={LoginScreen}    options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Crear cuenta" }} />
          <Stack.Screen name="Main"     component={MainTabs}       options={{ headerShown: false }} />
          <Stack.Screen name="VacanteDetalle" component={VacanteDetalleScreen} options={{ title: "Detalle de Vacante" }} />
        </Stack.Navigator>
        </NavigationContainer>
        {!splashDone && <SplashScreenComponent onFinish={() => setSplashDone(true)} />}
      </View>
    </SafeAreaProvider>
  );
}
