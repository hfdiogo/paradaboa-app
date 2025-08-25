// APP/src/screens/TestApiScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Api } from "../api";

export default function TestApiScreen() {
  const [status, setStatus] = useState("Aguardando…");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkApi() {
    setLoading(true);
    setStatus("Testando conexão…");
    setDetail("");

    try {
      // faz um ping no /health
      const res = await Api.ping();
      setStatus("✅ API Online");
      setDetail(typeof res === "string" ? res : JSON.stringify(res));
    } catch (e) {
      setStatus("❌ Erro ao conectar");
      setDetail(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkApi();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24, alignItems: "center", justifyContent: "center", gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Teste de Conexão com a API</Text>

      {loading ? <ActivityIndicator size="large" /> : <Text style={{ fontSize: 18 }}>{status}</Text>}

      {!!detail && (
        <Text
          style={{ marginTop: 8, fontFamily: "monospace" }}
          numberOfLines={6}
        >
          {detail}
        </Text>
      )}

      <TouchableOpacity
        onPress={checkApi}
        style={{
          marginTop: 16,
          backgroundColor: "#2563eb",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Testar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}
