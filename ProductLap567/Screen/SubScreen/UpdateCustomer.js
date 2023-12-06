import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

const UpdateCustomer = ({ navigation, route }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [customerList, setCustomerList] = useState([]);

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const value = await AsyncStorage.getItem('data');
                if (value !== null) {
                    setData(JSON.parse(value));
                    const apiURL = `https://kami-backend-5rs0.onrender.com/Customers/`;
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
                            console.log(response.data);
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

    const handleEditing = async (id, name, phone) => {
        const apiURL = `https://kami-backend-5rs0.onrender.com/Customers/${id}`;
        const postData = { name: name, phone: phone };
        const token = data.token;
        const axiosConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        await axios
            .put(apiURL, postData, axiosConfig)
            .then(response => {
                Alert.alert('Success');
                console.log('Success');
            })
            .catch(error => {
                Alert.alert('Failed:', error);
                console.log('Failed:', error);
            });
    };

    const getCustomerIDByName = customerName => {
        for (const customer of customerList) {
            if (customer.name === customerName) {
                return customer._id;
            }
        }
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
                title="Update"
                onPress={() => {
                    const id = getCustomerIDByName(name);
                    handleEditing(id, name, phone);
                }}
            />
        </View>
    );
};

export default UpdateCustomer;

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
