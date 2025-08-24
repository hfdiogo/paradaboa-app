import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
export default function PrimaryButton({ title, onPress, style }) {
  return (<TouchableOpacity style={[styles.btn, style]} onPress={onPress}><Text style={styles.txt}>{title}</Text></TouchableOpacity>);
}
const styles = StyleSheet.create({ btn:{ backgroundColor:'#1a4d8f', paddingVertical:14, borderRadius:14, alignItems:'center' }, txt:{ color:'#fff', fontWeight:'600', fontSize:16 } });
