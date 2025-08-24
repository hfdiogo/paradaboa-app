import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './src/screens/LoginScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import CreateMealScreen from './src/screens/CreateMealScreen';
import MealDetailScreen from './src/screens/MealDetailScreen';
import ReservationSuccessScreen from './src/screens/ReservationSuccessScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Descobrir" component={DiscoverScreen} />
      <Tab.Screen name="Criar" component={CreateMealScreen} />
      <Tab.Screen name="Histórico" component={HistoryScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown:false }} />
        <Stack.Screen name="Home" component={Tabs} options={{ headerShown:false }} />
        <Stack.Screen name="Detalhe" component={MealDetailScreen} />
        <Stack.Screen name="ReservaOK" component={ReservationSuccessScreen} options={{ title: 'Reserva Confirmada' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
