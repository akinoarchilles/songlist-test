import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    Appbar, Button, Caption, Card, Headline, Subheading, Title
} from 'react-native-paper';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songData: props.route.params.songData
        }
    }

    goBack = () => { this.props.navigation.goBack() };

    remove = () => {
        const { removeFromFavorites } = this.props.route.params
        let { songData } = this.state
        songData.isInFavorites = false
        this.setState({ songData }, () => {        
            removeFromFavorites(songData)
        })
    }

    add = () => {
        const { addToFavorites } = this.props.route.params
        let { songData } = this.state
        songData.isInFavorites = true
        this.setState({ songData }, () => {        
            addToFavorites(songData)
        })
    }

    goToFavorites = () => { 
        this.props.navigation.navigate('Favorites', {
            removeFromFavorites: this.remove,
            addToFavorites: this.add
        }
    ) };

    toggleFavorite = () => {
        let { songData } = this.state
        songData.isInFavorites = !songData.isInFavorites
        this.setState({ songData })
        if(!songData.isInFavorites) this.props.route.params.removeFromFavorites(songData.trackId)
        else this.props.route.params.addToFavorites(songData.trackId)
    };

    render() {
        const { songData } = this.state
        const year = (new Date(songData.releaseDate)).getUTCFullYear();
        return (
            <>
                <Appbar.Header dark={false} style={{ backgroundColor: 'darkturquoise' }}>
                    <TouchableOpacity onPress={this.goBack}>
                        <Ionicons name='chevron-back' size={24} color='black' />
                    </TouchableOpacity>
                    <Appbar.Content title='Details' />
                    <Button onPress={this.goToFavorites}>
                        <AntDesign name='heart' size={25} color='black' />
                    </Button>
                </Appbar.Header>
                <Card style={{ marginVertical: 5 }}>
                    <Card.Cover source={{ uri: songData.artworkUrl100.replace('100x100', '600x600') }} />
                    <Card.Content>
                        <Title>{songData.artistName}</Title>
                        <Headline>{songData.trackName}</Headline>
                        <Subheading>{songData.collectionName}</Subheading>
                        <Caption>{songData.primaryGenreName} ({year})</Caption>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={this.toggleFavorite}>
                            <AntDesign name='heart' size={25} color={songData.isInFavorites ? 'tomato' : 'lightgray'} />
                        </Button>
                    </Card.Actions>
                </Card>
            </>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 8,
    },
});