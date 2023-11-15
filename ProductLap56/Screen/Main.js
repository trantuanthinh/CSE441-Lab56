import React, {useState} from 'react';
import {BottomNavigation} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Product_Add from './Product/Product_Add';
import Product_Detail from './Product/Product_Detail';
import Product_List from './Product/Product_List';
import Product_Search from './Product/Product_Search';

const MainScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'Home',
      title: 'Home',
      focusedIcon: 'home',
    },
    {key: 'Home', title: 'Home', focusedIcon: 'home'},
    {key: 'Product_Search', title: 'Search', focusedIcon: 'select-search'},
    {key: 'Product_Detail', title: 'Detail', focusedIcon: 'details'},
  ]);
  const renderScene = BottomNavigation.SceneMap({
    Product_List: Product_List,
    Product_Add: Product_Add,
    Product_Search: Product_Search,
    Product_Detail: Product_Detail,
  });

  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </SafeAreaProvider>
  );
};

export default MainScreen;
