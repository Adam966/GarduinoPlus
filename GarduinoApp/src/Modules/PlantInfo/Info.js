import React, { Component } from 'react';

import { Text, Content, Container } from 'native-base';
import { Dimensions  } from 'react-native';

export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Container style={styles.box}>
        <Content header style={{zIndex: 2}}><Text style={styles.header}>Temperature</Text></Content>
        <Content style={{zIndex: 2}}><Text style={styles.value}>100</Text></Content>
        <Content style={styles.overlay}></Content>
      </Container>
    );
  }
}

const styles = {
  box: {
    height: 150,
    width: Dimensions.get('window').width - 30,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.3,
    borderRadius: 5,
    backgroundColor: '#F0FEFF',
  },
  header: {
    marginRight: 215,
    marginTop: 10,
  },
  value: {
    position: 'relative',
  },
  overlay: {
    zindex: 1,
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 0,
    height: '50%',
    width: '100%'
  }
}