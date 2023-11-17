import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Main from './Home';
import AddService from './SubScreen/AddService';
import ServiceDetail from './SubScreen/ServiceDetail';
import UpdateService from './SubScreen/UpdateService';

const Stack = createStackNavigator();

const SubScreenNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="AddService" component={AddService} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
      <Stack.Screen name="UpdateService" component={UpdateService} />
    </Stack.Navigator>
  );
};

export default SubScreenNavigator;
