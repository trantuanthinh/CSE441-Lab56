import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/vi';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import Menu, {
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';

const CustomerDetail = ({ navigation, route }) => {
    const id = route.params.paramKey;
    const [customer, setCustomer] = useState('');
    const [transaction, setTransaction] = useState('');

    const { Popover } = renderers;

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const value = await AsyncStorage.getItem('data');
                if (value !== null) {
                    setData(JSON.parse(value));
                    const apiURL = `https://kami-backend-5rs0.onrender.com/Customers/${id}`;
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
                            setCustomer(response.data);
                            setTransaction(response.data.transactions);
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

    const showDeletingAlert = () => {
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

    const handleDeleting = async () => {
        const apiURL = `https://kami-backend-5rs0.onrender.com/Customers/${id}`;
        const token = data.token;
        console.log(token);
        const axiosConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        await axios
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

    const keyExtractor = item => item._id.toString();

    const Item = ({ eachTransaction }) => {
        return (
            <View
                style={{
                    flexDirection: 'column',
                    margin: 10,
                    flexDirection: 'row',
                }}>
                <View style={{ left: 10, flex: 1, flexDirection: 'column' }}>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>
                        {eachTransaction?.id} - {formatDate(eachTransaction?.updatedAt)}
                    </Text>

                    {eachTransaction?.services?.map(service => (
                        <Text style={{ color: 'black' }} key={service?._id}>
                            {service?.name}
                        </Text>
                    ))}
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
        );
    };

    const renderItem = ({ item }) => <Item eachTransaction={item} />;

    return (
        <View style={styles.container}>
            <Appbar>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Customer Detail" />
                <Menu renderer={Popover} rendererProps={{ placement: 'bottom' }}>
                    <MenuTrigger style={styles.menuTrigger}>
                        <Button icon="dots-vertical" />
                    </MenuTrigger>
                    <MenuOptions style={styles.menuOptions}>
                        <MenuOption onSelect={() => navigation.navigate('UpdateCustomer')}>
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
                            <Text style={styles.text}>Name: </Text>
                            <Text style={styles.text}>Phone: </Text>
                            <Text style={styles.text}>Total Spent: </Text>
                            <Text style={styles.text}>Time: </Text>
                            <Text style={styles.text}>Last Update: </Text>
                        </View>

                        <View style={styles.innerContainer}>
                            <Text style={styles.valueText}>{customer?.name}</Text>
                            <Text style={styles.valueText}>{customer?.phone}</Text>
                            <Text style={[styles.valueText, { color: 'red' }]}>
                                {formatCurrencyVND(customer?.totalSpent)}
                            </Text>
                            <Text style={styles.valueText}></Text>
                            <Text style={styles.valueText}></Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.item}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Transaction History</Text>
                    <FlatList
                        data={transaction}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                    />
                </View>
            </View>
        </View>
    );
};

export default CustomerDetail;

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
        color: 'black',
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
