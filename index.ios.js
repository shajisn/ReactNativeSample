/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 
import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  View
} from 'react-native';

/*
import React from 'react-native';
const {
  AppRegistry,
  Component,
  Text,
  Navigator,
  View
} = React;
*/

import NavigationBar from 'react-native-navbar';
import HomeScreen from './HomeScreen';

function renderScene(route, navigator) {
  return <route.component route={route} navigator={navigator} />;
}

class ProtoTypeApp extends Component {
  render() {
    const initialRoute = {
      component: HomeScreen
    };

    return (
      <View style={{ flex: 1, }}>
        <Navigator
          initialRoute={initialRoute}
          renderScene={renderScene}/>
      </View>
    );
  }
}

AppRegistry.registerComponent('ProtoTypeApp', () => ProtoTypeApp);
