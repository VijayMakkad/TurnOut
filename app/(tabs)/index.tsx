import { CameraView, useCameraPermissions } from 'expo-camera';
import { RNCamera as Camera } from 'react-native-camera';
import { useState } from 'react';
import { View } from 'react-native';
import { YStack, H1, XStack, Button as TamaguiButton, Text, Image } from 'tamagui';
import * as ImagePicker from 'expo-image-picker';
import scanImg from '../../assets/qr-code-scan.png';
import flipImg from '../../assets/flip.png';
import flashImg from '../../assets/flash.png';
import imgImg from '../../assets/image.png';
import closeImg from '../../assets/close.png';
import jsQR from 'jsqr';
import { useRouter } from 'expo-router';

export default function Home() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [qrLink, setQrLink] = useState('');
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const router = useRouter();
  const [scanTime, setScanTime] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      scanQRCodeFromImage(uri);
    }
  };

  const scanQRCodeFromImage = async (uri: any) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        setQrLink(qrCode.data);
        router.push({ pathname: '/history', params: { qrLink: qrCode.data } });
      } else {
        alert('No QR code found in the image.');
      }
    };
  };

  if (!permission) {
    return <YStack flex={1} />;
  }

  if (!permission.granted) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <H1 textAlign="center">We need your permission to show the camera</H1>
        <TamaguiButton onPress={requestPermission}>Grant Permission</TamaguiButton>
      </YStack>
    );
  }

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    const currentTime = new Date();
    const formattedTime = `${currentTime.toLocaleDateString()} ${currentTime.toLocaleTimeString()}`;
    setScanTime(formattedTime);
    alert(`Qr code with data ${data} has been scanned at ${formattedTime}`);
    router.push({ pathname: '/history', params: { qrLink: data, scanTime: formattedTime } });
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const closeCamera = () => {
    setScanned(false);
  };

  const resetScan = () => {
    setScanned(false);
  };

  const closeImage = () => {
    setImage(null);
  };

  const toggleFlash = () => {
    setFlash((currentFlash: any) =>
      currentFlash === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  return (
    <YStack flex={1}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417'],
        }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        facing={facing}
        flashMode={flash}
      />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            width: 250,
            height: 250,
            borderColor: 'transparent',
            borderWidth: 2,
            borderRadius: 15,
            position: 'absolute',
          }}
        />
        <View
          style={{
            width: 50,
            height: 50,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderTopWidth: 10,
            borderLeftWidth: 10,
            position: 'absolute',
            top: '35%',
            left: '25%',
            borderLeftColor: 'rgb(255, 196, 0)',
            borderTopColor: 'rgb(255, 196, 0)',
          }}
        />
        <View
          style={{
            width: 50,
            height: 50,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderTopWidth: 10,
            borderRightWidth: 10,
            position: 'absolute',
            top: '35%',
            right: '25%',
            borderRightColor: 'rgb(255, 196, 0)',
            borderTopColor: 'rgb(255, 196, 0)',
          }}
        />
        <View
          style={{
            width: 50,
            height: 50,
            borderBottomRightRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomWidth: 10,
            borderLeftWidth: 10,
            position: 'absolute',
            bottom: '35%',
            left: '25%',
            borderLeftColor: 'rgb(255, 196, 0)',
            borderBottomColor: 'rgb(255, 196, 0)',
          }}
        />
        <View
          style={{
            width: 50,
            height: 50,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomWidth: 10,
            borderRightWidth: 10,
            position: 'absolute',
            bottom: '35%',
            right: '25%',
            borderRightColor: 'rgb(255, 196, 0)',
            borderBottomColor: 'rgb(255, 196, 0)',
          }}
        />
      </View>

      <XStack
        position="relative"
        display="flex"
        gap={10}
        justifyContent="space-between"
        padding="$3"
        right="$3"
        marginTop="$7"
        marginLeft="$3">
        <TamaguiButton
          size="$5"
          borderColor="rgb(255, 196, 0)"
          backgroundColor="#333"
          onPress={closeCamera}>
          <Image src={scanImg} height={40} width={40}></Image>
        </TamaguiButton>
        <TamaguiButton
          size="$5"
          borderColor="rgb(255, 196, 0)"
          backgroundColor="#333"
          onPress={toggleCameraFacing}>
          <Image src={flipImg} height={40} width={40}></Image>
        </TamaguiButton>
        <TamaguiButton
          size="$5"
          borderColor="rgb(255, 196, 0)"
          backgroundColor="#333"
          onPress={toggleFlash}>
          <Image src={flashImg} height={40} width={40}></Image>
        </TamaguiButton>
        <TamaguiButton
          size="$5"
          borderColor="rgb(255, 196, 0)"
          backgroundColor="#333"
          onPress={pickImage}>
          <Image src={imgImg} height={40} width={40}></Image>
        </TamaguiButton>
      </XStack>

      {image && (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Image source={{ uri: image }} style={{ width: '100%', height: '105%' }} />
          <Text>Uploaded Image</Text>
          <TamaguiButton
            height={35}
            width={35}
            borderRadius={100}
            backgroundColor="#D3D3D3"
            onPress={closeImage}
            borderColor="rgb(255, 196, 0)"
            style={{ position: 'absolute', top: 20, right: 20 }}>
            <Image src={closeImg} height={50} width={50}></Image>
          </TamaguiButton>
        </YStack>
      )}
    </YStack>
  );
}
