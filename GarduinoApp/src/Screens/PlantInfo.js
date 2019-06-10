import React, { Component } from 'react';

import { Container, Body, Content, Button, Text, Header, Thumbnail, Footer, FooterTab, Left, Icon } from 'native-base';
import { StyleSheet, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import io from 'socket.io-client';
 

import Info  from '../Modules/PlantInfo/Info'
 
export default class PlantInfo extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const arduinoSerial = navigation.getParam('serial', 'no serial');

    this.state = {
      arduiserial: arduinoSerial,
      socketData: "",
      user: "",
      minMax: ""
    };

    this.socket = io('http://192.168.1.14:1205');
    this.socket.emit('setIdentifierW', {"IDUser":1, "ArduinoSerial": this.state.arduiserial});
    this.socket.on('plantData', plantData => {
      let data = [
        {
          index: 'Temperature',
          value: plantData.info.Temp,
          height: 50
        },
        {
          index: 'Air Humidity',
          value: plantData.info.SoilHum,
          height: 50
        },
        {
          index: 'Soil Humidity',
          value: plantData.info.AirHum,
          height: 50
        },
        {
          index: 'Water Surface',
          value: plantData.info.WatSurf,
          height: 50
        }
      ]
      
      this.setState({socketData: data})
    });
  }

  componentDidMount = async () => {
    await this.getUser();
    await this.getData();
    console.log('mount');
    
  }
  
  getData = async () => {
    console.log('data');
    await fetch('http://192.168.1.14:1205/minmax', {
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
          <Content style={{backgroundColor: '#d2e3e5'}}>
            <FlatList
              data={this.state.socketData}
              renderItem={({item}) => 
                <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('StatDetailRoute', {serial: this.state.arduiserial})}
                    style = {{margin: 10, marginBottom: 0}}
                >
                  <Info value={item.value} name={item.index}/>
                </TouchableOpacity> 
              }
              keyExtractor={({id}, index) => id}
            />
          </Content>
        </Body>
          <Footer>
            <FooterTab style={{backgroundColor: '#1f313a'}}>
              <Button
                onPress={() => this.props.navigation.navigate('ValuesSettingRoute')}
              >
                <Text style={{color: 'white'}}>Plant Settings</Text>
              </Button>
            </FooterTab>
          </Footer>
      </Container>
      );
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

