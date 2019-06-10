import React, { Component } from 'react';
import { Container, Body, Text, Button, Form,Item, Label, Input } from 'native-base';
import { StyleSheet, AsyncStorage, TouchableOpacity, Linking } from 'react-native';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noLogin: "",
      password: "",
      login: "",
      token: ""
    };
  }

  login = () => {
    if(this.state.password || this.state.login != "") {
      fetch('http://192.168.1.14:1205/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: this.state.login, 
        Password: this.state.password
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        let login = {
          id: responseJson.ID,
          email: responseJson.Email,
          name: responseJson.Name,
          token: responseJson.Token
        }
          this.setState({user: login}, 
            () => {
              this.saveUserId();
              this.props.navigation.navigate('PlantListRoute');
            });
      })
    .catch((error) => {
        this.setState({noLogin: 'No valid login or password'})
    });
    } 
    else {
      this.setState({noLogin: "You must type name and password"})
    }
  }

  saveUserId = async () => {
    try {
      await AsyncStorage.setItem('User', JSON.stringify(this.state.user));
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <Container style={styles.box}>
        <Body>
          <Form style={{marginTop: 200, margin: 100, marginBottom: 10}}>
            <Item stackedLabel>
              <Label>Login</Label>
              <Input keyboardType="email-address" multiline={false} onChangeText={(text) => this.setState({login: text})}/>
            </Item>
            <Item stackedLabel>
              <Label>Password</Label>
              <Input keyboardType="default" autoCapitalize="none" multiline={false} secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}/>
            </Item>
          </Form>  
          <Button onPress={this.login.bind(this)}  
            style={styles.button}>
            <Text>Login</Text>
          </Button>
          <Text>{this.state.noLogin}</Text>
          <TouchableOpacity onPress={() => Linking.openURL('http://google.com')}>
            <Text style={{color: 'blue', textDecorationLine: 'underline', color: '#1f313a'}}>
              Register
            </Text>
          </TouchableOpacity>
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