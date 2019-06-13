import React, { Component } from 'react';
import { StyleSheet, Dimensions, AsyncStorage, TouchableOpacity } from 'react-native';
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
            <Content style={{marginRight:180}}>
              <Text style={styles.title}>Name: </Text>
              <Text style={styles.value}>{this.state.user.name}</Text>
              <Text style={styles.title}>Email: </Text>
              <Text style={styles.value}>{this.state.user.email}</Text>
            </Content>
          </Body>
        </Container>
        );
      }
}

const styles = StyleSheet.create({
  name: {
    marginLeft: -150,
    fontSize: 20, 
    fontWeight: '300',
    color: 'white',
    paddingTop: 10
  }, 
  title: {
    fontSize: 30,
    marginVertical: 10,
    fontWeight: '900'
  },
  value: {
    fontSize: 25,
    marginBottom: 10,
  }
});
