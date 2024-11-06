import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Input, Separator, Spinner, Stack, XStack, YStack } from 'tamagui';
import useChats from './hook/useChats';
import { User } from '@AllEcompassing/types/partialUser';
import UserListCard from './UserListCard';

const NewUserListAutocomplete = ({ userId }: { userId: string }) => {
  const {
    states: { searchQuery, SearchSuggestionsLoading, searchSuggestions },
    actons: { handelOnSearchQueryChange },
  } = useChats({ userId });

  const renderSuggestionItem = (item: User, index: number) => {
    let _prevChats = { ...item };
    if (!item.avatar) {
      _prevChats.avatar = `https://randomuser.me/api/portraits/men/${index}.jpg`;
    }

    return (
      <TouchableOpacity key={item._id}>
        <UserListCard _prevChats={_prevChats} />
        <Separator shadowColor='$blue10Light' marginVertical='$3' />
      </TouchableOpacity>
    );
  };

  return (
    <Stack padding='$4'>
      <Input
        value={searchQuery}
        onChangeText={handelOnSearchQueryChange}
        placeholder='Search...'
        paddingHorizontal='$3'
        paddingVertical='$2'
        borderColor='$borderColor'
        borderWidth={1}
        borderRadius='$4'
      />
      {SearchSuggestionsLoading && (
        <YStack alignItems='center' padding='$10'>
          <Spinner size='small' />
        </YStack>
      )}
      {!SearchSuggestionsLoading && searchSuggestions.length > 0 && (
        <ScrollView style={{ marginVertical: 20 }}>
          <YStack>
            {(searchSuggestions || []).map((item, index) =>
              renderSuggestionItem(item, index),
            )}
          </YStack>
        </ScrollView>
      )}
    </Stack>
  );
};

export default React.memo(NewUserListAutocomplete);

const styles = StyleSheet.create({});
