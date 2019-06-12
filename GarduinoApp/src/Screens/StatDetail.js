import React, { Component } from 'react';
import { Container, Text, Body, Header, Icon, Thumbnail, Left, Button, FooterTab, Footer } from 'native-base';
import { StyleSheet } from 'react-native';

import Graph from '../Modules/Graph';

export default class StatDetail extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const arduinoSerial = navigation.getParam('serial', 'no serial');
    this.state = {
      arduiserial: arduinoSerial,
      user:"",
      Interval:"",
    };
  }

  componentDidMount = async () => {
    await this.getUser();
  }

  changeReq = async (interval) => {
    console.log("test");
    this.setState({Interval: interval});
    await this.getData();
   /*console.log("token"+this.state.user.token);
    console.log("id"+this.state.user.id);*/
  }

  getData = async () => {
    await fetch('http://192.168.0.103:1205/plantData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.user.token,
      },
      body: JSON.stringify({
        ArduinoSerial: this.state.arduinoSerial,
        Interval:this.state.Interval,

      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        //this.setState({dataSource: responseJson}); 
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
          <Text style={styles.name}>Plant name</Text>  
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

const styles = StyleSheet.create({
  name: {
    marginRight: 85,
    fontSize: 25, 
    fontWeight: '300',
    color: 'white',
    paddingTop: 10
  }
});

