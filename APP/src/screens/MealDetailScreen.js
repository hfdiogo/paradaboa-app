import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Api } from '../api';
import PrimaryButton from '../components/PrimaryButton';

export default function MealDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [meal, setMeal] = useState(null);
  const [beverage, setBeverage] = useState('suco');
  const [mode, setMode] = useState('pickup');
  const [qty, setQty] = useState(1);

  useEffect(()=>{ (async()=>{ setMeal(await Api.getMeal(id)); })(); }, [id]);

  async function reserve(){
    try{ const res = await Api.createReservation({ meal_id:id, qty, beverage, mode }); navigation.replace('ReservaOK',{ reservation: res }); }
    catch(e){ Alert.alert('Erro', e.message); }
  }

  if(!meal) return <View style={{ padding:16 }}><Text>Carregando…</Text></View>;

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={styles.title}>{meal.title}</Text>
      <Text style={styles.price}>R$ {(meal.price_cents/100).toFixed(2)}</Text>
      <Text style={styles.addr}>{meal.address_text}</Text>
      <Text style={styles.desc}>{meal.description}</Text>

      <Text style={styles.section}>Bebida</Text>
      <View style={styles.row}>{['suco','refrigerante','agua','agua_gas'].map(b => (
        <TouchableOpacity key={b} onPress={()=>setBeverage(b)} style={[styles.chip, beverage===b && styles.chipActive]}>
          <Text style={[styles.chipTxt, beverage===b && styles.chipTxtActive]}>{b}</Text>
        </TouchableOpacity>
      ))}</View>

      <Text style={styles.section}>Como prefere?</Text>
      <View style={styles.row}>{['pickup','social'].map(m => (
        <TouchableOpacity key={m} onPress={()=>setMode(m)} style={[styles.chip, mode===m && styles.chipActive]}>
          <Text style={[styles.chipTxt, mode===m && styles.chipTxtActive]}>{m==='pickup'?'Retirada':'Comer junto'}</Text>
        </TouchableOpacity>
      ))}</View>

      <PrimaryButton title="Reservar" onPress={reserve} />
    </View>
  );
}

const styles = StyleSheet.create({
  title:{ fontSize:22, fontWeight:'800', color:'#1a4d8f' },
  price:{ fontSize:18, fontWeight:'700', color:'#16a34a', marginTop:4 },
  addr:{ color:'#555', marginVertical:6 },
  desc:{ color:'#333', marginBottom:12 },
  section:{ marginTop:8, fontWeight:'700', color:'#1a4d8f' },
  row:{ flexDirection:'row', flexWrap:'wrap', gap:8, marginVertical:8 },
  chip:{ paddingVertical:8, paddingHorizontal:12, borderRadius:999, borderWidth:1, borderColor:'#1a4d8f' },
  chipActive:{ backgroundColor:'#1a4d8f' },
  chipTxt:{ color:'#1a4d8f' },
  chipTxtActive:{ color:'#fff' },
});
