import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import PrimaryButton from '../components/PrimaryButton';
import { Api } from '../api';
import { API_BASE_URL } from '../config';

export default function CreateMealScreen() {
  const [mode, setMode] = useState('scheduled');
  const [title, setTitle] = useState('Arroz Carreteiro');
  const [description, setDescription] = useState('Arroz, feijão tropeiro, salada e farofa.');
  const [price, setPrice] = useState('22');
  const [qty, setQty] = useState('3');
  const [address, setAddress] = useState('Posto X – BR-101 Km 5, Cachoeirinha/RS');
  const [lat, setLat] = useState('-23.55');
  const [lng, setLng] = useState('-46.63');
  const [start, setStart] = useState('2025-08-20T12:00:00-03:00');
  const [end, setEnd] = useState('2025-08-20T12:40:00-03:00');
  const [photo, setPhoto] = useState(null);

  async function pickPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (res.canceled) return;
    const asset = res.assets[0];
    const ext = (asset.fileName || asset.uri || '').split('.').pop().toLowerCase();
    const contentType = (ext === 'png') ? 'image/png' : 'image/jpeg';
    const filename = `meal.${ext || 'jpg'}`;
    const presign = await fetch(`${API_BASE_URL}/upload/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, contentType })
    }).then(r => r.json());
    if (!presign?.url) { Alert.alert('Erro', 'Não foi possível obter URL de upload.'); return; }
    await FileSystem.uploadAsync(presign.url, asset.uri, {
      httpMethod: 'PUT', headers: { 'Content-Type': contentType }, uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    });
    setPhoto(presign.publicUrl || null);
  }

  async function publish() {
    try {
      const payload = {
        mode, title, description,
        price_cents: Math.round(parseFloat(price)*100),
        qty_total: parseInt(qty),
        address_text: address, lat: parseFloat(lat), lng: parseFloat(lng),
        geofence_radius_m: 3000, photo_url: photo,
        start_time: mode==='scheduled'? start : null,
        end_time: mode==='scheduled'? end : null,
      };
      const meal = await Api.createMeal(payload);
      Alert.alert('Publicado!', `Refeição: ${meal.title}`);
    } catch (e) { Alert.alert('Erro', e.message); }
  }

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={styles.h1}>Criar Refeição</Text>
      <TouchableOpacity onPress={pickPhoto} style={{ marginBottom: 10 }}>
        <View style={{ backgroundColor:'#e7eef9', padding:12, borderRadius:12 }}>
          <Text style={{ color:'#1a4d8f', fontWeight:'700' }}>{photo? 'Trocar foto' : 'Escolher foto do prato'}</Text>
        </View>
      </TouchableOpacity>
      {photo ? <Image source={{ uri: photo }} style={{ width:'100%', height:180, borderRadius:12, marginBottom:10 }} /> : null}

      <View style={styles.mode}>
        <TouchableOpacity onPress={()=>setMode('scheduled')} style={[styles.modeBtn, mode==='scheduled'&&styles.modeActive]}><Text style={[styles.modeTxt, mode==='scheduled'&&styles.modeTxtActive]}>Agendar ⏰</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>setMode('instant')} style={[styles.modeBtn, mode==='instant'&&styles.modeActive]}><Text style={[styles.modeTxt, mode==='instant'&&styles.modeTxtActive]}>Agora 🚀</Text></TouchableOpacity>
      </View>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Nome do prato" />
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Descrição detalhada" />
      <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Preço (R$)" keyboardType="decimal-pad" />
      <TextInput style={styles.input} value={qty} onChangeText={setQty} placeholder="Quantidade de porções" keyboardType="numeric" />

      <Text style={styles.label}>Endereço do local</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Posto – Rodovia Km, Cidade/UF" />
      <View style={{ flexDirection:'row', gap:8 }}>
        <TextInput style={[styles.input,{ flex:1 }]} value={lat} onChangeText={setLat} placeholder="lat" keyboardType="decimal-pad" />
        <TextInput style={[styles.input,{ flex:1 }]} value={lng} onChangeText={setLng} placeholder="lng" keyboardType="decimal-pad" />
      </View>

      {mode==='scheduled' && (<View>
        <Text style={styles.label}>Janela (horário)</Text>
        <TextInput style={styles.input} value={start} onChangeText={setStart} placeholder="Início ISO (2025-08-20T12:00:00-03:00)" />
        <TextInput style={styles.input} value={end} onChangeText={setEnd} placeholder="Fim ISO (2025-08-20T12:40:00-03:00)" />
      </View>)}

      <PrimaryButton title="Publicar Refeição" onPress={publish} />
    </View>
  );
}

const styles = StyleSheet.create({
  h1:{ fontSize:22, fontWeight:'800', color:'#1a4d8f', marginBottom:10 },
  mode:{ flexDirection:'row', marginBottom:12, gap:8 },
  modeBtn:{ flex:1, backgroundColor:'#e7eef9', padding:12, borderRadius:12 },
  modeActive:{ backgroundColor:'#1a4d8f' },
  modeTxt:{ textAlign:'center', color:'#1a4d8f', fontWeight:'700' },
  modeTxtActive:{ color:'#fff' },
  input:{ backgroundColor:'#fff', borderRadius:12, padding:12, marginBottom:10, borderColor:'#e5e7eb', borderWidth:1 },
  label:{ color:'#1a4d8f', fontWeight:'700', marginTop:6, marginBottom:4 },
});
