import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function DiscoverScreen() {
  const [msg, setMsg] = useState('Pronto para testar');

  const ping = async () => {
    try {
      const res = await fetch('https://paradaboa-api-1.onrender.com/health');
      const data = await res.json();
      setMsg(JSON.stringify(data));
    } catch (e) {
      setMsg('Falhou: ' + String(e));
    }
  };

  useEffect(() => { ping(); }, []);

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ fontSize:18, marginBottom:12 }}>Discover</Text>
      <Text style={{ marginBottom:12 }}>{msg}</Text>
      <Button title="Testar API novamente" onPress={ping} />
    </View>
  );
}
