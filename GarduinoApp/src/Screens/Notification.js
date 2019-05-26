import React, { Component } from 'react';
import { } from 'react-native';
import { Container, ListItem, Left, Button, Icon, Body, Text, Header, Title } from 'native-base';

export default class Notification extends Component {
  static navigationOptions = {
    header: null,
  };
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
            <Title>Garduino</Title>
          </Left>
        </Header>
            <ListItem icon>
              <Left>
                <Button transparent>
                  <Icon  name='settings' style={{color: '#1f313a', fontSize: 33}}/>
                </Button> 
              </Left>
              <Body>
                <Text>Settings</Text>
              </Body>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button transparent>
                  <Icon  name='person' style={{ color: '#1f313a', fontSize: 33}}/>
                </Button> 
              </Left>
              <Body>
                <Text>Profile</Text>
              </Body>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button transparent onPress={() => this.props.navigation.navigate('LoginRoute')}>
                  <Icon  name='md-log-out' style={{ color: '#1f313a', fontSize: 33}}/>
                </Button> 
              </Left>
              <Body>
                <Text>Log out</Text>
              </Body>
            </ListItem>
      </Container>
    );
  }
}
