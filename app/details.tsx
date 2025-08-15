import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

type Coffee = {
  id: number;
  title: string;
  description: string;
  image?: string;
  ingredients?: string[];
};

export default function DetailScreen() {
  const { coffee } = useLocalSearchParams<{ coffee?: string }>();

  // Protege contra navegação sem params
  if (!coffee) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Nenhum item selecionado.</Text>
      </View>
    );
  }

  const data: Coffee = JSON.parse(String(coffee));

  return (
    <ScrollView style={styles.container}>
      {!!data.image && <Image source={{ uri: data.image }} style={styles.image} />}
      <Text style={styles.title}>{data.title}</Text>
      {!!data.description && <Text style={styles.description}>{data.description}</Text>}

      {!!data.ingredients?.length && (
        <>
          <Text style={styles.subtitle}>Ingredientes</Text>
          {data.ingredients!.map((ing, i) => (
            <Text key={i} style={styles.ingredient}>• {ing}</Text>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  muted: { color: "#666" },
  image: { width: "100%", height: 220, borderRadius: 12, marginBottom: 16, backgroundColor: "#eee" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 22, marginBottom: 16 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, marginTop: 6 },
  ingredient: { fontSize: 16, marginBottom: 4 },
});
