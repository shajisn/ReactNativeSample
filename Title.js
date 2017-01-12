// import React from 'react-native';
// const {
//   Component,
//   Image,
//   Text,
//   View
// } = React;

import React, { Component } from 'react';

import {
  Image,
  Text,
  View
} from 'react-native';

export default class Title extends Component {
  render() {
    const pickachu = 'https://pbs.twimg.com/profile_images/2643489197/2533a80926d7c8fc8c37eaa6becffe68_normal.png';
    return (
      <View style={{ flexDirection: 'row', }}>
        <Image
          source={{ uri: pickachu }}
          style={{ width: 20, height: 20, marginRight: 5, }}/>
        <Text style={{ paddingTop: 3, color: '#FFAA00', }}>Pokemonopedia</Text>
      </View>
    );
  }
}