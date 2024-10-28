import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import { useAuth } from '../contexts/AuthContext';

export default function EditTemaScreen({ route, navigation }) {
  const { temaId } = route.params; // Recibir el ID del tema desde los parámetros de navegación
  const { darkModeEnabled } = useAuth(); // Obtener el estado del modo oscuro
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchTemaData = async () => {
      try {
        const docRef = doc(db, 'temas', temaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const temaData = docSnap.data();
          setTitle(temaData.title || '');
          setDescription(temaData.description || '');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error al obtener los datos del tema:', error);
      }
    };

    fetchTemaData();
  }, [temaId]);

  const handleSaveTema = async () => {
    if (title.trim() && description.trim()) {
      try {
        const docRef = doc(db, 'temas', temaId);
        await updateDoc(docRef, {
          title,
          description,
        });
        navigation.goBack(); // Volver a la pantalla anterior después de guardar
      } catch (error) {
        console.error('Error al actualizar el tema:', error);
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

      <Button title="Guardar" onPress={handleSaveTema} color={darkModeEnabled ? '#fff' : '#2196F3'} />
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
