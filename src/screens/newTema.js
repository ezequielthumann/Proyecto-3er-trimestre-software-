import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import { useAuth } from '../contexts/AuthContext';

export default function NuevoTemaScreen({ navigation }) {
  const { user, darkModeEnabled } = useAuth(); // Obtener el usuario actual y el estado del modo oscuro
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateTema = async () => {
    if (title.trim() && description.trim()) {
      try {
        // Añadir el nuevo tema a la colección 'temas' en Firestore
        await addDoc(collection(db, 'temas'), {
          title,
          description,
          author: user?.uid, // Guardar el ID del usuario actual
          createdAt: serverTimestamp(),
        });
        
        // Navegar de regreso a la pantalla principal o de temas
        navigation.goBack();
      } catch (error) {
        console.error('Error al crear el tema:', error);
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  return (
    <View style={[styles.container, darkModeEnabled && styles.darkContainer]}>
      <Text style={[styles.label, darkModeEnabled && styles.darkLabel]}>Título</Text>
      <TextInput
        style={[styles.input, darkModeEnabled && styles.darkInput]}
        placeholder="Ingresa el título del tema"
        placeholderTextColor={darkModeEnabled ? '#ccc' : '#999'} // Cambiar el color del placeholder
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, darkModeEnabled && styles.darkLabel]}>Descripción</Text>
      <TextInput
        style={[styles.input, darkModeEnabled && styles.darkInput]}
        placeholder="Ingresa la descripción del tema"
        placeholderTextColor={darkModeEnabled ? '#ccc' : '#999'} // Cambiar el color del placeholder
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title="Crear Tema" onPress={handleCreateTema} color={darkModeEnabled ? '#fff' : '#2196F3'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  darkLabel: {
    color: '#fff',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  darkInput: {
    borderColor: '#444',
    backgroundColor: '#333',
    color: '#fff',
  },
});
