import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const Login = ({ navigation }) => {
  const [phone, setPhone] = useState('0373007856');
  const [password, setPassword] = useState('123');

  const handleLogin = (phone, password) => {
    const apiURL = `https://kami-backend-5rs0.onrender.com/auth`;
    const postData = { phone: phone, password: password };

    axios
      .post(apiURL, postData)
      .then(response => {
        // console.log(response.data);
        // console.log(phone);
        // console.log(password);
        AsyncStorage.setItem('data', JSON.stringify(response.data));
        navigation.navigate('SubScreenNavigator');
      })
      .catch(error => {
        // console.log(phone);
        // console.log(password);
        console.log('Login failed:', error);
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={text => setPhone(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />

      <Button
        style={styles.button}
        title="Login"
        onPress={() => handleLogin(phone, password)}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    textAlign: 'center',
    fontSize: 30,
    color: 'green',
    fontWeight: 'bold',
  },

  input: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  button: {
    height: 50,
    width: '80%',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
});
