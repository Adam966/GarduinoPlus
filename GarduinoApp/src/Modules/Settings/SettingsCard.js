import React, { Component } from 'react';
import { Card, CardItem, Form, Item, Label, Input, Text } from 'native-base';
import { StyleSheet, Dimensions } from 'react-native';

export default class SettingsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <Card bordered style={styles.box}>
            <CardItem header>
                <Text>Temperature</Text>
            </CardItem>
            <CardItem>
                <Form>
                    <Item stackedLabel>
                        <Label>Min Value</Label>
                        <Input keyboardType="numeric"/>
                    </Item>
                </Form>  
            </CardItem>
            <CardItem>
                <Form>
                    <Item stackedLabel>
                        <Label>Max Value</Label>
                        <Input keyboardType="numeric"/>
                    </Item>
                </Form>  
            </CardItem>
        </Card>
    );
  }
}

const styles = StyleSheet.create({
    box: {
        height: 200,
        width: Dimensions.get('window').width - 30,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.3,
        borderRadius: 5,
    },
  });