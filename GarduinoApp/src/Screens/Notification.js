import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, TouchableOpacity } from 'react-native';
import { Container, ListItem, Left, Icon, Body, Text, Header, Content, Right, Button ,List } from 'native-base';

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
{/*             <ListItem icon>
              <Left>
                <Button transparent>
                  <Icon  name='settings' style={{color: '#1f313a', fontSize: 33}}/>
                </Button> 
              </Left>
              <Body>
                <Text>Settings</Text>
              </Body>
            </ListItem> */}
              <List>
                  <ListItem icon style={{marginRight:150}}>
                  <TouchableOpacity style={{ width: 200}} onPress={() => this.props.navigation.navigate('PersonRoute')}>
                    <Left style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name='person' style={{ color: '#1f313a', fontSize: 33, marginRight: 15}}/>
                      <Text >Profile</Text>
                    </Left>
                    </TouchableOpacity> 
                  </ListItem>
                <ListItem icon style={{marginRight:150}}>
                  <TouchableOpacity style={{ width: 200}} onPress={() => AsyncStorage.removeItem('User', () => {this.props.navigation.navigate('LoginRoute');})}>
                    <Left style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='md-log-out' style={{ color: '#1f313a', fontSize: 33,marginRight: 15}}/>
                        <Text>Log out</Text>
                    </Left>
                  </TouchableOpacity> 
                </ListItem>
              </List>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    marginRight: 120,
    fontSize: 25, 
    fontWeight: '300',
    color: 'white',
    paddingTop: 10
  }
});

