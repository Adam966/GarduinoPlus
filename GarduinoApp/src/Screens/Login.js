import React, { Component } from 'react';

import { Container, Body, Text, Button, Form,Item, Label, Input,Thumbnail } from 'native-base';
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

  /* componentDidMount = async () => {
    await this.getUser();
  } */

  login = () => {
    if(this.state.password || this.state.login != "") {
      fetch('http://192.168.43.89:1205/login', {
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

  /* getUser = async () => {
    try {
      let User = await AsyncStorage.getItem('User');
      console.log('user'+User);
      this.props.navigation.navigate('PlantListRoute');
      
    } catch (error) {
      console.log('login');
      
    }
  };
 */
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
          <Thumbnail square source={require('../../assets/icon.png')} style={{alignSelf: 'center',height:120,width:120,marginTop:-70,marginBottom:50}}/>
            <Item stackedLabel style={styles.itemStyle}>
              <Label style={styles.labelStyle}>Login</Label>
              <Input keyboardType="email-address" multiline={false} onChangeText={(text) => this.setState({login: text})}/>
            </Item>
            <Item stackedLabel style={styles.itemStyle}>
              <Label style={styles.labelStyle}>Password</Label>
              <Input keyboardType="default" autoCapitalize="none" multiline={false} secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}/>
            </Item>
          </Form>  
          <Button noShadow onPress={this.login.bind(this)} style={styles.button}>
            <Text>Submit</Text>
          </Button>
          <Text>{this.state.noLogin}</Text>
{/*           <TouchableOpacity onPress={() => Linking.openURL('C:\Users\MI\Documents\GitHub\GarduinoPlus\web\registration.html')}>
            <Text style={{color: 'blue', textDecorationLine: 'underline', color: '#1f313a'}}>
              Register
            </Text>
          </TouchableOpacity> */}
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
      flexDirection: 'column',
      backgroundColor: '#D2E3E5',
  
  },

  labelStyle: {
    color:'#606769',
    fontWeight: 'bold',
  },

  itemStyle: {
      borderColor: '#A4B1B3',
      color: '#A4B1B3',
      opacity: 0.5,
      borderBottomWidth: 1.5,
  },

  button: {
    backgroundColor: '#1f313a', 
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: 5,
    width: 320,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: .3,
    shadowRadius: 3,
    elevation: 3
  },
});