import React, { Component } from 'react';
import { Container, Body, Text, Button, Form,Item, Label, Input } from 'native-base';
import { StyleSheet, Dimensions } from 'react-native';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Container style={styles.box}>
        <Body>
          <Form style={{marginTop: 200, margin: 100, marginBottom: 10}}>
            <Item stackedLabel>
              <Label>Login</Label>
              <Input keyboardType="email-address" multiline={false}/>
            </Item>
            <Item stackedLabel>
              <Label>Password</Label>
              <Input keyboardType="default" multiline={false} secureTextEntry={true}/>
            </Item>
          </Form>  
          <Button onPress={() => this.props.navigation.navigate('PlantListRoute')}  
            style={styles.button}>
            <Text>Login</Text>
          </Button>
        </Body>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  box: {
      flex: 1,
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#d2e3e5',
  },
  button: {
    backgroundColor: '#1f313a', 
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 200,
    width: 150
  }
});