import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

const Login = ({ navigation }) => {
  const [phone, setPhone] = useState('0373007856');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);

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
        navigation.replace('Main');
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          onChangeText={text => setPassword(text)}
        />
        <IconButton
          icon={showPassword ? 'eye-off' : 'eye'}
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>


      <Button
        style={styles.button}
        title="Login"
        onPress={() => handleLogin(phone, password)}>
        <Text style={styles.text}>Login</Text>
      </Button>

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

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  text: {
    color: 'black',
    fontSize: 20,
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
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'lightblue',
    height: 50,
    width: '80%',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
});
