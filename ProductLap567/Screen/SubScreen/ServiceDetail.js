import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import Menu, {
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

const ServiceDetail = ({ navigation, route }) => {
  const id = route.params.paramKey;
  const [service, setService] = useState('');

  const { Popover } = renderers;

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('data');
        if (value !== null) {
          setData(JSON.parse(value));
          const apiURL = `https://kami-backend-5rs0.onrender.com/services/${id}`;
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
              setService(response.data);
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

  const showAlert = () => {
    Alert.alert(
      'Confirmation',
      'Do you want to delete?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDeleting,
        },
      ],
      { cancelable: false },
    );
  };

  const handleDeleting = () => {
    const apiURL = `https://kami-backend-5rs0.onrender.com/services/${id}`;
    const token = data.token;
    console.log(token);
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    axios
      .delete(apiURL, axiosConfig)
      .then(response => {
        Alert.alert('Success:');
        console.log('Success');
      })
      .catch(error => {
        Alert.alert('Failed:', error);
        console.log('Failed:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Appbar>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title='Service Detail' />
        <Menu renderer={Popover} rendererProps={{ placement: 'bottom' }}>
          <MenuTrigger style={styles.menuTrigger}>
            <Button icon="dots-vertical" />
          </MenuTrigger>
          <MenuOptions style={styles.menuOptions}>
            <MenuOption onSelect={() => navigation.navigate('UpdateService')}>
              <Text style={styles.contentText}>Update!</Text>
            </MenuOption>
            <MenuOption onSelect={() => showAlert()}>
              <Text style={[styles.contentText, { color: 'red' }]}>
                Delete!
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </Appbar>

      <Text style={styles.text}>Service name: {service?.name}</Text>
      <Text style={styles.text}>Price: {service?.price}</Text>
      <Text style={styles.text}>Creator: {service?.user?.name}</Text>
      <Text style={styles.text}>Time: {service?.createdAt}</Text>
      <Text style={styles.text}>Final Update: {service?.updatedAt}</Text>
    </View>
  );
};

export default ServiceDetail;

const styles = StyleSheet.create({
  menuOptions: {
    paddingLeft: 20,
    paddingRight: 20,
  },

  menuTrigger: {
    padding: 5,
  },

  contentText: {
    fontSize: 18,
  },

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
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
});
