// screens/Penulis.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, TextInput, Modal, Text } from 'react-native-paper';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { database } from '../config/firebase';

const Penulis = () => {
  const [authors, setAuthors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAuthorName, setModalAuthorName] = useState('');
  const [modalAuthorEmail, setModalAuthorEmail] = useState('');
  const [modalAuthorId, setModalAuthorId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const authorsRef = ref(database, 'authors');
    onValue(authorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const authorList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setAuthors(authorList);
      } else {
        setAuthors([]);
      }
    });
  }, []);

  const handleAddAuthor = () => {
    if (modalAuthorName && modalAuthorEmail) {
      if (isEditing) {
        // Edit penulis
        const authorRef = ref(database, `authors/${modalAuthorId}`);
        set(authorRef, {
          name: modalAuthorName,
          email: modalAuthorEmail,
        });
      } else {
        // Tambah penulis
        const authorsRef = ref(database, 'authors');
        push(authorsRef, {
          name: modalAuthorName,
          email: modalAuthorEmail,
        });
      }

      // Reset state
      setModalVisible(false);
      setIsEditing(false);
      setModalAuthorName('');
      setModalAuthorEmail('');
      setModalAuthorId('');
    }
  };

  const handleDeleteAuthor = (id) => {
    const authorRef = ref(database, `authors/${id}`);
    remove(authorRef);
  };

  const handleEditAuthor = (author) => {
    setModalAuthorName(author.name);
    setModalAuthorEmail(author.email);
    setModalAuthorId(author.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setModalAuthorName('');
    setModalAuthorEmail('');
    setModalAuthorId('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Writer List</Text>
      <FlatList
        data={authors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.email}</Text>
            <Button
              icon="pencil"
              mode="outlined"
              onPress={() => handleEditAuthor(item)}
              style={styles.cardButton}
            >
              Edit
            </Button>
            <Button
              icon="delete"
              mode="outlined"
              onPress={() => handleDeleteAuthor(item.id)}
              style={styles.cardButton}
            >
              Delete
            </Button>
          </View>
        )}
      />
      <Button
        icon="plus"
        mode="contained"
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        Add Writer
      </Button>

      {/* Modal for Add/Edit Author */}
      <Modal visible={modalVisible} onDismiss={handleCloseModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Tambah Penulis</Text>
          <TextInput
            label="Nama Penulis"
            value={modalAuthorName}
            onChangeText={(text) => setModalAuthorName(text)}
            style={styles.input}
          />
          <TextInput
            label="Email Penulis"
            value={modalAuthorEmail}
            onChangeText={(text) => setModalAuthorEmail(text)}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAddAuthor} style={styles.modalButton}>
            Simpan
          </Button>
          <Button mode="outlined" onPress={handleCloseModal} style={styles.modalButton}>
            Batal
          </Button>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginVertical: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  cardButton: {
    marginTop: 8,
  },
  addButton: {
    marginTop: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default Penulis;
