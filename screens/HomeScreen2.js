// HomeScreen2.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, Platform, Alert, useEffect } from 'react-native';
import userInfo from '../userInfo'; // Importe o objeto userInfo do arquivo userInfo.js
import reviewInfo from '../reviewInfo';
import Header from '../components/Header';
import { Card } from 'react-native-paper';

const HomeScreen2 = ({ navigation, props }) => {
    const { _id, title, genre, year } = props.route.params.item
    const deleteBook = () => {
        fetch("http://192.168.0.195:3000/delete", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: _id
            })
        })
            .then(res => res.json())
            .then(deletedBook => {
                Alert.alert(`${deletedBook.title} foi deletado!`)
                props.navigation.navigate("Home")
            })
            .catch(err => {
                Alert.alert("alguma coisa deu errado")
            })
    }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
      <Header navigation={navigation}/>
      <View style={styles.cards}>
        <Image source={require('../assets/profile_image.png.jpg')} style={styles.profileImage} />
        <Text style={styles.title}>{userInfo.name}</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Email: {userInfo.email}</Text>
          <Text style={styles.userInfoText}>Idade: {userInfo.age}</Text>
          <Text style={styles.userInfoText}>Cidade: {userInfo.city}</Text>
          <Text style={styles.userInfoText}>País: {userInfo.country}</Text>
          <Text style={styles.userInfoText}>Gênero Favorito: {userInfo.favoriteGenre}</Text>
        </View>
        <Text style={styles.subtitle}>Avaliações</Text>
      {reviewInfo.map((review) => (
        <View key={review.nome} style={styles.reviewInfo}>
          <Text style={styles.reviewInfoText}>{review.nome}</Text>
          <Text style={styles.reviewInfoText}>Nota: {review.nota_da_troca}</Text>
          <Text style={styles.reviewInfoText}>{review.comentario}</Text>
        </View>
      ))}
      <Card style={styles.mycard}>
                <View style={styles.cardContent}>
                    <Text style={styles.mytext}>{title}</Text>
                    <Text style={styles.mytext}>{genre}</Text>
                    <Text style={styles.mytext}>{year}</Text>
                </View>
            </Card>
            <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
                <Button
                    icon="account-edit"
                    mode="contained"
                    theme={theme}
                    onPress={() => {
                        props.navigation.navigate("Create",
                            { _id, title, genre, year }
                        )
                    }}>
                    Editar
                </Button>
                <Button
                    icon="delete"
                    mode="contained"
                    theme={theme}
                    onPress={() => deleteBook()}>
                    Deletar
                </Button>
            </View>
    </View>
        </View>
    </ScrollView>
  );
};

const theme = {
  colors: {
    primary: '#006aff',
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
  cards: {
    alignItems: 'center',
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  profileImage: {
    paddingTop: 25,
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 25,
  },
  userInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  reviewInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  reviewInfoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
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

export default HomeScreen2;