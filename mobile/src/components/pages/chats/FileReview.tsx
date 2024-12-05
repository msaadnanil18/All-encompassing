import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Image, View, Text, Spinner } from 'tamagui';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Video, { ResizeMode, VideoRef } from 'react-native-video';
import { ArrowLeft, X as CorssIcon, ArrowRight } from '@tamagui/lucide-icons';
import { useKeyboardStatus } from '@AllEcompassing/components/hooks/useKeyboardStatus';

const FileReview = ({
  setModalVisible,
  loading,
  setReviewAttachments,
  reviewAttachments,
}: any) => {
  const { isKeyboardActive } = useKeyboardStatus();
  const videoRef = useRef<VideoRef>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [fileList, setFileList] = useState<any[]>(
  //   Array.isArray(file) ? file : Array.from(file),
  // );
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardOffset(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardOffset(0);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onSwipe = (event: any) => {
    const { translationX } = event.nativeEvent;
    const SWIPE_THRESHOLD = 100;
    if (translationX < -SWIPE_THRESHOLD) {
      handleSwipeLeft();
    } else if (translationX > SWIPE_THRESHOLD) {
      handleSwipeRight();
    }
  };

  const handleSwipeLeft = () => {
    if (!isSwiping && currentIndex < reviewAttachments.length - 1) {
      setIsSwiping(true);
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => setIsSwiping(false), 300);
    }
  };

  const handleSwipeRight = () => {
    if (!isSwiping && currentIndex > 0) {
      setIsSwiping(true);
      setCurrentIndex(currentIndex - 1);
      setTimeout(() => setIsSwiping(false), 300);
    }
  };

  const handleThumbnailPress = (index: number) => {
    if (currentIndex === index) {
      const updatedFiles = reviewAttachments.filter(
        (_: any, i: any) => i !== index,
      );
      setReviewAttachments(updatedFiles);
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(index);
      setModalVisible(true);
    }
  };

  const renderFile = (file: any) => {
    if (file?.fileType?.startsWith('image')) {
      return <Image source={{ uri: file?.uri }} style={styles.filePreview} />;
    } else if (file?.fileType?.startsWith('video')) {
      return (
        <Video
          ref={videoRef}
          source={{ uri: file.uri }}
          style={styles.filePreview}
          resizeMode={ResizeMode.COVER}
          controls
          muted={false}
          repeat
        />
      );
    }
    return <Text style={styles.filePlaceholder}>Unsupported File</Text>;
  };

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Spinner size='large' />
    </View>
  ) : (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
            setReviewAttachments([]);
          }}
        >
          <CorssIcon size={28} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerText}>Review</Text>
        <TouchableOpacity>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <PanGestureHandler onGestureEvent={onSwipe}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.arrowLeft}
            onPress={handleSwipeRight}
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={32} color={currentIndex === 0 ? '#ccc' : '#000'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            {renderFile(reviewAttachments[currentIndex])}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.arrowRight}
            onPress={handleSwipeLeft}
            disabled={currentIndex === reviewAttachments.length - 1}
          >
            <ArrowRight
              size={32}
              color={
                currentIndex === reviewAttachments.length - 1 ? '#ccc' : '#000'
              }
            />
          </TouchableOpacity>
        </View>
      </PanGestureHandler>

      <FlatList
        horizontal
        data={reviewAttachments}
        contentContainerStyle={{ paddingBottom: 16 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleThumbnailPress(index)}
            style={[
              styles.thumbnailWrapper,
              index === currentIndex && styles.activeThumbnail,
            ]}
          >
            {item.fileType.startsWith('image') ? (
              <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            ) : (
              <Text style={styles.thumbnailPlaceholder}>File</Text>
            )}
          </TouchableOpacity>
        )}
        style={styles.thumbnailList}
      />

      <KeyboardAvoidingView
        style={[styles.captionContainer, { marginBottom: keyboardOffset }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <TextInput
            style={styles.captionInput}
            placeholder='Write a caption...'
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  saveButton: { color: '#007AFF', fontSize: 16 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
  },
  filePreview: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  filePlaceholder: { fontSize: 16, color: '#888' },
  arrowLeft: { position: 'absolute', left: 16, top: '50%' },
  arrowRight: { position: 'absolute', right: 16, top: '50%' },
  thumbnailList: { paddingVertical: 16, marginTop: 150 },
  thumbnailWrapper: {
    marginHorizontal: 8,
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeThumbnail: {
    borderColor: '#007AFF',
    borderWidth: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  thumbnail: { width: 50, height: 50, borderRadius: 4 },
  thumbnailPlaceholder: { width: 50, height: 50, textAlign: 'center' },
  captionContainer: { width: '100%', paddingHorizontal: 16, zIndex: 1000 },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
});

export default FileReview;
