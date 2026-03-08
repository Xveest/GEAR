import { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen({ onFinish }) {
  const logoOpacity   = useRef(new Animated.Value(0)).current;
  const logoScale     = useRef(new Animated.Value(0.75)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth     = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Logo aparece con escala
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      // 2. Linea divisora crece este efecto se logra escalando un View horizontal desde el centro hacia los lados (guardado para futuros proyectos*)
      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      // 3. Subtitulo aparece
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // 4. Pausa
      Animated.delay(900),
      // 5. Pantalla entera se desvanece
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], alignItems: "center" }}>

        {/* Icono circular */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconLetter}>G</Text>
        </View>

        {/* Nombre */}
        <Text style={styles.title}>GEAR</Text>

        {/* Linea animada */}
        <View style={styles.lineContainer}>
          <Animated.View style={[styles.line, { transform: [{ scaleX: lineWidth }] }]} />
        </View>

        {/* Subtitulo */}
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          RECLUTAMIENTO AUTOMOTRIZ
        </Animated.Text>

      </Animated.View>

      {/* Version */}
      <Animated.Text style={[styles.version, { opacity: subtitleOpacity }]}>
        v1.0.0
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#1a2b4b",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  iconLetter: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
  },
  title: {
    fontSize: 46,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 10,
  },
  lineContainer: {
    width: 180,
    marginVertical: 14,
    overflow: "hidden",
  },
  line: {
    height: 1.5,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  version: {
    position: "absolute",
    bottom: 48,
    fontSize: 12,
    color: "rgba(255,255,255,0.2)",
    letterSpacing: 1,
  },
});
