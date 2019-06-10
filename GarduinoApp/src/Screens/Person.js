import React, { Component } from 'react';
import { StyleSheet, Dimensions, AsyncStorage } from 'react-native';
import { Header, Container, Body, Content, Text, Left, Button, Icon } from 'native-base';

export default class Person extends Component {
  static navigationOptions = {
    header: null,
  }
    constructor(props){
        super(props);
        this.state = { 
          user: ""
        }
    }
    
    async componentDidMount() {
      await this.getUser();
      console.log(this.state.user);
      
    }

    getUser = async () => {
      let User = await AsyncStorage.getItem('User');
      return this.setState({user: JSON.parse(User)});
    };  

    render(){
      return (
        <Container style={{width: Dimensions.get('window').width}}>
          <Header style={{height:70, paddingTop: 20, backgroundColor: '#1f313a'}}>
          <Left>
            <Button transparent
              onPress={() => this.props.navigation.navigate('PlantListRoute')}
            >
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Text style={styles.name}>Profile</Text>  
          </Header>
          <Body style={{backgroundColor: '#d2e3e5', width: Dimensions.get('window').width}}>
            <Content>
              <Text>Name: </Text>
              <Text>{this.state.user.name}</Text>
              <Text>Email: </Text>
              <Text>{this.state.user.email}</Text>
              <TouchableOpacity onPress={() => Linking.openURL('http://google.com')}>
                <Text style={{color: 'blue', textDecorationLine: 'underline', color: '#1f313a'}}>
                  Change password
                </Text>
          </TouchableOpacity>
            </Content>
          </Body>
        </Container>
        );
      }
}

const styles = StyleSheet.create({
  name: {
    marginRight: 85,
    fontSize: 20, 
    fontWeight: '300',
    color: 'white',
    paddingTop: 10
  }
});
