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
    this.state = {
    };
  }

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
              <Button>
                <Text style={{color: 'white',fontWeight:'bold'}}>Today</Text>
              </Button>
              <Button>
                <Text style={{color: 'white',fontWeight:'bold'}}>7 days</Text>
              </Button>
              <Button>
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

