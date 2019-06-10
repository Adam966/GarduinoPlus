import React, { Component } from 'react';

import { TouchableOpacity, StyleSheet, AsyncStorage, FlatList} from 'react-native'
import { Container, Body, Content, Text, Button, Header, Left,  Footer, FooterTab, Icon } from 'native-base';

import Plant from '../Modules/PlantStyle/Plant';

export default class PlantList extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      dataSource: "",
    };
  };

  componentDidMount = async () => {
      await this.getUser();
      this.getData();
  }

  getData = async () => {
    await fetch('http://192.168.1.14:1205/plants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.user.token,
      },
      body: JSON.stringify({
        IDUser: this.state.user.id, 
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({dataSource: responseJson}); 
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
      <Container>
        <Header style={{height:70, paddingTop: 20, backgroundColor: '#1f313a'}}>
          <Left>
            <Button transparent
              onPress={() =>  this.props.navigation.openDrawer()}
            >
              <Icon name='md-menu' />
            </Button>
          </Left>
          <Body>    
            {/*<Thumbnail small source={require('../../assets/person.jpg')} /> */}
          </Body>
          <Text style={styles.name}>{this.state.user.name}</Text>
        </Header>
        <Body style={{backgroundColor: '#d2e3e5'}}>
          <Content>
            <FlatList
              data={this.state.dataSource}
              renderItem={({item}) => 
                  <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('PlantInfoRoute', {serial: item.ArduinoSerial, name: item.PlantName})}
                    style = {{margin: 10, marginBottom: 0}}
                  >
                  <Plant name={item.PlantName}/>
                </TouchableOpacity> 
              }
              keyExtractor={({id}, index) => id}
            />
          </Content>
        </Body>
        <Footer>
          <FooterTab style={{backgroundColor: '#1f313a'}}>
            <Button
              onPress={() => this.props.navigation.navigate('AddPlantRoute')}
            >
              <Text style={{color: 'white',fontWeight:'bold'}}>Add Plant</Text>
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
