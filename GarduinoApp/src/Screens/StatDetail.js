import React, { Component } from 'react';
import { Container, Text, Body, Header, Icon, Thumbnail, Left, Button, FooterTab, Footer } from 'native-base';
<<<<<<< Updated upstream
import { StyleSheet, AsyncStorage, ActivityIndicator, Dimensions } from 'react-native';

=======
import { StyleSheet,AsyncStorage  } from 'react-native';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
      isLoadig: true,
=======
>>>>>>> Stashed changes
      dataSource:"",
      statname: statName,
    };
  }

  componentDidMount = async () => {
    await this.getUser();
    this.setState({isLoadig: false});

  }

  changeReq = async (interval) => {
<<<<<<< Updated upstream

    await this.setState({Interval: interval});
=======
    console.log("test");
    console.log(this.state.statname);
    this.setState({Interval: interval});
>>>>>>> Stashed changes
    await this.getData();
  }

  getData = async () => {
    await fetch('http://192.168.1.14:1205/plantData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.user.token,
      },
      body: JSON.stringify({
        ArduinoSerial: this.state.arduinoserial,
<<<<<<< Updated upstream
        Interval :this.state.Interval,
=======
        Interval:this.state.Interval,

>>>>>>> Stashed changes
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({dataSource: responseJson}); 
        console.log(responseJson);
        
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
          <Text style={styles.name}>{this.props.name}</Text>  
        </Header>
        <Body >
          <Graph />
        </Body>
        <Footer>
          <FooterTab style={{backgroundColor: '#1f313a'}}>
          <Button onPress={() => this.changeReq("DAY")}>
                <Text style={{color: 'white',fontWeight:'bold'}}>Today</Text> 
              </Button>
              <Button onPress={() => this.changeReq("WEEK")}>
                <Text style={{color: 'white',fontWeight:'bold'}}>7 days</Text>
              </Button>
              <Button onPress={() => this.changeReq("MONTH")}>
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

