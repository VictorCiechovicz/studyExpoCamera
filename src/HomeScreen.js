import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Camera } from 'expo-camera'
import Tts from 'react-native-tts'

export default () => {
  const [permissao, setPermissao] = useState(null)
  const [cameraVisivel, setCameraVisivel] = useState(false)
  const [isAudioPlay, setIsAudioPlay] = useState(false)
  const [audioPause, setAudioPause] = useState(false)
  const cameraRef = useRef(null)
  const lastPressTimeRef = useRef(0)

  useEffect(() => {
    Tts.speak(
      'Olá, você está no aplicativo IFARSCANQR, clique em qualquer lugar da tela para abrir o leitor de QRCode.'
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

  const handleBarCodeScanned = ({ data }) => {
    Tts.speak(data)
    setIsAudioPlay(true)
    setCameraVisivel(false)
  }

  const handlePause = () => {
    Tts.stop()
    setAudioPause(true)
  }


  const handleStop = () => {
    setAudioPause(false)
    setIsAudioPlay(false)
    Tts.stop()
  }

  const handleResume = async () => {
    setAudioPause(false)
    const isSpeaking = await Tts.isSpeaking();
    console.log(isSpeaking)
    if (!isSpeaking) {
      Tts.speak('oi'); 
    }
  };
  return (
    <View style={styles.container}>
      {cameraVisivel && permissao ? (
        <Camera
          style={styles.camera}
          ref={cameraRef}
          onBarCodeScanned={handleBarCodeScanned}
        ></Camera>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={
            !isAudioPlay
              ? abrirCamera
              : audioPause
              ? handleResume
              : handlePause
          }
        ></TouchableOpacity>
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
