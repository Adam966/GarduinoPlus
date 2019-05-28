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
    this.state = {
    };
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
          <Text style={styles.name}>Plant name</Text>  
        </Header>
        <Body>
          <Content> 
            <SettingsCard />
          </Content>
        </Body>
        <Footer>
          <FooterTab style={{backgroundColor: '#1f313a'}}>
            <Button>
              <Text style={{color: 'white'}}>Save</Text>
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