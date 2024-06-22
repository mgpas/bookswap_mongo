import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
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
      }
    }
    return '';
  };

// Create  
  const [title, setTitle] = useState(getDetails('title'));
  const [genre, setGenre] = useState(getDetails('genre'));
  const [year, setYear] = useState(getDetails('year'));
  const [enableshift, setenableShift] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editBookId, setEditBookId] = useState(null);


  const submitData = () => {
    fetch('http://192.168.100.9:3000/send-data', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        genre,
        year,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
          setBooks([...books, data]);
          Alert.alert(`${data.title} foi cadastrado com sucesso!`);
      })
      .catch((err) => {
        Alert.alert('alguma coisas deu errado' + err);
      });
  };

// Read
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.100.9:3000/');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [books]);
  
// Loading ...
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.100.9:3000/');
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
  fetch('http://192.168.100.9:3000/delete', {
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
  fetch('http://192.168.100.9:3000/update', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: editBookId,
      title,
      genre,
      year,
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
    })
    .catch((err) => {
      Alert.alert('alguma coisa deu errado');
    });
};

const startEditBook = (book) => {
  setTitle(book.title);
  setGenre(book.genre);
  setYear(book.year);
  setEditMode(true);
  setEditBookId(book._id);
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
        {loading ? (
  <Text>Carregando livros...</Text>
) : (
  books.length > 0 ? (
    <View>
      <Text style={styles.subtitle}>Meus Livros</Text>
    {books.map((book) => (
      <Card key={book._id} style={styles.mycard}>
        <View style={styles.cardContent}>
          <Text style={styles.mytext}>{book.title}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.mytext}>{book.genre}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.mytext}>{book.year}</Text>
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
  <Text style={styles.subtitle}>Você ainda não adicionou livros</Text>
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
  mycard: {
    margin: 3
},
cardContent: {
    flexDirection: "row",
    padding: 8
},
mytext: {
    fontSize: 18,
    marginTop: 3,
    marginLeft: 5
}
});

export default AddBookScreen;
