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

export default class NextButton extends Component {
  render() {
    const nextButton = 'http://cdn.flaticon.com/png/256/64410.png';
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image
          source={{ uri: nextButton }}
          style={[{ width: 20, height: 20, }, this.props.style]}/>
      </TouchableOpacity>
    );
  }
}
