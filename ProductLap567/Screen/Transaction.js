import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Appbar, IconButton } from 'react-native-paper';

const Transaction = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [transactionList, setTransactionList] = useState([]);

  const formatCurrencyVND = value => {
    if (typeof value !== 'number') {
      console.error('Invalid input. Please provide a number.');
      return '';
    }

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }

  const formatDate = dateString => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    return new Intl.DateTimeFormat('en-GB', options).format(
      new Date(dateString),
    );
  };

  const keyExtractor = item => item._id.toString();

  const Item = ({ eachTransaction, onPress }) => {
    return (
      <TouchableOpacity onPress={() => onPress(eachTransaction)}>
        <View
          style={{
            flexDirection: 'column',
            margin: 10,
            flexDirection: 'row',
          }}>
          <View style={{ left: 10, flex: 1, flexDirection: 'column' }}>
            <Text style={{ color: 'black', fontWeight: 'bold' }}>
              {eachTransaction?.id} - {formatDate(eachTransaction?.updatedAt)}
              {eachTransaction?.status === 'cancelled' ? ' - cancelled' : ''}
            </Text>

            {eachTransaction?.services?.map(service => (
              <Text style={{ color: 'black' }} key={service?._id}>
                {service?.name}
              </Text>
            ))}

            <Text>Customer: {eachTransaction?.customer?.name}</Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              margin: 10,
              flexDirection: 'row',
            }}>
            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 30 }}>
              {formatCurrencyVND(eachTransaction?.price)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <Item
      eachTransaction={item}
      onPress={() =>
        navigation.navigate('TransactionDetail', { paramKey: item._id })
      }
    />
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('data');
        if (value !== null) {
          setData(JSON.parse(value));

          const apiURL = `https://kami-backend-5rs0.onrender.com/transactions`;
          const token = JSON.parse(value).token;

          const axiosConfig = {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          };

          axios
            .get(apiURL, axiosConfig)
            .then(response => {
              setTransactionList(response.data);
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
        <Appbar.Content title="Transaction List" />
        <Appbar.Action icon="account-circle" />
      </Appbar.Header>
      <FlatList
        data={transactionList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
      <IconButton
        icon="plus-circle-outline"
        style={styles.floatingButton}
        onPress={() => {
          Alert.alert('Add transaction button');
        }}
      />
    </View>
  );
};

export default Transaction;

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

  header: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
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
    color: 'black',
    fontWeight: 'bold',
  },
});
