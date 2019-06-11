import React, { Component } from 'react';
import { Container, Header, Left, Button, Body, Footer, FooterTab, Text, Item, Input, Icon, Title, Content, Thumbnail } from 'native-base';
import { Dimensions, TouchableOpacity, AsyncStorage } from 'react-native';

export default class AddPlant extends Component {
    static navigationOptions = {
        header: null,
      }
  constructor(props) {
    super(props); 
    this.state = {
        hasCameraPermission: null,
        arduinoSerial: "",
        plantName: "",
        wifiName: "",
        wifiPassword: "",
        user: null
    };
  }

  savePlant = async () => {
    await this.getUser();
    console.log(this.state.user);
    
    fetch('http://192.168.43.89:1205/minmax', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.state.user.token,
        },
        body: JSON.stringify({
            identification: {
                ArduinoSerial: this.state.arduinoSerial, 
                IDUser: this.state.user.id, 
                PlantName: this.state.plantName
            }, optimalValues: {
                TempMax: null, 
                TempMin: null, 
                AirHumMax: null, 
                AirHumMin: null, 
                SoilHumMax: null, 
                SoilHumMin: null
            }
        })
      })
      .then((response) => {
        //add approve message 
      })
      .catch((error) => {
          console.log(error)
      });
  }

  getUser = async () => {
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
                    <Title>User Name</Title>
                </Body>
            </Header>
            <Body>
                <Content style={styles.box}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('CameraRoute')}
                    >
                        <Thumbnail large source={require('../../assets/plant.png')} style={{marginLeft: 120}}></Thumbnail>
                    </TouchableOpacity>
                    <Item style={{marginVertical: 10 }}>
                        <Input placeholder="Your plant name" onChangeText={(text) => this.setState({plantName: text})}/>
                    </Item>
                    <Item style={{marginVertical: 10 }}>
                        <Input keyboardType = 'numeric' placeholder="Arduino serial number" onChangeText={(text) => this.setState({arduinoSerial: text})}/>
                    </Item>
                    <Item style={{marginVertical: 10 }}>
                        <Input placeholder="Type WiFi name" onChangeText={(text) => this.setState({wifiName: text})}/>
                    </Item>
                    <Item style={{marginVertical: 10 }}>
                        <Input placeholder="Type WiFi password" onChangeText={(text) => this.setState({wifiPassword: text})}/>
                    </Item>
                    <Button block style={{backgroundColor: '#1f313a'}}
                        onPress={() => this.connectWifi()}
                    >
                        <Text>Connect Device to WiFi</Text>    
                    </Button>
                </Content>
            </Body>
            <Footer>
                <FooterTab style={{backgroundColor: '#1f313a'}}>
                    <Button
                        onPress={() => this.savePlant()}
                    >
                        <Text style={{color: 'white'}}>Save</Text>
                    </Button>
                </FooterTab>
            </Footer>
        </Container>
    );
  }
}

const styles = {
    box: {
      width: Dimensions.get('window').width - 30,
      position: 'relative',
      display: 'flex',
      marginVertical: 20
    },
}