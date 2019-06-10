import React, { Component } from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Container, ListItem, Left, Button, Icon, Body, Text, Header, Thumbnail } from 'native-base';

export default class Notification extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      user: "",
    };
  }

  componentWillMount() {
    this.getUser();
  }; 

  async getUser() {
    try {
      let User = await AsyncStorage.getItem('User');
      this.setState({user: JSON.parse(User)});
     } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <Container style={{backgroundColor: '#d2e3e5'}}>
        <Header style={{height:70, paddingTop: 20, backgroundColor: '#1f313a'}}>
          <Text style={styles.name}>{this.state.user.name}</Text>
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

