import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native'
import { Camera } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { Ionicons } from '@expo/vector-icons'
import * as Speech from 'expo-speech'

export default ({ navigation }) => {
  const [permissao, setPermissao] = useState(null)
  const [cameraVisivel, setCameraVisivel] = useState(false)
  const [tipoCamera, setTipoCamera] = useState(Camera.Constants.Type.back)
  const [previewVisivel, setPreviewVisivel] = useState(false)
  const [imagemCapturada, setImagemCapturada] = useState(null)
  const [flashAtivado, setFlashAtivado] = useState('off')
  const cameraRef = useRef(null)

  useEffect(() => {
    Speech.speak(
      'Olá, voce esta no aplicativo IFARSCANQR, clique em qualquer lugar da tela para abrir o leitor de QRCode.'
    )
  }, [])

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setPermissao(status === 'granted')
    })()
  }, [])

  const abrirCamera = async () => {
    setCameraVisivel(true)
  }

  const ativarFlash = () => {
    if (flashAtivado === 'on') {
      setFlashAtivado('off')
    } else if (flashAtivado === 'off') {
      setFlashAtivado('on')
    } else {
      setFlashAtivado('auto')
    }
  }

  const alterarCamera = () => {
    if (tipoCamera === 'back') {
      setTipoCamera('front')
    } else {
      setTipoCamera('back')
    }
  }

  const tirarFoto = async () => {
    try {
      if (cameraRef.current) {
        const foto = await cameraRef.current.takePictureAsync()
        setPreviewVisivel(true)
        setImagemCapturada(foto)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const tirarOutraFoto = async () => {
    setImagemCapturada(null)
    setPreviewVisivel(false)
    abrirCamera()
  }

  const handleBarCodeScanned = ({ data }) => {
    Speech.speak(data, {
      onDone: () => {
        setTimeout(() => {
          Speech.speak(
            'clique em qualquer lugar da tela para abrir o leitor de QRCode.'
          )
        }, 1000)
      }
    })
    setCameraVisivel(false)
  }

  const salvarFoto = async () => {
    try {
      MediaLibrary.requestPermissionsAsync()
      const arquivo = await MediaLibrary.createAssetAsync(imagemCapturada.uri)
      MediaLibrary.createAlbumAsync('ExpoCamera', arquivo)
        .then(() => {
          Alert.alert('Foto salva!')
        })
        .catch(error => {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View style={styles.container}>
      {cameraVisivel && permissao ? (
        <Camera
          style={styles.camera}
          type={tipoCamera}
          flashMode={flashAtivado}
          ref={cameraRef}
          onBarCodeScanned={handleBarCodeScanned}
        >
          <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity onPress={ativarFlash}>
              <Text style={styles.buttonText}>
                {flashAtivado === 'on' ? (
                  <Ionicons name="flash-sharp" size={30} color="yellow" />
                ) : (
                  <Ionicons name="flash-outline" size={30} color="white" />
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.viewBtnFoto}>
            <TouchableOpacity onPress={salvarFoto}>
              <View style={styles.viewFoto}>
                <ImageBackground
                  style={{ flex: 1 }}
                  source={{ uri: imagemCapturada && imagemCapturada.uri }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={tirarFoto}>
              <View style={styles.botaoFoto} />
            </TouchableOpacity>
            <TouchableOpacity onPress={alterarCamera}>
              <Text style={styles.buttonText}>
                {tipoCamera === 'front' ? (
                  <Ionicons name="camera-reverse" size={35} color="white" />
                ) : (
                  <Ionicons
                    name="camera-reverse-outline"
                    size={35}
                    color="white"
                  />
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <TouchableOpacity style={styles.button} onPress={abrirCamera}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    flex: 1,
    backgroundColor: '#5f9ea0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 200,
    paddingHorizontal: 250
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  camera: {
    flex: 1,
    width: '100%'
  },

  viewBtnFoto: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  viewFoto: {
    backgroundColor: '#404040',
    width: 50,
    height: 70
  },

  botaoFoto: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: '#fff'
  }
})
