import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
    Appbar, Button, Searchbar, Snackbar
} from 'react-native-paper';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import searchResponse from '../mock-data.json';
import SongItem from './SongItem';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SongData: searchResponse.results,
            visibleSnackbar: false,
            snackbarContent: 'Hello',
            searchQuery: ''
        }
    }

    // componentDidUpdate(prevProps) { callback pop screen
    //     if(prevProps.route.params?.Favorited !== this.props.route.params?.Favorited) {
    //         this.favFromSearch(this.props.route.params.Favorited)
    //     }
    // }

    duplicateCheck = (Song) => {
        const { SongData } = this.state
        let temp = SongData.find(e => e.trackId == Song.trackId)
        if(temp) return true
        return false
    }

    favFromSearch = async (Song) => {
        let { SongData } = this.state

        if(!this.duplicateCheck(Song)) {
            SongData.push(Song)
            this.setState({ SongData })
    
            let Favorites = await AsyncStorage.getItem('Favorites')
            if(Favorites) {
                Favorites = JSON.parse(Favorites)
                Favorites.push(Song)
                AsyncStorage.setItem('Favorites',JSON.stringify(Favorites))
            }
        }
    }

    unfavFromSearch = async (Song) => {
        const { SongData } = this.state
        let idx = SongData.findIndex(e => e.trackId == Song.trackId)
        if(idx > -1) { // found
            SongData[idx].isInFavorites = false
            this.setState({ SongData })
        }
        let Favorites = await AsyncStorage.getItem('Favorites')
        if(Favorites) {
            Favorites = JSON.parse(Favorites)
            Favorites = Favorites.filter((e) => e.trackId !== Song.trackId)
            AsyncStorage.setItem('Favorites', JSON.stringify(Favorites))
        }
    }

    addToFavorites = (Song) => {
        let { SongData, visibleSnackbar, snackbarContent } = this.state
        let index = SongData.findIndex(e => e.trackId == Song.trackId)
        SongData[index].isInFavorites = true
        visibleSnackbar = true
        snackbarContent = SongData[index].trackName + " - " + SongData[index].artistName + " added to Favorites"
        this.setState({ SongData, visibleSnackbar, snackbarContent })
        
        //Get all Favorites only
        let Favorites = SongData.filter(e => e.isInFavorites)
        AsyncStorage.setItem('Favorites', JSON.stringify(Favorites))
    };

    removeFromFavorites = async(Song) => {
        let { SongData, visibleSnackbar, snackbarContent } = this.state
        let index = SongData.findIndex(e => e.trackId == Song.trackId)
        if(index > -1) {
            SongData[index].isInFavorites = false
            visibleSnackbar = true
            snackbarContent = SongData[index].trackName + " - " + SongData[index].artistName + " removed from Favorites"
            this.setState({ SongData, visibleSnackbar, snackbarContent })
        }

        //Remove Favorites with track id
        let Favorites = await AsyncStorage.getItem('Favorites')
        if(Favorites) {
            Favorites = JSON.parse(Favorites)
            Favorites = Favorites.filter(e => e.trackId != Song.trackId)
            AsyncStorage.setItem('Favorites', JSON.stringify(Favorites))
        }
    };

    onChangeText = (value) => {
        let { searchQuery } = this.state
        searchQuery = value
        this.setState({ searchQuery })
    };

    goToFavorites = () => { 
        this.props.navigation.navigate('Favorites', { 
            Songs: [], 
            removeFromFavorites: this.removeFromFavorites,
            addToFavorites: this.addToFavorites
        }) 
    };

    fetchResults = () => {
        const { searchQuery } = this.state
        this.setState({ searchQuery: '' })
        this.props.navigation.navigate('SongSearch', {
            searchQuery: searchQuery,
            favFromSearch: this.favFromSearch,
            unfavFromSearch: this.unfavFromSearch
        })
    };

    renderItem = ({ item, index }) => (
        <SongItem trackData={item} isInFavorites={item.isInFavorites} addToFavorites={() => this.addToFavorites(item)} removeFromFavorites={() => this.removeFromFavorites(item)} key={index} />
    );

    render() {
        const { SongData, searchQuery, snackbarContent } = this.state
        return (
            <>
                <Appbar.Header dark={false} style={{ backgroundColor: 'turquoise' }}>
                    <Appbar.Content title='Song List' />
                    <Button onPress={this.goToFavorites}>
                        <AntDesign name='heart' size={25} color='black' />
                    </Button>
                </Appbar.Header>
                <View style={styles.content}>
                    <Searchbar
                        placeholder='Search'
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.fetchResults}
                        value={searchQuery}
                        style={{ marginBottom: 20 }}
                    />
                    <FlatList
                        style={{ flex: 1 }}
                        data={SongData}
                        keyExtractor={(item) => item.trackId}
                        extraData={SongData}
                        renderItem={this.renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                    <Snackbar
                        visible={this.state.visibleSnackbar}
                        onDismiss={() => this.setState({ visibleSnackbar: false })}
                    >
                        {snackbarContent}
                    </Snackbar>
                </View>
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