import React, { useState } from 'react';
import {
  View,
  Image,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';

interface FileItem {
  uri: string;
  caption: string;
}

interface FileReviewPageProps {
  files: FileItem[];
  onSubmit: (files: FileItem[]) => void;
}

const FileReviewPage: React.FC<FileReviewPageProps> = ({ files, onSubmit }) => {
  const [fileList, setFileList] = useState<FileItem[]>(files);

  const handleCaptionChange = (index: number, caption: string) => {
    const updatedFiles = [...fileList];
    updatedFiles[index].caption = caption;
    setFileList(updatedFiles);
  };

  const handleSubmit = () => {
    onSubmit(fileList);
  };

  return (
    <View style={styles.container}>
      <SwiperFlatList
        showPagination
        paginationStyleItem={styles.pagination}
        data={fileList}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item.uri }}
              style={styles.image}
              resizeMode='contain'
            />
            <TextInput
              style={styles.captionInput}
              placeholder='Add a caption...'
              value={item.caption}
              onChangeText={(text) => handleCaptionChange(index, text)}
            />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <View style={styles.footer}>
        <Text onPress={handleSubmit} style={styles.submitButton}>
          Submit
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: { width: '100%', height: '70%' },
  captionInput: {
    marginTop: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    fontSize: 16,
  },
  footer: { padding: 16, backgroundColor: '#fff', alignItems: 'center' },
  submitButton: { color: '#007bff', fontSize: 16 },
  pagination: { marginBottom: 10 },
});

export default FileReviewPage;
