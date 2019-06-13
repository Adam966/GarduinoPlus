import React, { Component } from 'react';

import { Container, Body, Content, Button, Text, Header, Thumbnail, Footer, FooterTab, Left, Icon } from 'native-base';
import { StyleSheet, TouchableOpacity, FlatList, AsyncStorage, ActivityIndicator, Dimensions, Image } from 'react-native';
import io from 'socket.io-client';

import Info  from '../Modules/PlantInfo/Info';
 
export default class PlantInfo extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const arduinoSerial = navigation.getParam('serial', 'no serial');
    const name = navigation.getParam('name', 'no name');

    const data = [
      {
        index: 'Temperature',
        value: 0,
        height: 0,
        sign: ' °C',
        color: ""
      },
      {
        index: 'Air Humidity',
        value: 0,
        height: 0,
        sign: ' %',
        color: ""
      },
      {
        index: 'Soil Humidity',
        value: 0,
        height: 0,
        sign: ' %',
        color: ""
      },
      {
        index: 'Water Surface',
        value: 0,
        height: 0,
        sign: ' %',
        color: ""
      }
    ]

    this.state = {
      arduiserial: arduinoSerial,
      socketData: data,
      user: "",
      minMax: "",
      name: name,
      isLoading: true
    };

    this.socket = io('http://192.168.2.15:1205');
    this.socket.emit('setIdentifierApp', {"IDUser":this.state.user.id, "ArduinoSerial": this.state.arduiserial});
    this.socket.on('plantData', plantData => {
      console.log("socket");
  
      let data = [
        {
          index: 'Temperature',
          value: plantData.info.Temp,
          height: plantData.info.Temp,
          sign: ' °C',
          color: (plantData.info.Temp < this.state.minMax[0].TempMax && plantData.info.Temp > this.state.minMax[0].TempMin) ? "#3ce578" : "#e54242"        
        },
        {
          index: 'Air Humidity',
          value: plantData.info.AirHum,
          height: plantData.info.AirHum ,
          sign: ' %',
          color: (plantData.info.Temp < this.state.minMax[0].AirHumMax && plantData.info.Temp > this.state.minMax[0].AirHumMin) ? "#3ce578" : "#e54242"                  
        },
        {
          index: 'Soil Humidity',
          value: plantData.info.SoilHum,
          height: plantData.info.SoilHum,
          sign: ' %',
          color: (plantData.info.Temp < this.state.minMax[0].SoilHumMax && plantData.info.Temp > this.state.minMax[0].SoilHumMin) ? "#3ce578" : "#e54242"                  
        },
        {
          index: 'Water Surface',
          value: plantData.info.WatSurf,
          height: 50,
          sign: ' %'
        }
      ]
      
      this.setState({socketData: data})
    });
  }

  componentDidMount = async () => {
    await this.getUser();
    await this.getData();
    this.setState({isLoadig: false}); 
  }
  
  getData = async () => {
    console.log('data');
    await fetch('http://192.168.2.15:1205/minmax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.user.token,
      },
      body: JSON.stringify({
        ArduinoSerial: this.state.arduiserial, 
      })
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

  getUser = async () => {
    console.log('user');
    let User = await AsyncStorage.getItem('User');
    return this.setState({user: JSON.parse(User)});
  };
  
  render() {
    if(this.state.isLoadig) {
      return (<ActivityIndicator style={{marginTop: Dimensions.get('window').height / 2}} size="large" color="'#1f313a"/>)
    } else {
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
            <Thumbnail small source={require('../../assets/plant.png')}/>    
          </Body>
          <Text style={styles.name}>{this.state.name}</Text>
          <TouchableOpacity onPress={() => {console.log('CLICK')}}>
            <Image source={{uri: '../../assets/icon4.svg'}} style={{width: 10, height: 10}}/> 
          </TouchableOpacity>
        </Header>
        <Body>
          <Content style={{backgroundColor: '#d2e3e5'}}>
            <FlatList
              data={this.state.socketData}
              renderItem={({item}) => 
                <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('StatDetailRoute', {serial: this.state.arduiserial, name: this.state.name, statname: item.index})}
                    style = {{margin: 10, marginBottom: 0}}
                >
                  <Info value={item.value} name={item.index} height={item.height} sign={item.sign} color={item.color}/>
                </TouchableOpacity> 
              }
              keyExtractor={({id}, index) => id}
            />
          </Content>
        </Body>
          <Footer>
            <FooterTab style={{backgroundColor: '#1f313a'}}>
              <Button

                onPress={() => this.props.navigation.navigate('ValuesSettingRoute',  {serial: this.state.arduiserial, name: this.state.name, data: this.state.minMax})}
 >
                <Text style={{color: 'white'}}>Plant Settings</Text>
              </Button>
            </FooterTab>
          </Footer>
      </Container>
      );}
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    marginRight: 85,
    fontSize: 25, 
    fontWeight: '300',
    color: 'white',
    paddingTop: 10
  }
});

