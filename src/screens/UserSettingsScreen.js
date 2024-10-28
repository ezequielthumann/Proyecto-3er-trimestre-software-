// UserSettings.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../config/FirebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { deleteUser } from 'firebase/auth';

export default function UserSettings({ navigation }) {
  const { user, logout, darkModeEnabled, toggleDarkMode } = useAuth();
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setName(userDoc.data().name);
          }
        }
      } catch (error) {
        console.error('Error al recuperar el nombre de usuario:', error);
      }
    };
    fetchUserData();
  }, [user]);

  const handleSaveChanges = async () => {
    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), { name });
        alert('Cambios guardados exitosamente');
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert('Has cerrado sesión exitosamente.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', user.uid));
              await deleteUser(user);
              await logout();
              alert('Cuenta eliminada exitosamente.');
              navigation.navigate('Login');
            } catch (error) {
              console.error('Error al eliminar la cuenta:', error);
              Alert.alert('Error', 'No se pudo eliminar la cuenta.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const dynamicStyles = darkModeEnabled ? styles.darkMode : styles.lightMode;

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Cuenta</Text>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            placeholder="Nombre"
            placeholderTextColor={darkModeEnabled ? '#888' : '#aaa'}
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Preferencias</Text>
          <View style={[styles.optionButton, dynamicStyles.optionButton]}>
            <Ionicons
              name="moon-outline"
              size={24}
              color={darkModeEnabled ? '#8B6A60' : '#000'}
            />
            <Text style={dynamicStyles.optionText}>
              {darkModeEnabled ? 'Modo Claro' : 'Modo Oscuro'}
            </Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={toggleDarkMode} // Usar toggleDarkMode de AuthContext
              thumbColor={darkModeEnabled ? '#8B6A60' : '#aaa'}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Eliminar Cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 40 },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#555',
    },
    input: {
      height: 40,
      paddingHorizontal: 10,
      borderRadius: 5,
      marginBottom: 10,
      borderWidth: 1,
    },
    saveButton: {
      backgroundColor: '#8B6A60',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    saveButtonText: { color: '#fff', fontWeight: 'bold' },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    logoutButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
      margin: 20,
    },
    deleteButton: {
      backgroundColor: '#c0392b',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
      margin: 20,
    },
    deleteButtonText: { color: '#fff', fontWeight: 'bold' },
    logoutButtonText: { color: '#fff', fontWeight: 'bold' },
    darkMode: {
      container: { backgroundColor: '#2D2D2D' },
      sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      optionText: { color: '#fff', fontSize: 16, marginLeft: 15, flex: 1 },
      input: { backgroundColor: '#3C3C3C', color: '#fff', borderColor: '#555' },
      optionButton: { backgroundColor: '#3C3C3C' },
    },
    lightMode: {
      container: { backgroundColor: '#fff' },
      sectionTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      optionText: { color: '#000', fontSize: 16, marginLeft: 15, flex: 1 },
      input: { backgroundColor: '#E0E0E0', color: '#000', borderColor: '#ccc' },
      optionButton: { backgroundColor: '#E0E0E0' },
    },
  });
