import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Api } from '../api';
import { API_BASE_URL } from '../config';
import { registerForPushNotificationsAsync } from '../lib/notifications';
import { startGeofencing } from '../lib/geofencing';

export default function DiscoverScreen({ navigation }) {
  const [tab, setTab] = useState('instant');
  const [showMap, setShowMap] = useState(true);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [waking, setWaking] = useState(true);

  async function load() {
    setLoading(true);
    try { setMeals(await Api.listMeals({ mode: tab })); } catch(e){}
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      try {
        setWaking(true);
        await Api.ping();
      } catch (e) {
      } finally {
        setWaking(false);
        load();
      }
    })();
  }, []);

  useEffect(() => { if (!waking) load(); }, [tab, waking]);

  useEffect(()=>{
    (async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await fetch(`${API_BASE_URL}/notifications/register-token`, {
            method:'POST', headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ expo_token: token, platform:'expo' })
          });
        }
      } catch(e) {}
    })();
  }, []);

  useEffect(()=>{
    (async () => {
      const regions = meals.filter(m=>m.lat && m.lng).slice(0, 20).map(m => ({
        identifier: m.title || 'refeicao',
        latitude: m.lat, longitude: m.lng, radius: 500
      }));
      if (regions.length) { try { await startGeofencing(regions); } catch(e) {} }
    })();
  }, [meals]);

  function Item({ item }) {
    return (
      <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('Detalhe', { id: item.id })}>
        <Text style={styles.title}>{item.title} • R$ {(item.price_cents/100).toFixed(2)}</Text>
        <Text style={styles.desc}>{item.address_text || 'Local a confirmar'}</Text>
        <Text style={styles.badge}>{item.mode==='instant'?'Disponível agora':'Agendado'}</Text>
      </TouchableOpacity>
    );
  }

  if (waking) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:16 }}>
        <Text style={{ fontSize:18, fontWeight:'700', color:'#1a4d8f', textAlign:'center' }}>
          Acordando o servidor…
        </Text>
        <Text style={{ marginTop:8, color:'#555', textAlign:'center' }}>
          Isso pode levar até ~1 minuto na primeira chamada (plano gratuito).
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex:1, padding:16 }}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={()=>setTab('instant')} style={[styles.tab, tab==='instant'&&styles.tabActive]}><Text style={[styles.tabText, tab==='instant'&&styles.tabTextActive]}>Agora perto de mim</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>setTab('scheduled')} style={[styles.tab, tab==='scheduled'&&styles.tabActive]}><Text style={[styles.tabText, tab==='scheduled'&&styles.tabTextActive]}>Agendadas</Text></TouchableOpacity>
      </View>

      <View style={{ flexDirection:'row', marginBottom:8 }}>
        <TouchableOpacity onPress={()=>setShowMap(true)} style={[styles.toggle, showMap&&styles.toggleActive]}><Text style={[styles.toggleTxt, showMap&&styles.toggleTxtActive]}>Mapa</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>setShowMap(false)} style={[styles.toggle, !showMap&&styles.toggleActive]}><Text style={[styles.toggleTxt, !showMap&&styles.toggleTxtActive]}>Lista</Text></TouchableOpacity>
      </View>

      {showMap ? (
        <MapView style={{ width:'100%', height: Dimensions.get('window').height*0.35, borderRadius:12 }}
          initialRegion={{ latitude:-23.55, longitude:-46.63, latitudeDelta:0.2, longitudeDelta:0.2 }}>
          {meals.map(m => (m.lat && m.lng) ? (
            <Marker key={m.id} coordinate={{ latitude:m.lat, longitude:m.lng }} title={m.title} description={m.address_text} />
          ) : null)}
        </MapView>
      ) : null}

      {loading ? <Text>Carregando…</Text> : <FlatList data={meals} keyExtractor={i=>i.id} renderItem={Item} contentContainerStyle={{ paddingVertical:8 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs:{ flexDirection:'row', marginBottom:12 },
  tab:{ flex:1, padding:12, backgroundColor:'#e7eef9', borderRadius:12, marginRight:8 },
  tabActive:{ backgroundColor:'#1a4d8f' },
  tabText:{ textAlign:'center', color:'#1a4d8f', fontWeight:'600' },
  tabTextActive:{ color:'#fff' },
  toggle:{ flex:1, backgroundColor:'#e7eef9', padding:10, borderRadius:12, marginRight:8 },
  toggleActive:{ backgroundColor:'#1a4d8f' },
  toggleTxt:{ textAlign:'center', color:'#1a4d8f', fontWeight:'700' },
  toggleTxtActive:{ color:'#fff' },
  card:{ backgroundColor:'#fff', borderRadius:14, padding:14, marginTop:10, elevation:2 },
  title:{ fontSize:16, fontWeight:'700', color:'#1a4d8f' },
  desc:{ color:'#333', marginTop:4 },
  badge:{ marginTop:6, color:'#2ecc71', fontWeight:'700' },
});
