import React, { Component } from 'react';

import { Container, Body, Content, Button, Text, Header, Thumbnail, Footer, FooterTab, Left, Icon } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Info  from '../Modules/PlantInfo/Info'
 
export default class PlantInfo extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const data = [
      {
        index: 'Temperature',
        value: '25 °C',
        height: '60%'
      },
      {
        index: 'Air Humidity',
        value: '40 %',
        height: '40%'
      },
      {
        index: 'Soil Humidity',
        value: '25 %',
        height: '10%'
      },
      {
        index: 'Water Level',
        value: '90 %',
        height: '90%'
      },
    ]
   

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
        <Text style={styles.name}>Plant name</Text>  
      </Header>
      <Body>
        <Content style={{backgroundColor: '#d2e3e5'}}>

          {data.map(element => (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('StatDetailRoute')}>
              <Info value={element.value} height={element.height} name={element.index} />
            </TouchableOpacity>
          ))}

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

