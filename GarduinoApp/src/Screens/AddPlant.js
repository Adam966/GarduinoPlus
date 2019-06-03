import React, { Component } from 'react';
import { Container, Header, Left, Button, Body, Footer, FooterTab, Text, Item, Input, Icon, Title, Content, Thumbnail } from 'native-base';
import { Dimensions, TouchableOpacity } from 'react-native';

export default class AddPlant extends Component {
    static navigationOptions = {
        header: null,
      }
  constructor(props) {
    super(props); 
    this.state = {
        hasCameraPermission: null,
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
                    <Title>User Name</Title>
                </Body>
            </Header>
            <Body>
                <Content style={styles.box}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('CameraRoute')}
                    >
                        <Thumbnail large source={require('../../assets/plant.png')} style={{marginLeft: 120}}></Thumbnail>
                    </TouchableOpacity>
                    <Item style={{marginVertical: 10 }}>
                        <Input placeholder="Your plant name"/>
                    </Item>
                    <Item style={{marginVertical: 10 }}>
                        <Input keyboardType = 'numeric' placeholder="Arduino serial number"/>
                    </Item>
                    <Item style={{marginVertical: 10 }}>
                        <Input placeholder="Type WiFi name"/>
                    </Item>
                    <Item style={{marginVertical: 10 }}>
                        <Input placeholder="Type WiFi password"/>
                    </Item>
                    <Button block style={{backgroundColor: '#1f313a'}}>
                        <Text>Connect Device to WiFi</Text>    
                    </Button>
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

const styles = {
    box: {
      width: Dimensions.get('window').width - 30,
      position: 'relative',
      display: 'flex',
      marginVertical: 20
    },
}