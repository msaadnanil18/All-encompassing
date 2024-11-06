import { StyleSheet } from 'react-native';
import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';

import NewUserListAutocomplete from './NewUserListAutocomplete';

const NewUserListDrawer = ({
  refRBSheet,
  userId,
}: {
  refRBSheet: any;
  userId: string;
}) => {
  return (
    <RBSheet
      ref={refRBSheet}
      closeOnPressMask={true}
      height={435}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        container: {
          // backgroundColor: '#1C1F26',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        },
        draggableIcon: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <NewUserListAutocomplete userId={userId} />
    </RBSheet>
  );
};

export default React.memo(NewUserListDrawer);

const styles = StyleSheet.create({});
