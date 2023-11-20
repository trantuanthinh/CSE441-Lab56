import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

const UpdateService = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [serviceList, setServiceList] = useState([])

    const [data, setData] = useState(null);

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
                            // console.log('Response: ', response.data);
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

    const handleEditing = (id, name, price) => {
        const apiURL = `https://kami-backend-5rs0.onrender.com/services/${id}`;
        const postData = { id: id._id, name: name, price: price };

        const token = data.token;

        const axiosConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        axios
            .put(apiURL, postData, axiosConfig)
            .then(response => {
                console.log('Success');
            })
            .catch(error => {
                Alert.alert('Failed:', error);
                console.log('Failed:', error);
            });
    };

    const getServiceIDByName = serviceName => {
        for (const service of serviceList) {
            if (service.name === serviceName) {
                return service._id;
            }
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Service Name *</Text>
            <TextInput
                style={styles.input}
                placeholder="Input a service name"
                onChangeText={text => setName(text)}
            />
            <Text style={styles.title}>Price *</Text>

            <TextInput style={styles.input} onChangeText={text => setPrice(text)} />

            <Button
                style={styles.button}
                title="Update"
                onPress={() => {
                    const id = getServiceIDByName(name);
                    handleEditing(id, name, price);
                }}
            />
        </View>
    );
}

export default UpdateService;

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

