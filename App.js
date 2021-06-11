import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Provider
} from 'react-native-paper';
import Favorites from './src/Favorites';
import SongDetails from './src/SongDetails';
import SongList from './src/SongList';
import SongSearch from './src/SongSearch';

const Stack = createStackNavigator();

const App = () => (
  <Provider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SongList' headerMode='none'>
        <Stack.Screen name='SongList' component={SongList} />
        <Stack.Screen name='Favorites' component={Favorites} />
        <Stack.Screen name='SongDetails' component={SongDetails} />
        <Stack.Screen name='SongSearch' component={SongSearch} />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>
);

export default App;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 8,
  },
});
