import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import PrimaryButton from '../components/PrimaryButton';
import { Api } from '../api';

export default function ReservationSuccessScreen({ route }) {
  const { reservation } = route.params || {};
  const [payment, setPayment] = useState(null);
  async function payPix(){ try{ const data = await Api.createPix(reservation.id); setPayment(data); } catch(e){ Alert.alert('Erro', e.message); } }
  useEffect(()=>{ payPix(); }, []);
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:16 }}>
      <Text style={styles.title}>Reserva criada!</Text>
      <Text style={styles.sub}>Apresente o código abaixo no momento da retirada.</Text>
      <View style={{ marginVertical:16 }}><QRCode value={reservation.pickup_code || 'PICKUP'} size={160} /></View>
      {!payment ? <PrimaryButton title="Gerar PIX" onPress={payPix} /> : (
        <View style={{ alignItems:'center' }}>
          <Text style={styles.pix}>PIX pronto. Use o QR abaixo:</Text>
          <View style={{ marginTop:12, backgroundColor:'#fff', padding:12, borderRadius:12 }}>
            <QRCode value={payment.copia_cola || 'PIX'} size={180} />
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({ title:{ fontSize:22, fontWeight:'800', color:'#1a4d8f' }, sub:{ color:'#333', marginTop:6 }, pix:{ color:'#16a34a', fontWeight:'700', marginTop:10 } });
