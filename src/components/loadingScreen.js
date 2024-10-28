import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingScreen = ({ message = 'Cargando, por favor espera...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.message}>{message}</Text>
      <View style={styles.spinnerContainer}>
        <Text style={styles.loadingText}>Estamos preparándolo todo para ti...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1F1F', // Fondo más oscuro
    padding: 20,
  },
  message: {
    marginTop: 15,
    fontSize: 20,
    color: '#FFD700', // Color dorado
    fontWeight: 'bold',
  },
  spinnerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff', // Texto blanco
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoadingScreen;
