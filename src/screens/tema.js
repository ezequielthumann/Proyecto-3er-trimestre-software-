import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { doc as firestoreDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import { useAuth } from '../contexts/AuthContext'; // Importa el contexto de autenticación

export default function TemaScreen({ navigation, route }) {
  const { temaId } = route.params;
  const { user, darkModeEnabled } = useAuth(); // Obtenemos el usuario logueado y el estado del modo oscuro
  const [tema, setTema] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchTema = async () => {
      const docRef = firestoreDoc(db, 'temas', temaId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const temaData = { ...docSnap.data(), id: docSnap.id };
        setTema(temaData);
      } else {
        console.log("No existe tal documento!");
      }
    };

    const commentsRef = collection(db, 'temas', temaId, 'comentarios');
    const commentsQuery = query(commentsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => {
        const commentData = doc.data();
        return {
          id: doc.id,
          commentText: commentData.commentText,
          createdAt: commentData.createdAt?.toDate().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }),
          author: commentData.author, // Guardar el ID del autor
        };
      });
      setComments(commentsData);
    });

    fetchTema();

    return () => unsubscribe();
  }, [temaId]);

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      const commentsRef = collection(db, 'temas', temaId, 'comentarios');
      await addDoc(commentsRef, {
        author: user?.uid,
        commentText,
        createdAt: serverTimestamp(),
      });
      setCommentText(''); // Limpiar el campo después de enviar el comentario
    }
  };

  if (!tema) {
    return (
      <View style={styles.loading}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, darkModeEnabled && styles.darkContainer]}>
      <Text style={[styles.title, darkModeEnabled && styles.darkTitle]}>{tema.title}</Text>
      <Text style={[styles.description, darkModeEnabled && styles.darkText]}>{tema.description}</Text>
      <Text style={[styles.author, darkModeEnabled && styles.darkText]}>Creado por: {tema.author}</Text>
      <Text style={[styles.date, darkModeEnabled && styles.darkText]}>Fecha: {tema.createdAt?.toDate().toLocaleDateString()}</Text>

      <Text style={[styles.commentsTitle, darkModeEnabled && styles.darkText]}>Comentarios:</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.comment, darkModeEnabled && styles.darkComment]}>
            <Text style={styles.commentAuthor}>{item.author}</Text>
            <Text>{item.commentText}</Text>
            <Text style={styles.commentDate}>{item.createdAt}</Text>
          </View>
        )}
      />

      <TextInput
        style={[styles.input, darkModeEnabled && styles.darkInput]}
        placeholder="Escribe tu comentario..."
        placeholderTextColor={darkModeEnabled ? '#ccc' : '#999'} // Cambiar el color del placeholder
        value={commentText}
        onChangeText={setCommentText}
      />
      <Button title="Enviar comentario" onPress={handleCommentSubmit} color={darkModeEnabled ? '#fff' : '#2196F3'} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  darkTitle: {
    color: '#fff',
  },
  description: {
    marginTop: 10,
    fontSize: 16,
  },
  darkText: {
    color: '#fff',
  },
  author: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },
  date: {
    marginTop: 5,
    fontSize: 12,
    color: '#aaa',
  },
  commentsTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  comment: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  darkComment: {
    backgroundColor: '#444',
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  darkInput: {
    borderColor: '#444',
    backgroundColor: '#333',
    color: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
