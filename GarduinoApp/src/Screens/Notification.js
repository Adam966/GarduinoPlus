import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, ListItem, Left, Button, Icon, Body, Text, Header, Thumbnail } from 'native-base';

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
          <Body>    
              <Thumbnail small source={require('../../assets/person.jpg')} /> 
            </Body>
          <Text style={styles.name}>User Name</Text>
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
                <Button transparent
                  onPress={() => this.props.navigation.navigate('PersonRoute')}
                >
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

const styles = StyleSheet.create({
  name: {
    marginRight: 85,
    fontSize: 25, 
    fontWeight: '300',
    color: 'white',
    paddingTop: 10
  }
});

