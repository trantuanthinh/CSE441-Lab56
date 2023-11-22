import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';

const Setting = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('data');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      console.log('Data cleared successfully!');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: 'pink' }}>
        <Appbar.Content title="Setting" />
        <Appbar.Action icon="account-circle" />
      </Appbar.Header>
      <Button style={styles.button} onPress={() => handleLogout()}>
        Log out
      </Button>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },

  button: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'lightpink',
  },
});
