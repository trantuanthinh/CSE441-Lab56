import axios from 'axios';
import React from 'react';
import {Button, SafeAreaView, StyleSheet, Text, TextInput} from 'react-native';

const ServiceDetail = () => {
  const getServiceDetail = id => {
    const apiURL = 'https://kami-backend-5rs0.onrender.com/services';
    axios
      .get(apiURL)
      .then(response => {
        console.log('Response: ', response.data);
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Service name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Input a service name"
        onChangeText={text => setName(text)}
      />
      <Text style={styles.title}>Price *</Text>
      <TextInput
        style={styles.input}
        placeholder="Price"
        onChangeText={text => setPrice(text)}
      />
      <Button
        style={styles.button}
        title="Add"
        onPress={handleAdding(name, price)}
      />
    </SafeAreaView>
  );
};

export default ServiceDetail;

const styles = StyleSheet.create({});
