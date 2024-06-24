import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';


const AddBookScreen = ({ navigation, route }) => {
  const getDetails = (type) => {
    if (route.params) {
      switch (type) {
        case '_id':
          return route.params._id;
        case 'title':
          return route.params.title;
        case 'genre':
          return route.params.genre;
        case 'year':
          return route.params.year;
        case 'picture':
          return route.params.picture;
      }
    }
    return '';
  };

// Create  
  const [title, setTitle] = useState(getDetails('title'));
  const [genre, setGenre] = useState(getDetails('genre'));
  const [year, setYear] = useState(getDetails('year'));
  const [picture, setPicture] = useState(getDetails('picture'));
  const [enableshift, setenableShift] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editBookId, setEditBookId] = useState(null);
  const [modal, setModal] = useState(false);

// Create
  const submitData = () => {
    fetch('http://192.168.0.195:3000/send-data', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        genre,
        year,
        picture,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
          setBooks([...books, data]);
          Alert.alert(`${data.title} foi cadastrado com sucesso!`);
          setTitle('');        // Clear title input
          setGenre('');        // Clear genre input
          setYear('');         // Clear year input
          setPicture('');      // Clear picture
      })
      .catch((err) => {
        Alert.alert('alguma coisas deu errado' + err);
      });
  };

// Read
const [books, setBooks] = useState([]);
  
  // Loading ...
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.0.195:3000/');
      const data = await response.json();
      setBooks(data);
      setLoading(false); // <- Atualiza o estado de loading
    } catch (error) {
      console.error(error);
      setLoading(false); // <- Atualiza o estado de loading em caso de erro
    }
  };
  fetchData();
}, []);

// Delete
const deleteBook = (id) => {
  fetch('http://192.168.0.195:3000/delete', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id
    })
  })
  .then(res => res.json())
  .then(deletedBook => {
    Alert.alert(`${deletedBook.title} foi deletado!`);
    setBooks(books.filter(book => book._id !== id)); // <- Atualiza a lista de livros
  })
  .catch(err => {
    Alert.alert('Algo deu errado ao deletar o livro.');
    console.error(err);
  });
};

// Update
const updateDetails = () => {
  fetch('http://192.168.0.195:3000/update', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: editBookId,
      title,
      genre,
      year,
      picture,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      Alert.alert(`${data.title} foi editado com sucesso!`);
      setBooks(books.map((book) => (book._id === data._id ? data : book)));
      setEditMode(false);  // Exit edit mode
      setEditBookId(null); // Clear edit book ID
      setTitle('');        // Clear title input
      setGenre('');        // Clear genre input
      setYear('');         // Clear year input
      setPicture('');      // Clear picture
    })
    .catch((err) => {
      Alert.alert('alguma coisa deu errado');
    });
};

const startEditBook = (book) => {
  setTitle(book.title);
  setGenre(book.genre);
  setYear(book.year);
  setPicture(book.picture);
  setEditMode(true);
  setEditBookId(book._id);
};

// Picture feature
const pickFromGallery = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.5,
  });
  if (!result.canceled) {
    const image = result.assets[0];
    let newfile = {
      uri: image.uri,
      type: `image/${image.uri.split('.').pop()}`,
      name: `image.${image.uri.split('.').pop()}`,
    };
    handleUpload(newfile);
  }
};

const pickFromCamera = async () => {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.5,
  });
  if (!result.canceled) {
    const image = result.assets[0];
    let newfile = {
      uri: image.uri,
      type: `image/${image.uri.split('.').pop()}`,
      name: `image.${image.uri.split('.').pop()}`,
    };
    handleUpload(newfile);
  }
};

const handleUpload = (image) => {
  const data = new FormData();
  data.append('file', {
    uri: image.uri,
    type: image.type,
    name: image.name,
  });
  data.append('upload_preset', 'bookswap');
  data.append('cloud_name', 'ddpc2zsdf');

  console.log('FormData:', data); // Adicione este log para verificar o FormData

  fetch('https://api.cloudinary.com/v1_1/ddpc2zsdf/image/upload', {
    method: 'POST',
    body: data,
  })
    .then((res) => {
      console.log('Response:', res); // Adicione este log para verificar a resposta
      return res.json();
    })
    .then((data) => {
      console.log('Upload successful:', data); // Adicione este log para verificar os dados da resposta
      setPicture(data.url);
      setModal(false);
    })
    .catch((err) => {
      console.error('Upload error:', err); // Adicione este log para verificar erros
      Alert.alert('Erro durante o upload', err.message);
    });
};

