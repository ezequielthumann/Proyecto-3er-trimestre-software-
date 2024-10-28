import React from 'react';
import { Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from './src/core/theme';
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  UserSettings,
  TemasScreen,
  AdminScreen,
  TemaScreen, 
  CrearTemaScreen,
  EditTemaScreen
} from './src/screens';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

const Stack = createStackNavigator();

function AppStack() {
  const { user, loading } = useAuth();

  if (loading) return <Text>Loading...</Text>;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user.email === 'admin@gmail.com' ? (
          // Rutas para el administrador, incluyendo AdminScreen y pantallas de temas
          <>
            <Stack.Screen name="AdminScreen" component={AdminScreen} />
            <Stack.Screen name="TemasScreen" component={TemasScreen} />
            <Stack.Screen name="TemaScreen" component={TemaScreen} />
            <Stack.Screen name="CrearTemaScreen" component={CrearTemaScreen} /> 
            <Stack.Screen name="EditTemaScreen" component={EditTemaScreen} />
            <Stack.Screen name="UserSettings" component={UserSettings} />
          </>
        ) : (
          // Rutas para usuarios normales
          <>
            <Stack.Screen name="TemasScreen" component={TemasScreen} />
            <Stack.Screen name="TemaScreen" component={TemaScreen} />
            <Stack.Screen name="CrearTemaScreen" component={CrearTemaScreen} /> 
            <Stack.Screen name="EditTemaScreen" component={EditTemaScreen} />
            <Stack.Screen name="UserSettings" component={UserSettings} />
          </>
        )
      ) : (
        // Rutas para usuarios no autenticados
        <>
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
