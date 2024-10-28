import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Modal, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc as firestoreDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import { useAuth } from '../contexts/AuthContext';

export default function AdminScreen({ navigation }) {
  const { user, darkModeEnabled, toggleDarkMode } = useAuth();
  const [temasList, setTemasList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [selectedTema, setSelectedTema] = useState(null);

  const fetchTemas = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'temas'));
      const temas = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const temaData = doc.data();
          let authorName = 'Usuario desconocido';

          if (temaData.author) {
            const authorRef = firestoreDoc(db, 'users', temaData.author);
            const authorSnap = await getDoc(authorRef);
            if (authorSnap.exists()) {
              authorName = authorSnap.data().name;
            }
          }

          return { ...temaData, id: doc.id, authorName };
        })
      );

      setTemasList(temas);
    } catch (error) {
      console.error('Error fetching temas: ', error);
    }
  };

  useEffect(() => {
    fetchTemas();
  }, []);

  const handleMoreOptions = (tema) => {
    setSelectedTema(tema);
    setModalVisible(true);
  };

  const confirmDeleteTema = async () => {
    try {
      await deleteDoc(firestoreDoc(db, 'temas', selectedTema.id));
      setTemasList((prevList) => prevList.filter((tema) => tema.id !== selectedTema.id));
      setConfirmDeleteModalVisible(false);
      setModalVisible(false);
    } catch (error) {
      console.error("Error deleting tema:", error);
    }
  };

  const resetTemas = () => {
    fetchTemas();  // Llama a la función para volver a obtener los datos de la base de datos
  };

  return (
    <View style={[styles.container, { backgroundColor: darkModeEnabled ? '#121212' : '#f8f8f8' }]}>
      
      {/* Botón para resetear temas */}
      <TouchableOpacity style={styles.resetButton} onPress={resetTemas}>
        <Text style={styles.resetButtonText}>Resetear Temas</Text>
      </TouchableOpacity>

      <ScrollView style={styles.temasContainer}>
        {temasList.map((tema) => (
          <View key={tema.id} style={styles.cardContainer}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: darkModeEnabled ? '#1E1E1E' : '#fff' }]}
              onPress={() => navigation.navigate('TemaScreen', { temaId: tema.id })}
            >
              <Text style={[styles.title, { color: darkModeEnabled ? '#fff' : '#333' }]}>{tema.title}</Text>
              <Text style={[styles.description, { color: darkModeEnabled ? '#ccc' : '#666' }]}>{tema.description}</Text>
              <Text style={[styles.author, { color: darkModeEnabled ? '#aaa' : '#888' }]}>Creado por: {tema.authorName}</Text>
              <Text style={[styles.date, { color: darkModeEnabled ? '#888' : '#aaa' }]}>{tema.createdAt?.toDate().toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moreOptionsButton}
              onPress={() => handleMoreOptions(tema)}
            >
              <Text style={[styles.moreOptionsText, { color: darkModeEnabled ? '#fff' : '#333' }]}>⋮</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal de opciones */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalView, { backgroundColor: darkModeEnabled ? '#333' : 'white' }]}>
          <Text style={[styles.modalText, { color: darkModeEnabled ? '#fff' : '#000' }]}>¿Qué deseas hacer?</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => console.log(`Reportando tema: ${selectedTema.title}`)}
          >
            <Text style={styles.buttonText}>Reportar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('EditTemaScreen', { temaId: selectedTema.id });
            }}
          >
            <Text style={styles.buttonText}>Modificar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setConfirmDeleteModalVisible(true)}
          >
            <Text style={styles.buttonText}>Borrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmDeleteModalVisible}
        onRequestClose={() => setConfirmDeleteModalVisible(false)}
      >
        <View style={[styles.modalView, { backgroundColor: darkModeEnabled ? '#333' : 'white' }]}>
          <Text style={[styles.modalText, { color: darkModeEnabled ? '#fff' : '#000' }]}>¿Estás seguro de que deseas eliminar este tema?</Text>
          <TouchableOpacity style={styles.button} onPress={confirmDeleteTema}>
            <Text style={styles.buttonText}>Sí, eliminar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setConfirmDeleteModalVisible(false)}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Botón de configuración */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('UserSettings')}
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  temasContainer: {
    marginTop: 20,
  },
  cardContainer: {
    position: 'relative',
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 5,
    fontSize: 15,
  },
  author: {
    marginTop: 10,
    fontSize: 14,
  },
  date: {
    marginTop: 5,
    fontSize: 12,
  },
  moreOptionsButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  moreOptionsText: {
    fontSize: 24,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
    marginVertical: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  settingsIcon: {
    fontSize: 24,
    color: 'white',
  },
  resetButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#FF5733', // Color del botón de reset
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
