import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import PrimaryButton from '../components/PrimaryButton';
import { auth, signInWithPhoneNumber, firebaseConfig } from '../firebase';
import { Api } from '../api';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('+55');
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [waking, setWaking] = useState(false);
  const recaptchaVerifier = useRef(null);

  async function sendCode() {
    try {
      setLoading(true);
      const c = await signInWithPhoneNumber(auth, phone, recaptchaVerifier.current);
      setConfirm(c);
      Alert.alert('Código enviado', 'Verifique o SMS e insira o código.');
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmCode() {
    try {
      setLoading(true);
      await confirm.confirm(otp);
      setWaking(true);
      try { await Api.ping(); } catch (e) {}
      setWaking(false);
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Erro', 'Código inválido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />
      <Text style={styles.title}>Parada Boa</Text>

      <TextInput placeholder="+55..." value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
      {!confirm ? (
        <PrimaryButton title={loading ? "Enviando..." : "Enviar código"} onPress={sendCode} />
      ) : (
        <View style={{ width:'100%' }}>
          <TextInput placeholder="Código (SMS)" value={otp} onChangeText={setOtp} keyboardType="number-pad" style={styles.input} />
          <PrimaryButton title={loading ? "Entrando..." : "Confirmar"} onPress={confirmCode} />
        </View>
      )}

      {waking && (
        <View style={{ alignItems:'center', marginTop:16 }}>
          <ActivityIndicator size="small" />
          <Text style={{ marginTop:8, color:'#555', textAlign:'center' }}>
            Acordando o servidor… isso pode levar até ~1 minuto na primeira vez.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', padding:20 },
  title:{ fontSize:24, fontWeight:'800', color:'#1a4d8f', marginBottom:10 },
  input:{ backgroundColor:'#fff', borderRadius:12, padding:12, marginBottom:10, borderColor:'#e5e7eb', borderWidth:1 }
});
