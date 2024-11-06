import { StyleSheet } from 'react-native';
import React, { FC } from 'react';
import { useAuth } from '../auth/useAuth';
import { Button, View, YStack } from 'tamagui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@AllEcompassing/types/screens';
import Screen from '@AllEcompassing/components/screen/screen';
import {
  Settings,
  LogOut,
  MessageSquare,
  Folder,
  Users,
} from '@tamagui/lucide-icons';

const DashBoard: FC<NativeStackScreenProps<RootStackParamList>> = (props) => {
  const { logOut } = useAuth(props);

  return (
    <Screen>
      <YStack style={styles.container}>
        <View style={styles.buttons}>
          <Button
            circular
            chromeless
            size='$3'
            onPress={() =>
              props.navigation.navigate('Chats', {
                ...(props.route.params as any),
              })
            }
            icon={<MessageSquare size='$3' />}
          />

          <Button circular chromeless size='$3' icon={<Folder size='$3' />} />

          <Button circular chromeless size='$3' icon={<Users size='$3' />} />

          <Button
            circular
            chromeless
            size='$3'
            // color={'$accentColor'}
            icon={<Settings size='$3' />}
          />

          <Button
            circular
            chromeless
            size='$3'
            icon={<LogOut size='$3' />}
            onPress={() => logOut()}
          />
        </View>
      </YStack>
    </Screen>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 20,
  },
});
