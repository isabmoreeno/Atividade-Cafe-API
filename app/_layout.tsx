import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Cafés Quentes" }} />
      <Stack.Screen name="details" options={{ title: "Detalhes do Café" }} />
    </Stack>
  );
}
