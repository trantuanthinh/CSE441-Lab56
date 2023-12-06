import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, IconButton } from 'react-native-paper';

const Customer = ({ navigation }) => {
  // const [data, setData] = useState(null);
  const [customerList, setCustomerList] = useState([]);

  const keyExtractor = item => item._id.toString();

  const Item = ({ eachData, onPress }) => {
    return (
      <TouchableOpacity onPress={() => onPress(eachData)}>
        <View
          style={{
            flexDirection: 'column',
            margin: 10,
            flexDirection: 'row',
          }}>
          <View style={{ left: 10, flex: 1, flexDirection: 'column' }}>
            <Text style={styles.text}>
              Customer: <Text style={{ color: 'black' }}>{eachData.name}</Text>
            </Text>
            <Text style={styles.text}>
              Phone: <Text style={{ color: 'black' }}>{eachData.phone}</Text>
            </Text>
            <Text style={styles.text}>
              Total Money:{' '}
              <Text style={{ color: 'red' }}>{eachData.totalSpent}₫</Text>
            </Text>
          </View>
          <View>
            <Button icon="chess-king" title="Delete"></Button>
            <Text
              style={{
                color: 'black',
              }}>
              Guest
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <Item
      eachData={item}
      onPress={() =>
        navigation.navigate('CustomerDetail', { paramKey: item._id })
      }
    />
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('data');
        if (value !== null) {

          const apiURL = `https://kami-backend-5rs0.onrender.com/customers`;
          const token = JSON.parse(value).token;

          const axiosConfig = {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          };

          await axios
            .get(apiURL, axiosConfig)
            .then(response => {
              setCustomerList(response.data);
            })
            .catch(error => {
              console.log('Error: ', error);
            });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: 'pink' }}>
        <Appbar.Content title="Customer List" />
        <Appbar.Action icon="account-circle" />
      </Appbar.Header>
      <FlatList
        data={customerList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <IconButton
        icon="plus-circle-outline"
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddCustomer')}
      />
    </View>
  );
};

export default Customer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },

  floatingButton: {
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '90%',
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 100,
  },

  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  text: {
    fontWeight: 'bold',
  },
});
