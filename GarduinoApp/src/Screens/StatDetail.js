import React, { Component } from 'react';
import { Container, Text, Body, Header, Icon, Thumbnail, Left, Button, FooterTab, Footer } from 'native-base';
import { StyleSheet, AsyncStorage, ActivityIndicator, Dimensions } from 'react-native';


import Graph from '../Modules/Graph';

export default class StatDetail extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const arduinoSerial = navigation.getParam('serial', 'no serial');
    const statName = navigation.getParam('statname','no statname');
    this.state = {
      arduinoserial: arduinoSerial,
      user:"",
      Interval:"",
      isLoadig: true,
      dataSource:"",
      statname: statName,
      filteredData: [],
      render: false
    };
  }

  componentDidMount = async () => {
    await this.getUser();
    this.setState({isLoadig: false});

  }

  getData = async () => {
    await fetch('http://192.168.43.89:1205/plantData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.user.token,
      },
      body: JSON.stringify({
        ArduinoSerial: this.state.arduinoserial,
        Interval :this.state.Interval,

      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({dataSource: responseJson}); 
        this.filterData(this.state.dataSource, this.state.statname);
      })
    .catch((error) => {
      console.log(error)
    });
  }

  getUser = async () => {
    console.log("getting user");
    let User = await AsyncStorage.getItem('User');
    return this.setState({user: JSON.parse(User)});
  };

  filterData = (data, statname) => {

    
    let arr =[];
    data.map((item) => {

      if(statname === "Temperature"){
        arr.push(item.Temp)
      }else if(statname === "Air Humidity"){
        arr.push(item.AirHum)
      }else if(statname === "Soil Humidity"){
        arr.push(item.SoilHum)
      }else if(statname === "WaterSurface"){
        arr.push(item.WaterSurf)
      }
      
    });
    this.setState({filteredData: arr});
    console.log(this.state.filteredData);
    this.setState({render: true});
  } 
    

  render() {
    if(this.state.isLoadig) {
      return (<ActivityIndicator style={{marginTop: Dimensions.get('window').height / 2}} size="large" color="'#1f313a"/>)
    } else {
    return (
      <Container style={{backgroundColor: '#d2e3e5'}}>
        <Header style={{height:70, paddingTop: 20, backgroundColor: '#1f313a'}}>
          <Left>
            <Button transparent
              onPress={() => this.props.navigation.navigate('PlantInfoRoute')}
            >
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Thumbnail small source={require('../../assets/plant.png')} />     
          </Body>
          <Text style={styles.name}>{this.props.statName}</Text>  
        </Header>
        <Body>
          {this.state.render == true &&
            <Graph data={this.state.filteredData}/> 
          }

          
        </Body>
        <Footer>
          <FooterTab style={{backgroundColor: '#1f313a'}}>
          <Button onPress={() => {this.setState({Interval: "DAY"}, () => this.getData())}}>
                <Text style={{color: 'white',fontWeight:'bold'}}>Today</Text> 
              </Button>
              <Button onPress={() => {this.setState({Interval: "WEEK"}, () => this.getData())}}>
                <Text style={{color: 'white',fontWeight:'bold'}}>7 days</Text>
              </Button>
              <Button onPress={() => {this.setState({Interval: "MONTH"}, () => this.getData())}}>
                <Text style={{color: 'white',fontWeight:'bold'}}>Month</Text>
              </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
    }
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

