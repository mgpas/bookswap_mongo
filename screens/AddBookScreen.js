import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Header from '../components/Header';


const AddBookScreen = ({ navigation, route }) => {
  const getDetails = (type) => {
    if (route.params) {
      switch (type) {
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

  const [title, setTitle] = useState(getDetails('title'));
  const [genre, setGenre] = useState(getDetails('genre'));
  const [year, setYear] = useState(getDetails('year'));
  const [enableshift, setenableShift] = useState(false);

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
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${data.title} foi cadastrado com sucesso!`);
        navigation.navigate('Home');
      })
      .catch((err) => {
        Alert.alert('alguma coisas deu errado' + err);
      });
  };

  const updateDetails = () => {
    fetch('192.168.0.195:3000/update', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: route.params._id,
        title,
        genre,
        year,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${data.title} foi editado com sucesso!`);
        navigation.navigate('Home');
      })
      .catch((err) => {
        Alert.alert('alguma coisa deu errado');
      });
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={styles.root}
      enabled={enableshift}
    >
      <Header navigation={navigation} />
      <View style={styles.container}>
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
        {route.params ? (
          <Button
            style={styles.inputStyle}
            icon="content-save"
            mode="contained"
            theme={theme}
            onPress={() => updateDetails()}
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
      </View>
    </KeyboardAvoidingView>
  );
};

const theme = {
  colors: {
    primary: '#c56648',
  },
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#c0a48c',
    padding: 20,
  },
  container: {
    paddingTop: 20,
  },
  inputStyle: {
    margin: 5,
    backgroundColor: '#c0a48c',
  },
  button: {
    marginTop: 20,
  }

});

export default AddBookScreen;
