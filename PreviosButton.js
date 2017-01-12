// import React from 'react-native';
// const {
//   Component,
//   Image,
//   TouchableOpacity
// } = React;

import React, { Component } from 'react';

import {
  Image,
  TouchableOpacity
} from 'react-native';

export default class PreviosButton extends Component {
  render() {
    const prevButton = 'http://cdn.flaticon.com/png/256/34097.png';
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image
          source={{ uri: prevButton }}
          style={[{ width: 20, height: 20, }, this.props.style]}/>
      </TouchableOpacity>
    );
  }
}
