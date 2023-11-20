import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import {
  MenuProvider
} from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Customer from './Customer';
import Home from './Home';
import Setting from './Setting';
import AddService from './SubScreen/AddService';
import ServiceDetail from './SubScreen/ServiceDetail';
import UpdateService from './SubScreen/UpdateService';
import Transaction from './Transaction';

const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    <Stack.Screen
      name="ServiceDetail"
      component={ServiceDetail}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="AddService" component={AddService} />
    <Stack.Screen name="UpdateService" component={UpdateService} />
  </Stack.Navigator>
);

const Main = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'Home',
      title: 'Home',
      focusedIcon: 'home',
    },
    {
      key: 'Transaction',
      title: 'Transaction',
      focusedIcon: 'cash',
    },
    {
      key: 'Customer',
      title: 'Customer',
      focusedIcon: 'account-supervisor',
    },
    {
      key: 'Setting',
      title: 'Setting',
      focusedIcon: 'account-settings',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    Home: HomeStack,
    Transaction: Transaction,
    Customer: Customer,
    Setting: Setting,
  });

  return (
    <SafeAreaProvider>
      <MenuProvider
        style={styles.container}
        customStyles={{ backdrop: styles.backdrop }}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default Main;

const styles = StyleSheet.create({
});
