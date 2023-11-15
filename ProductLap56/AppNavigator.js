import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Login from './Screen/Login';
import Service from './Screen/SubScreen/Service';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Service" component={Service} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
