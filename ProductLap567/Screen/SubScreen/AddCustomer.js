import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

const AddCustomer = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [data, setData] = useState(null);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('data');
      if (value !== null) {
        setData(JSON.parse(value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAdding = async (name, phone) => {
    const apiURL = `https://kami-backend-5rs0.onrender.com/customers`;
    const postData = { name: name, phone: phone };

    const token = data.token;

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    axios
      .post(apiURL, postData, axiosConfig)
      .then(response => {
        Alert.alert('Success');
        console.log(response.data);
        console.log(token);
      })
      .catch(error => {
        console.log(token);
        Alert.alert('Failed:', error);
        console.log('Failed:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Input a service name"
        onChangeText={text => setName(text)}
      />
      <Text style={styles.title}>Phone *</Text>

      <TextInput style={styles.input} onChangeText={text => setPhone(text)} />
      <Button
        style={styles.button}
        title="Add"
        onPress={() => handleAdding(name, phone)}
      />
    </View>
  );
};

export default AddCustomer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    margin: 10,
  },

  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },

  input: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
  },

  button: {
    width: '80%',
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'green',
  },
});
