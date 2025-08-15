import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Coffee = {
  id: number;
  title: string;
  description: string;
  image?: string;
  ingredients?: string[];
};

export default function HomeScreen() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCoffees = useCallback(async () => {
    try {
      setError(null);
      const res = await axios.get<Coffee[]>("https://api.sampleapis.com/coffee/hot");
      setCoffees(res.data ?? []);
    } catch (e) {
      setError(
        "Não foi possível carregar os cafés. Se estiver rodando no navegador, pode ser CORS. Tente abrir no Expo Go."
      );
      setCoffees([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCoffees();
  }, [fetchCoffees]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.helper}>Carregando cafés…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.button} onPress={() => { setLoading(true); fetchCoffees(); }}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (!coffees.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.helper}>Nenhum café encontrado.</Text>
        <Pressable style={styles.button} onPress={() => { setLoading(true); fetchCoffees(); }}>
          <Text style={styles.buttonText}>Recarregar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={coffees}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCoffees(); }} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: "/details", params: { coffee: JSON.stringify(item) } })}
          >
            {!!item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              {!!item.description && (
                <Text numberOfLines={2} style={styles.desc}>
                  {item.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 10,
    backgroundColor: "#fff" 
  },
  center: { 
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff" 
  },
  helper: { 
    marginTop: 10, 
    fontSize: 14, 
    color: "#555", 
    textAlign: "center" 
  },
  error: { 
    fontSize: 14, 
    color: "#B00020", 
    textAlign: "center", 
    marginBottom: 14 
  },
  button: { 
    backgroundColor: "#8B4513", 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 8 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "600" 
  },
  card: { 
    height: 125,
    flexDirection: "row", 
    backgroundColor: "#f8f0e3", 
    padding: 10, 
    marginBottom: 20, 
    borderRadius: 10 
  },
  image: { 
    width: 88, 
    height: 90, 
    borderRadius: 8, 
    marginRight: 10, 
    marginTop: 5,
    backgroundColor: "#eee" 
  },
  textContainer: { 
    flex: 1 
  },
  title: { 
    marginTop: 4,
    marginLeft: 8,
    fontWeight: "bold", 
    fontSize: 18, 
    marginBottom: 4  
  },
  desc: { 
    marginLeft: 8,
    fontSize: 16, 
    color: "#555" 
  },
});
