import React, { Component } from 'react';

import { Text, Content, Container } from 'native-base';
import { Dimensions  } from 'react-native';

export default class Info extends Component {
  constructor(props) {
    super(props);

    const arduinoSerial = navigation.getParam('serial', 'no serial');
    this.state = {
      arduiserial: arduinoSerial
    };
  }

  render() {
    return (
      <Container style={styles.box}>
        <Content header style={{zIndex: 2}}><Text style={styles.header}>{this.props.name}</Text></Content>
        <Content style={{zIndex: 2}}><Text style={styles.value}>{this.props.value}</Text></Content>
        <Content style={{ zindex: 1, backgroundColor: 'green', position: 'absolute', bottom: 0, height: this.props.heigt, width: '100%'}}></Content>
      </Container>
    );
  }
}

const styles = {
  box: {
    height: 220,
    width: Dimensions.get('window').width - 30,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.3,
    borderRadius: 5,
    backgroundColor: '#F0FEFF',
    marginVertical: 10,
  },
  header: {
    marginRight: 215,
    marginTop: 10,
    fontWeight: 'bold',
  },
  value: {
    position: 'relative',
  },
  overlay: {
    zindex: 1,
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 0,
    height: '80%',
    width: '100%'
  }
}