// Tela
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
      <Header navigation={navigation} />
        <TextInput
          label="Título do livro"
          style={styles.inputStyle}
          value={title}
          onFocus={() => setenableShift(false)}
          theme={theme}
          mode="outlined"
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          label="Gênero"
          style={styles.inputStyle}
          value={genre}
          theme={theme}
          onFocus={() => setenableShift(false)}
          mode="outlined"
          onChangeText={(text) => setGenre(text)}
        />
        <TextInput
          label="Ano de publicação"
          style={styles.inputStyle}
          value={year}
          theme={theme}
          onFocus={() => setenableShift(false)}
          keyboardType="number-pad"
          mode="outlined"
          onChangeText={(text) => setYear(text)}
        />
        <Button
          style={styles.button}
          icon={picture === '' ? 'upload' : 'check'}
          mode="contained"
          theme={theme}
          onPress={() => setModal(true)}
        >
          Upload de Imagem
        </Button>
        {editMode ? (
          <Button
            style={styles.button}
            icon="content-save"
            mode="contained"
            theme={theme}
            onPress={updateDetails}
          >
            Atualizar Detalhes
          </Button>
        ) : (
          <Button
            style={styles.button}
            icon="content-save"
            mode="contained"
            theme={theme}
            onPress={() => submitData()}
          >
            Salvar
          </Button>
        )}

<Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            setModal(false);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.modalButtonView}>
              <Button
                icon="camera"
                theme={theme}
                mode="contained"
                onPress={() => pickFromCamera()}
              >
                Câmera
              </Button>
              <Button
                icon="image-area"
                mode="contained"
                theme={theme}
                onPress={() => pickFromGallery()}
              >
                Galeria
              </Button>
            </View>
            <Button style={styles.cancelButton} theme={theme} onPress={() => setModal(false)}>
              Cancelar
            </Button>
          </View>
        </Modal>

        {loading ? (
  <Text>Carregando livros...</Text>
) : (
  books.length > 0 ? (
    <View>
      <Text style={styles.subtitle}>Meus Livros</Text>
    {books.map((book) => (
      <Card key={book._id} style={styles.mycard}>
        <View style={styles.cardContent}>
        <Image
                      source={{ uri: book.picture }}
                      style={styles.bookImage}
                    />
                    <View style={styles.cardText}>
                      <Text style={styles.textTitle}>{book.title}</Text>
                      <Text style={styles.text}>{book.genre}</Text>
                      <Text style={styles.text}>{book.year}</Text>
        </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
        <Button
                      icon="account-edit"
                      mode="contained"
                      theme={theme}
                      onPress={() => startEditBook(book)}
                    >
                      Editar
                    </Button>
                <Button
                    icon="delete"
                    mode="contained"
                    theme={theme}
                    onPress={() => deleteBook(book._id)}>
                    Deletar
                </Button>
            </View>
      </Card>
    ))}
  </View>
) : (
  <Text style={styles.subtitle}>Você ainda não adicionou livros.</Text>
)
)}
      </View>
    </ScrollView>
  );
};

const theme = {
  colors: {
    primary: '#c56648',
  },
};
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#c0a48c',
    padding: 20,
  },
  inputStyle: {
    margin: 5,
    backgroundColor: '#c0a48c',
  },
  button: {
    marginTop: 20,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 20,
    marginBottom: 20,
  },
  modalView: {
    position: 'absolute',
    bottom: 1,
    width: '100%',
    backgroundColor: 'white',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },
  modalButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginTop: 5,
  },
  cancelButton: {
    paddingBottom: 5,
  },
  mycard: {
    margin: 3,
    padding: 3
},
cardContent: {
    flexDirection: "row",
    padding: 8
},
bookImage: {
  width: 90,
  height: 120,
  padding: 5,
},
cardText: {
  flex: 1,
},
textTitle: {
  fontSize: 18,
  marginBottom: 8,
  marginLeft: 10,
  fontWeight: 'bold'
},
text: {
  fontSize: 16,
  marginBottom: 8,
  marginLeft: 10,
},
});

export default AddBookScreen;
