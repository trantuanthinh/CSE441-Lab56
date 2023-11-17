import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Home = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [serviceList, setServiceList] = useState([]);

  const keyExtractor = item => item._id.toString();

  const Item = ({ eachData, onPress }) => {
    return (
      <TouchableOpacity onPress={() => onPress(eachData)}>
        <View style={styles.item}>
          <View style={{ left: 10, flex: 1 }}>
            <Text style={styles.text}>Title: {eachData.name}</Text>
          </View>
          <View style={{ left: 10, flex: 1, justifyContent: 'flex-end' }}>
            <Text style={styles.text}>Price: {eachData.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <Item
      eachData={item}
      onPress={() => navigation.navigate('ServiceDetail', { paramKey: item._id })}
    />
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('data');
        if (value !== null) {
          setData(JSON.parse(value));

          const apiURL = `https://kami-backend-5rs0.onrender.com/services/`;
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
              setServiceList(response.data);
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
      <FlatList
        data={serviceList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
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
