import React from "react"
import { AntDesign } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { Avatar, Button, Card, Title } from "react-native-paper"

export default ({ isInFavorites, addToFavorites, removeFromFavorites, trackData }) => {
    const { navigate } = useNavigation()
    return (
      <Card style={{ margin: 5 }} >
        <Card.Title
          title={(
            <Title onPress={() => navigate('SongDetails', {
              songData: trackData,
              removeFromFavorites: removeFromFavorites,
              addToFavorites: addToFavorites
            })}>
              {trackData.trackName}
            </Title>
          )}
          subtitle={trackData.artistName}
          style={{ paddingVertical: 10, paddingHorizontal: 15 }}
          leftStyle={{ marginRight: 25 }}
          left={(props) => (
            <Avatar.Image
              size={50}
              source={{ uri: trackData.artworkUrl100.replace('100x100', '600x600') }}
            />
          )}
          right={() => (
            <Button onPress={isInFavorites ? removeFromFavorites : addToFavorites}>
              <AntDesign name='heart' size={25} color={isInFavorites ? 'tomato' : 'lightgray'} />
            </Button>
          )}
        />
      </Card>
    )
  }