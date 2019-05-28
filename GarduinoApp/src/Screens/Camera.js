import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    return{
      
    }
 }
}