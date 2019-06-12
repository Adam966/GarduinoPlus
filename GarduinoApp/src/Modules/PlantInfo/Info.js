import React, { Component } from 'react';

import { Text, Content, Container } from 'native-base';
import { Dimensions  } from 'react-native';

export default class Info extends Component {
  constructor(props) {
    super(props);
    // const { navigation } = this.props;
    // const arduinoSerial = navigation.getParam('serial', 'no serial');
    this.state = {
    };
  }

  render() {
    return (
      <Container style={styles.box}>
        <Content header style={{zIndex: 2}}><Text style={styles.header}>{this.props.name}</Text></Content>
        <Content style={{zIndex: 2}}><Text style={styles.value}>{this.props.value + this.props.sign}</Text></Content>
        <Content style={{ zindex: 1, backgroundColor: this.props.color, position: 'absolute', bottom: 0, height: this.props.height + '%' , width: '100%',borderBottomLeftRadius: 5, 
        borderBottomRightRadius:5}}>
        </Content>
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
    borderRadius: 5,
    backgroundColor: '#F0FEFF',
    marginVertical: 10,
    borderRadius: 5
  },
  header: {
    marginRight: 155,
    marginTop: 10,
    color: '#BBC7C8',
    fontSize: 25,
  },
  value: {
    position: 'relative',
    fontSize: 35,
    color: '#009E7F',
    fontWeight: 'bold',
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