import React, { Component } from 'react';

import { TouchableOpacity, StyleSheet} from 'react-native'
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

  render() {
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
          <Text style={styles.name}>User Name</Text>
        </Header>
        <Body>
          <Content style={{backgroundColor: '#d2e3e5'}}>
              <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('PlantInfoRoute')}
                style = {{margin: 10, marginBottom: 0}}
              >
                <Plant/>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('PlantInfoRoute')}
                style = {{margin: 10, marginBottom: 0}}
              >
                <Plant/>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('PlantInfoRoute')}
                style = {{margin: 10, marginBottom: 0}}
              >
                <Plant/>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('PlantInfoRoute')}
                style = {{margin: 10, marginBottom: 0}}
              >
                <Plant/>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('PlantInfoRoute')}
                style = {{margin: 10, marginBottom: 0}}
              >
                <Plant/>
              </TouchableOpacity>
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
