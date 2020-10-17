import React, { useState } from 'react';

import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { Feather } from '@expo/vector-icons'

import mapMarker from '../../assets/map-marker.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Container, CalloutContainer, CalloutText, Footer, FooterText, CreateOrphanageButton } from './styles';
import api from '../../services/apiClient';

interface OrphanageItem {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export default function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<OrphanageItem[]>([]);

    const navigation = useNavigation();

    useFocusEffect(() => {
        api.get('orphanages').then(response => {
            setOrphanages(response.data)
        })
    })

    function handleNavigateToOrphanageDetails(id: number) {
        navigation.navigate('OrphanageDetails', { id })
    }

    function handleNavigateToCreateOrphanage() {
        navigation.navigate('SelectMapPosition')
    }

    return (
        <Container>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: -20.2468369,
                    longitude: -42.0286788,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008
                }}
            >
                {orphanages.map(orphanage => {

                    return (
                        <Marker
                            key={orphanage.id}
                            icon={mapMarker}
                            calloutAnchor={{
                                x: 2.7,
                                y: 0.8
                            }}
                            coordinate={{
                                latitude: orphanage.latitude,
                                longitude: orphanage.longitude,
                            }}
                        >
                            <Callout tooltip onPress={() => { handleNavigateToOrphanageDetails(orphanage.id) }}>
                                <CalloutContainer>
                                    <CalloutText>{orphanage.name}</CalloutText>
                                </CalloutContainer>

                            </Callout>
                        </Marker>
                    )
                })}
            </MapView>

            <Footer>
                <FooterText>{orphanages.length} orfanatos encontrados</FooterText>

                <CreateOrphanageButton onPress={handleNavigateToCreateOrphanage}>
                    <Feather name="plus" size={20} color="#fff" />
                </CreateOrphanageButton>
            </Footer>
        </Container>
    )
}

const styles = StyleSheet.create({

    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        marginBottom: 0,
        paddingBottom: 0,
    },

});


