import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import {
    ActivityIndicator,
    Appbar, Button, Searchbar
} from 'react-native-paper';
import SongItem from './SongItem';

const API_URL = 'https://itunes.apple.com/search?limit=10&offset=0&term=';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            prevSearchQuery: props.route.params.searchQuery,
            Songs: [],
            count: 0,
            searchQuery: props.route.params.searchQuery,
            Favorited: {}
        }
    }

    getApi = (params) => { 
        this.setState({ isLoading: true })
        return new Promise((resolve, reject) => {
            let url = `${API_URL}${params}`
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ isLoading: false })
                return resolve(responseJson)
            })
            .catch((error) => {
                this.setState({ isLoading: false })
                return reject(error)
            })
        })
    }

    componentDidMount() {
        const { navigation } = this.props
        navigation.setOptions({ 
            title: this.state.searchQuery
        })
        this.fetchResults()
    }

    onChangeText = (value) => {
        this.setState({ searchQuery: value })
    }

    fetchResults = () => {
        const { searchQuery } = this.state
        this.getApi(searchQuery)
        .then((response) => {
            this.setState({ Songs: response.results, count: response.resultCount, prevSearchQuery: searchQuery })
        })
    }

    goBack = () => {
        const { navigation } = this.props
        navigation.navigate('SongList', {
            Favorited: this.state.Favorited
        })
    }

    addToFavorites = (Song) => {
        const { favFromSearch } = this.props.route.params
        let { Songs } = this.state
        Song.isInFavorites = true
        let idx = Songs.findIndex((e) => e.trackId == Song.trackId)
        if(idx > -1) { //found
            Songs[idx] = Song
        }
        this.setState({ Songs })
        favFromSearch(Song)
    }

    removeFromFavorites = (Song) => {
        const { unfavFromSearch } = this.props.route.params
        let { Songs } = this.state
        Song.isInFavorites = false
        let idx = Songs.findIndex((e) => e.trackId == Song.trackId)
        if(idx > -1) { //found
            Songs[idx] = Song
        }
        idx = Songs.findIndex((e) => e.trackId == Song.trackId)
        this.setState({ Songs })
        unfavFromSearch(Song)
    }

    goToFavorites = () => { 
        this.props.navigation.navigate('Favorites', { 
            Songs: [], 
            removeFromFavorites: this.removeFromFavorites,
            addToFavorites: this.addToFavorites
        }) 
    };

    renderItem = ({ item, index }) => (
        <SongItem trackData={item} isInFavorites={item.isInFavorites} addToFavorites={() => this.addToFavorites(item)} removeFromFavorites={() => this.removeFromFavorites(item)} key={index} />
    );

    render() {
        const { Songs, isLoading, count, searchQuery, prevSearchQuery } = this.state
        return (
            <>
                <Appbar.Header dark={false} style={{ backgroundColor: 'turquoise' }}>
                    <TouchableOpacity onPress={this.goBack}>
                        <Ionicons name='chevron-back' size={24} color='black' />
                    </TouchableOpacity>
                    <Appbar.Content title={`Searching for "${prevSearchQuery}"`} />
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
                    {
                        isLoading ? (
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <ActivityIndicator size={'large'}/>
                            </View>
                        ) : (
                            <FlatList
                                style={{ flex: 1 }}
                                data={Songs}
                                keyExtractor={(item) => item.trackId}
                                extraData={Songs}
                                renderItem={this.renderItem}
                                ListFooterComponent={<Footer length={count}/>}
                                ListFooterComponentStyle={{ alignItems: 'center' }}
                                showsVerticalScrollIndicator={false}
                            />
                        )
                    }
                </View>
            </>
        );
    }
}

const Footer = ({length}) => {
    return (
        <View style={{ margin: 10 }}>
            <Text>Showing {length} results</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 8,
    },
});