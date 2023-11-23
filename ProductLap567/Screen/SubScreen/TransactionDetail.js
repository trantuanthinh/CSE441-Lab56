import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/vi';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import Menu, {
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

const TransactionDetail = ({ navigation, route }) => {
  const id = route.params.paramKey;
  const [transaction, setTransaction] = useState('');
  const [dateString, setDateString] = useState('');

  const { Popover } = renderers;

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('data');
        if (value !== null) {
          setData(JSON.parse(value));
          const apiURL = `https://kami-backend-5rs0.onrender.com/transactions/${id}`;
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
              setTransaction(response.data);
              setDateString(formatDate(response.data.createdAt));
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
  }, [id]);

  const showUpdatingAlert = () => {
    Alert.alert(
      'You just clicked at the update button',
      '** There are no updating function **',
    );
  };

  const showDeletingAlert = () => {
    Alert.alert(
      'You just clicked at the delete button',
      '** There are no deleting function **',
    );
  };

  const handleDeleting = () => {
    // const apiURL = `https://kami-backend-5rs0.onrender.com/services/${id}`;
    // const token = data.token;
    // console.log(token);
    // const axiosConfig = {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    // };

    // axios
    //   .delete(apiURL, axiosConfig)
    //   .then(response => {
    //     Alert.alert('Success:');
    //     console.log('Success');
    //   })
    //   .catch(error => {
    //     Alert.alert('Failed:', error);
    //     console.log('Failed:', error);
    //   });
  };

  const formatCurrencyVND = value => {
    if (typeof value !== 'number') {
      console.error('Invalid input. Please provide a number.');
      return '';
    }

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const formatDate = dateString => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    return new Intl.DateTimeFormat('en-GB', options).format(
      new Date(dateString),
    );
  };

  return (
    <View style={styles.container}>
      <Appbar>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Transaction Detail" />
        <Menu renderer={Popover} rendererProps={{ placement: 'bottom' }}>
          <MenuTrigger style={styles.menuTrigger}>
            <Button icon="dots-vertical" />
          </MenuTrigger>
          <MenuOptions style={styles.menuOptions}>
            <MenuOption onSelect={() => showUpdatingAlert()}>
              <Text style={styles.contentText}>Update!</Text>
            </MenuOption>
            <MenuOption onSelect={() => showDeletingAlert()}>
              <Text style={[styles.contentText, { color: 'red' }]}>Delete!</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </Appbar>

      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>General Information</Text>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={styles.text}>Transaction code: </Text>
              <Text style={styles.text}>Customer: </Text>
              <Text style={styles.text}>Creation time: </Text>
            </View>

            <View style={styles.innerContainer}>
              <Text style={styles.valueText}>{transaction?.id}</Text>
              <Text style={styles.valueText}>{transaction?.customer?.name}</Text>
              <Text style={styles.valueText}>
                {dateString}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Services List</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.innerContainer}>
              {transaction?.services?.map(service => (
                <Text style={styles.text} key={service?._id}>
                  {service?.name}
                </Text>
              ))}
            </View>

            <View style={{ flex: 0.5, marginLeft: 35 }}>
              {transaction?.services?.map(service => (
                <Text key={service?._id}>x{service?.quantity}</Text>
              ))}
            </View>

            <View style={styles.innerContainer}>
              {transaction?.services?.map(service => (
                <Text style={styles.valueText} key={service?._id}>
                  {formatCurrencyVND(service?.price)}
                </Text>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={styles.innerContainer}>
              <Text style={styles.text}>Total</Text>
            </View>
            <View style={styles.innerContainer}>
              <Text style={styles.valueText}>
                {formatCurrencyVND(transaction?.priceBeforePromotion)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Cost</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.innerContainer}>
              <Text style={styles.text}>Amount of money: </Text>
              <Text style={styles.text}>Discount: </Text>
              <View style={{ marginTop: 25, marginLeft: 15 }}>
                <Text
                  style={{ color: 'black', fontWeight: 'bold', fontSize: 15 }}>
                  Total:{' '}
                </Text>
              </View>
            </View>

            <View style={styles.innerContainer}>
              <Text style={styles.valueText}>
                {formatCurrencyVND(transaction?.priceBeforePromotion)}
              </Text>
              <Text style={styles.valueText}> - {formatCurrencyVND(transaction?.priceBeforePromotion - transaction?.price)}</Text>
              <View style={{ marginTop: 25, marginLeft: 15 }}>
                <Text
                  style={{ color: 'black', fontWeight: 'bold', fontSize: 15 }}>
                  {formatCurrencyVND(transaction?.price)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransactionDetail;

const styles = StyleSheet.create({
  title: {
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold',
  },

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

  innerContainer: { flex: 1 },

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
    fontWeight: 'bold',
  },

  valueText: {
    marginLeft: 50,
    color: 'black',
    fontWeight: 'bold',
  },
});
