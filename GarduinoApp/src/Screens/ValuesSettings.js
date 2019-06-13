import React, { Component } from 'react';
import { Container, Text, Header, Left, Button, Icon, Thumbnail, Body, Content, Footer, FooterTab, Toast } from 'native-base';
import { StyleSheet, AsyncStorage, Alert } from 'react-native';

import SettingsCard from '../Modules/Settings/SettingsCard';

export default class ValuesSettings extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const arduinoSerial = navigation.getParam('serial', 'no serial');
    const name = navigation.getParam('name', 'no serial');
    const data = navigation.getParam('data', 'no serial');
    console.log(data);
  
    this.state = {
      arduinoserial: arduinoSerial,
      TempMax: data[0].TempMax, 
      TempMin: data[0].TempMin, 
      AirHumMax: data[0].AirHumMax, 
      AirHumMin: data[0].AirHumMin, 
      SoilHumMax: data[0].SoilHumMax, 
      SoilHumMin: data[0].SoilHumMin,
      user: null,
      name: name,
      status: false
    };
  }

  sendData = async () => {
    if(!((this.state.TempMax || this.state.TempMin || this.state.AirHumMax || this.state.AirHumMin || this.state.SoilHumMax || this.state.SoilHumMin) == null)) {
      this.setState({status: true})
    }
    if(this.state.status != false) {
      await this.getUser();
      fetch('http://192.168.1.14:1205/minmax', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.state.user.token,
        },
        body: JSON.stringify({
          identification: {
            ArduinoSerial: this.state.arduinoserial, 
            IDUser: this.state.user.id, 
            PlantName: this.state.name
        }, optimalValues: {
            TempMax: this.state.TempMax, 
            TempMin: this.state.TempMin, 
            AirHumMax: this.state.AirHumMax, 
            AirHumMin: this.state.AirHumMin, 
            SoilHumMax: this.state.SoilHumMax, 
            SoilHumMin: this.state.SoilHumMin
            }
        }) 
      })
      .then((response) => {
        //add approve message
        console.log(response.status);
        
      })
      .catch((error) => {
        console.log(error)
      }); 
      } else {
        Alert.alert(
          'Warning',
          'Wrong Input',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
      }
    }
  
  getUser = async () => {
    let User = await AsyncStorage.getItem('User');
    return this.setState({user: JSON.parse(User)});
  };

  getMinMaxTemp = (data) => {
    this.setState({TempMax: data.max});
    this.setState({TempMin: data.min});
    console.log(data);
  }
  
  getMinMaxAirHum = (data) => {
    this.setState({AirHumMax: data.max});
    this.setState({AirHumMin: data.min});
    console.log(data);
  }
  
  getMinMaxSoilHum = (data) => {
    this.setState({SoilHumMax: data.max});
    this.setState({SoilHumMin: data.min});
    console.log(data);
  }


  render() {
    return (
      <Container style={{backgroundColor: '#d2e3e5'}}>
       <Header style={{height:70, paddingTop: 20, backgroundColor: '#1f313a'}}>
        <Left>
          <Button transparent
            onPress={() => this.props.navigation.navigate('PlantListRoute')}
          >
            <Icon name='arrow-back' />
          </Button>
        </Left>
        <Body>
          <Thumbnail small source={require('../../assets/plant.png')} />     
        </Body>
          <Text style={styles.name}>{this.state.name}</Text>  
        </Header>
        <Body>
          <Content> 
            <SettingsCard heading="Temperature" getData={this.getMinMaxTemp} min={this.state.TempMax} max={this.state.TempMin}/>
            <SettingsCard heading="Air Humidity" getData={this.getMinMaxAirHum} min={this.state.AirHumMin} max={this.state.AirHumMax}/>
            <SettingsCard heading="Soil Humidity" getData={this.getMinMaxSoilHum}  min={this.state.SoilHumMin} max={this.state.SoilHumMax}/>
            <SettingsCard heading="Water Level" />
          </Content>
        </Body>
        <Footer>
          <FooterTab style={{backgroundColor: '#1f313a'}}>
            <Button
              onPress={() => this.sendData()}
            >
              <Text style={{color: 'white',fontWeight:'bold'}}>Save</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    marginRight: 85,
    fontSize: 25, 
    fontWeight: '300',
    color: 'white',
    paddingTop: 10
  }
});