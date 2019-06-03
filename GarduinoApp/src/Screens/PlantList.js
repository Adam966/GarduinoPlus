import React, { Component } from 'react';

import { TouchableOpacity, StyleSheet, AsyncStorage} from 'react-native'
import { Container, Body, Content, Text, Button, Header, Left, Title, Footer, FooterTab, Icon, Thumbnail  } from 'native-base';

import Plant from '../Modules/PlantStyle/Plant';

export default class PlantList extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  };

  componentWillMount() {
    this.getUser();
  }; 

  async getUser() {
    try {
      let User = await AsyncStorage.getItem('User');
      this.setState({user: User});
      console.log('Plantlist: ' + this.state.user);
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
      
  const data = [
    {
        PlantName: "Kaktus"
    },
    {
      PlantName: "Karafiat"
    },
    {
      PlantName: "Ruža",
    },
    {
      PlantName: "Ruža",
    },
    {
      PlantName: "Ruža",
    },
    {
      PlantName: "Ruža",
    }
  ];

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
            <Thumbnail small source={require('../../assets/person.jpg')} /> 
          </Body>
          <Text style={styles.name}>User name</Text>
        </Header>
        <Body style={{backgroundColor: '#d2e3e5'}}>
          <Content>

          {data.map(element => (             
                   <TouchableOpacity 
                     onPress={() => this.props.navigation.navigate('PlantInfoRoute')}
                     style = {{margin: 10, marginBottom: 0}}
                   >
                     <Plant name={element.PlantName}/>
                   </TouchableOpacity>  
          ))}
          
          </Content>
        </Body>
        <Footer>
          <FooterTab style={{backgroundColor: '#1f313a'}}>
            <Button
              onPress={() => this.props.navigation.navigate('AddPlantRoute')}
            >
              <Text style={{color: 'white'}}>Add Plant</Text>
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
