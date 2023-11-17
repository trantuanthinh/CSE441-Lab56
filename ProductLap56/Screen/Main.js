import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Customer from './Customer';
import Home from './Home';
import Setting from './Setting';
import Transaction from './Transaction';

const Main = () => {
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
    Home: Home,
    Transaction: Transaction,
    Customer: Customer,
    Setting: Setting,
  });

  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </SafeAreaProvider>
  );
};

export default Main;
