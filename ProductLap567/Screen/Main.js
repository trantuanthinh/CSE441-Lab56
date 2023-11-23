import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import Customer from './Customer';
import Home from './Home';
import Setting from './Setting';
import Transaction from './Transaction';

import AddCustomer from './SubScreen/AddCustomer';
import AddService from './SubScreen/AddService';
import ServiceDetail from './SubScreen/ServiceDetail';
import TransactionDetail from './SubScreen/TransactionDetail';
import UpdateService from './SubScreen/UpdateService';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const HomeStack = () => (
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

const CustomerStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Customer"
      component={Customer}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="AddCustomer" component={AddCustomer} />
  </Stack.Navigator>
);

const TransactionStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Transaction"
      component={Transaction}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TransactionDetail"
      component={TransactionDetail}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const Main = () => {
  return (
    <SafeAreaProvider>
      <MenuProvider
        style={styles.container}
        customStyles={{ backdrop: styles.backdrop }}>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeStack} options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={26} />
            ),
          }} />
          <Tab.Screen name="Customer" component={CustomerStack} options={{
            tabBarLabel: 'Customer',
            tabBarIcon: ({ color }) => (
              <Icon name="people" color={color} size={26} />
            ),
          }} />
          <Tab.Screen name="Transaction" component={TransactionStack} options={{
            tabBarLabel: 'Transaction',
            tabBarIcon: ({ color }) => (
              <Icon name="cash" color={color} size={26} />
            ),
          }} />
          <Tab.Screen name="Settings" component={Setting} options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => (
              <Icon name="settings" color={color} size={26} />
            ),
          }} />
        </Tab.Navigator>
      </MenuProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default Main;
