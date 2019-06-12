import React, { Component } from 'react';
import { Form, Item, Label, Input, Text, Content, Container } from 'native-base';
import { StyleSheet, Dimensions } from 'react-native';

export default class SettingsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      max: 0,
      validation: ""
    };
  }

  getInput = () => {
    if ((this.state.min < this.state.max) && (this.state.min >= 0) && (this.state.max <=100)) {
      this.setState({validation: ""})
      this.props.getData(this.state);
    } else {
      this.setState({validation: "Wrong Input"})
    }
  }

  render() {
    return (
        <Container style={styles.box}>
            <Content header style={{zIndex: 2}} bounces={false}><Text style={styles.header}>{this.props.heading}</Text></Content>
                <Text style={{color:'#8A9394'}}>Min. value</Text>
                <Item style={{width: 40, marginBottom: 10}}>
                  <Input style={{borderBottomWidth: 1.5, borderBottomColor: '#8A9394'}} keyboardType = 'numeric' onChangeText={(text) => this.setState({min: text})}/>
                </Item>
                <Text style={{color:'#8A9394'}}>Max. value</Text>
                <Item style={{width: 40, marginBottom: 30}}>
                  <Input style={{borderBottomWidth: 1.5, borderBottomColor: '#8A9394'}} keyboardType = 'numeric' onChangeText={(text) => this.setState({max: text})} onEndEditing={() => this.getInput()}/>
                </Item>
                <Content footer style={{zIndex: 2}} bounces={false}>
                  <Text style={{color: '#e54b4b', fontSize: 12, marginBottom: 5}}>{this.state.validation}</Text>
                </Content>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
    box: {
        height: 245,
        width: Dimensions.get('window').width - 30,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#F0FEFF',
        marginVertical: 15,
    },
    header: {
        marginRight: 210,
        marginTop: 10,
        color: '#BBC7C8',
        fontSize: 17,
    },
    value: {
        marginBottom: 70
    },
  });