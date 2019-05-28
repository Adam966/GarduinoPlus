import React, { Component } from 'react';
import { Form, Item, Label, Input, Text, Content, Container } from 'native-base';
import { StyleSheet, Dimensions } from 'react-native';

export default class SettingsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <Container style={styles.box}>
            <Content header style={{zIndex: 2}}><Text style={styles.header}>Temperature</Text></Content>
                <Text>Min. value</Text>
                <Item style={{width: 40, marginBottom: 10}}>
                  <Input keyboardType = 'numeric' />
                </Item>
                <Text>Max. value</Text>
                <Item style={{width: 40, marginBottom: 30}}>
                  <Input keyboardType = 'numeric' />
                </Item>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
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
        marginVertical: 15,
    },
    header: {
        marginRight: 215,
        marginTop: 10,
        fontWeight: 'bold',
    },
    value: {
        marginBottom: 70
    },
  });