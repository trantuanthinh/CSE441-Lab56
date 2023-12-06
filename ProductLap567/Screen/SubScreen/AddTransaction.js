import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Dropdown } from 'react-native-element-dropdown';
import SimpleStepper from 'react-native-simple-stepper';

const AddTransaction = () => {
  const [customerList, setCustomerList] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  const [checkedState, setCheckedState] = useState([]);
  const [cost, setCost] = useState([]);

  const [customerIDAdding, setCustomerIDAdding] = useState(null);
  const [servicesAdding, setServicesAdding] = useState([]);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('data');
        if (value !== null) {
          setData(JSON.parse(value));

          const apiURLCustomer = `https://kami-backend-5rs0.onrender.com/customers`;
          const apiURLService = `https://kami-backend-5rs0.onrender.com/services/`;

          const token = JSON.parse(value)?.token;
          const axiosConfig = {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          };

          await axios
            .get(apiURLCustomer, axiosConfig)
            .then(response => {
              setCustomerList(response.data);
            })
            .catch(error => {
              console.log('Error: ', error);
            });

          await axios
            .get(apiURLService, axiosConfig)
            .then(response => {
              setServiceList(response.data);
            })
            .catch(error => {
              console.log('Error: ', error);
            });
        }
      } catch (error) {
        console.log("Error", error.message);
      }
    };

    fetchData();
  }, []);

  const handleAdding = async (customerIDAdding, servicesAdding) => {
    const apiURL = `https://kami-backend-5rs0.onrender.com/transactions/`;
    const postData = { customerId: customerIDAdding, services: servicesAdding };

    const token = data.token;

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(apiURL, postData, axiosConfig);
      Alert.alert('Success Adding');
      console.log(response.data);
      console.log(token);
    } catch (error) {
      console.log(token);
      Alert.alert('Failed:', error.message);
      console.log('Failed:', error);
    }
  };


  const handleCheckboxChange = (key, isChecked) => {
    setCheckedState(prevStates => ({
      ...prevStates,
      [key]: isChecked,
    }));
  };

  const updatePrice = (key, price, quantity) => {
    let sumPrice = price * quantity;
    cost?.forEach((each) => {
      if (each?._id === key) {
        each.cost = sumPrice;
      }
    });
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

  const calculateTotal = () => {
    let total = 0;
    Array.isArray(cost) && cost.map((each) => (total = total + each?.cost));
    return total;
  };

  const addService = (keyToAdd, quantity, customerId) => {
    setServicesAdding(prevServices => [
      ...prevServices,
      { _id: keyToAdd, quantity: quantity, customerId: customerId },
    ]);
  };

  const updateServiceById = (keyToUpdate, quantity) => {
    setServicesAdding((prevServices) =>
      prevServices?.map((service) =>
        service?._id === keyToUpdate ? { ...service, quantity } : service
      )
    );
  };

  const deleteService = (keyToDelete) => {
    const newData = servicesAdding.filter((service) => service._id !== keyToDelete);
    setServicesAdding(newData);
  };

  const addPrice = (keyToAdd, price, quantity) => {
    let sumPrice = price * quantity;
    setCost(prevStates => [
      ...prevStates,
      { _id: keyToAdd, cost: sumPrice }
    ]);
  }

  const deletePrice = (keyToDelete) => {
    const newData = cost.filter((eachCost) => eachCost._id !== keyToDelete);
    setCost(newData);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adding Transaction *</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={customerList}
        search
        maxHeight={300}
        labelField="name"
        valueField="name"
        placeholder="Select Customer"
        searchPlaceholder="Customer"
        onChange={item => {
          setCustomerIDAdding(item?._id);
        }}
      />

      {serviceList?.map(service => (
        <Fragment key={service?._id}>
          <BouncyCheckbox
            style={{ padding: 10 }}
            size={25}
            fillColor="green"
            unfillColor="#FFFFFF"
            text={service?.name}
            textStyle={{
              textDecorationLine: 'none',
            }}
            iconStyle={{ borderColor: 'green' }}
            innerIconStyle={{ borderWidth: 2 }}
            onPress={isChecked => {
              isChecked ? addService(service?._id, 1, data?._id) : deleteService(service?._id);
              isChecked ? addPrice(service?._id, service?.price, 1) : deletePrice(service?._id);
              handleCheckboxChange(service?._id, isChecked);
            }}
          />

          {checkedState[service?._id] && (
            <View style={styles.subContainer}>
              <View style={{ flex: 2 }}>
                <SimpleStepper
                  showText={true}
                  initialValue={1}
                  minimumValue={1}
                  stepValue={1}
                  valueChanged={value => {
                    updatePrice(service?._id, service?.price, value);
                    updateServiceById(service?._id, value);
                  }}
                />
                <Text style={styles.priceText}>
                  Price: {formatCurrencyVND(cost.find(each => each._id === service._id)?.cost || 0)}
                </Text>
              </View>

              <View style={{ flex: 2 }}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={customerList}
                  search
                  maxHeight={300}
                  labelField="name"
                  valueField="name"
                  placeholder="Executor"
                  searchPlaceholder="Customer"
                  value="Executor"
                />
              </View>
            </View>
          )}
        </Fragment>
      ))}

      <Button
        style={styles.button}
        title={`Add: (${formatCurrencyVND(calculateTotal())})`}
        onPress={() => [handleAdding(customerIDAdding, servicesAdding)]}
      />
    </View>
  );
};

export default AddTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    margin: 10,
  },

  subContainer: {
    justifyContent: 'space-between',
    alignContent: 'center',
    flexDirection: 'row',
    margin: 10,
  },

  priceText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 15,
  },

  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },

  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },

  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    fontSize: 16,
  },

  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
