import React, { useState } from 'react';
import { Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../services/apiClient';

import { Container, Title, Label, Input, UploadedImagesContainer, UploadedImage, ImagesInput, SwitchContainer, NextButton, NextButtonText } from './styles';

interface OrphanageDataRouteParams {
  position: {
    latitude: number;
    longitude: number;
  }
}

export default function OrphanageData() {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as OrphanageDataRouteParams;

  async function handleSelectImage() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    if (status !== 'granted') {
      alert('Eita, precisamos de acesso ás suas fotos...')
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    })

    if (result.cancelled) {
      return;
    }

    const { uri: image } = result;

    setImages([...images, image]);
  }

  async function handleCreateOrphanage() {
    const { latitude, longitude } = params.position;
    console.log({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    });

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image,
      } as any)
    })

    await api.post('orphanages', data);
    navigation.navigate('OrphanagesMap')
  }

  return (
    <Container contentContainerStyle={{ padding: 24 }}>
      <Title>Dados</Title>

      <Label>Nome</Label>
      <Input
        value={name}
        onChangeText={setName}
      />

      <Label>Sobre</Label>
      <Input
        style={{ height: 110, textAlignVertical: 'top' }}
        value={about}
        onChangeText={setAbout}
        multiline
      />

      {/*} <Label>Whatsapp</Text>
      <Input
        style={styles.input}
  />*/}

      <Label>Fotos</Label>

      <UploadedImagesContainer>
        {images.map((image) => (
          <UploadedImage key={image} source={{ uri: image }} />
        ))}
      </UploadedImagesContainer>
      <ImagesInput onPress={handleSelectImage} >
        <Feather name="plus" size={24} color="#15B6D6" />
      </ImagesInput>

      <Title>Visitação</Title>

      <Label>Instruções</Label>
      <Input
        style={{ height: 110, textAlignVertical: 'top' }}
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />

      <Label>Horario de visitas</Label>
      <Input
        value={opening_hours}
        onChangeText={setOpeningHours}
      />

      <SwitchContainer>
        <Label>Atende final de semana?</Label>
        <Switch
          thumbColor="#fff"
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={open_on_weekends}
          onValueChange={setOpenOnWeekends}
        />
      </SwitchContainer>

      <NextButton onPress={handleCreateOrphanage}>
        <NextButtonText>Cadastrar</NextButtonText>
      </NextButton>
    </Container>
  )
}

