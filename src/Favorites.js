import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import {
    Appbar
} from 'react-native-paper';
import SongItem from './SongItem';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Favorites: []
        }
    }

    async componentDidMount() {
        let Favorites = await AsyncStorage.getItem('Favorites')
        Favorites = JSON.parse(Favorites)
        this.setState({ Favorites })
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    renderItem = ({ item, index }) => {
        const { removeFromFavorites, addToFavorites } = this.props.route.params

        const setFavorites = (trackId, isFav) => {
            let { Favorites } = this.state
            let idx = Favorites.findIndex(e => e.trackId == trackId)
            if(idx > -1) { //found
                Favorites[idx].isInFavorites = isFav
            }
            this.setState({ Favorites })
        }

        const remove = () => {
            removeFromFavorites(item)
            setFavorites(item.trackId, false)
        }

        const add = () => {
            addToFavorites(item)
            setFavorites(item.trackId, true)
        }

        return (
            <SongItem trackData={item} isInFavorites={item.isInFavorites} removeFromFavorites={() => remove(item)} addToFavorites={() => add(item)} key={index} />
        )
    }

    emptyFavorites = () => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>No favorites</Text>
        </View>
    )

    render() {
        const { Favorites } = this.state
        return (
            <>
                <Appbar.Header dark={false} style={{ backgroundColor: 'darkturquoise' }}>
                    <TouchableOpacity onPress={this.goBack}>
                        <Ionicons name='chevron-back' size={24} color='black' />
                    </TouchableOpacity>
                    <Appbar.Content title='Favorites' />
                    {/* <Button onPress={goToFavorites}>
                    <AntDesign name='heart' size={25} color='black' />
                    </Button> */}
                </Appbar.Header>
                <View style={styles.content}>
                    <FlatList
                        style={{ flex: 1 }}
                        data={Favorites}
                        keyExtractor={(item) => item.trackId}
                        extraData={Favorites}
                        renderItem={this.renderItem}
                        ListEmptyComponent={this.emptyFavorites}
                        contentContainerStyle={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                    />
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