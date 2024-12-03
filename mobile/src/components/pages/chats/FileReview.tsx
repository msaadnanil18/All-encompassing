import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeGesture from 'react-native-swipe-gestures';
import { ArrowBigLeft } from '@tamagui/lucide-icons';

interface File {
  uri: string;
  type: string;
  caption: string;
}

const FileReview = ({ route, navigation }: any) => {
  const { files }: { files: File[] } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fileList, setFileList] = useState(files);

  const onSwipeLeft = () => {
    if (currentIndex < fileList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCaptionChange = (text: string) => {
    const updatedFiles = [...fileList];
    updatedFiles[currentIndex].caption = text;
    setFileList(updatedFiles);
  };

  const handleSave = () => {
    console.log('Final Files:', fileList);
    navigation.goBack();
  };

  const renderFile = (file: File) => {
    if (file.type.startsWith('image')) {
      return <Image source={{ uri: file.uri }} style={styles.filePreview} />;
    }
    // Add support for other file types like video or documents
    return <Text style={styles.filePlaceholder}>Unsupported File</Text>;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SwipeGesture
        style={styles.container}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowBigLeft size={28} color='#000' />
          </TouchableOpacity>
          <Text style={styles.headerText}>Review</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {renderFile(fileList[currentIndex])}
          <TextInput
            style={styles.captionInput}
            placeholder='Add a caption...'
            value={fileList[currentIndex].caption}
            onChangeText={handleCaptionChange}
          />
        </View>
      </SwipeGesture>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filePreview: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
    resizeMode: 'contain',
  },
  filePlaceholder: {
    fontSize: 16,
    color: '#888',
  },
  captionInput: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '90%',
    padding: 10,
    fontSize: 16,
  },
});

export default FileReview;
