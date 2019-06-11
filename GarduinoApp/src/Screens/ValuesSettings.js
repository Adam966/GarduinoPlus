import React, { Component } from 'react';
import { Container, Text, Header, Left, Button, Icon, Thumbnail, Body, Content, Footer, FooterTab } from 'native-base';
import { StyleSheet } from 'react-native';

import SettingsCard from '../Modules/Settings/SettingsCard';

export default class ValuesSettings extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const arduinoSerial = navigation.getParam('serial', 'no serial');
    this.state = {
      arduiserial: arduinoSerial,
      TempMax: null, 
      TempMin: null, 
      AirHumMax: null, 
      AirHumMin: null, 
      SoilHumMax: null, 
      SoilHumMin: null,
      user: ""
    };
  }

  getUser = async () => {
    console.log('user');
    let User = await AsyncStorage.getItem('User');
    return this.setState({user: JSON.parse(User)});
  };

  sendData = async () => {
    await this.getUser();
    console.log(this.state.user);
    await fetch('http://192.168.43.31:1205/minmax', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.user.token,
      },
      body: JSON.stringify({
        identification: {
          ArduinoSerial: this.state.arduinoSerial, 
          IDUser: this.state.user.id, 
          PlantName: this.props.name
      }, optimalValues: {
          TempMax: this.state.TempMax, 
          TempMin: this.state.TempMin, 
          AirHumMax: this.state.AirHumMax, 
          AirHumMin: this.state.AirHumMin, 
          SoilHumMax: this.state.SoilHumMax, 
          SoilHumMin: this.state.SoilHumMin
          }
      }, console.log(identification)
      ) 
    })
    .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        
        this.setState({minMax: responseJson}); 
      })
    .catch((error) => {
      console.log(error)
    }); 
  }

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
          <Text style={styles.name}>{this.props.name}</Text>  
        </Header>
        <Body>
          <Content> 
            <SettingsCard heading="Temperature" getData={this.getMinMaxTemp}/>
            <SettingsCard heading="Air Humidity" getData={this.getMinMaxAirHum}/>
            <SettingsCard heading="Soil Humidity" getData={this.getMinMaxSoilHum}/>
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