import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { ChatListItemInterface } from '../types';
import { ServiceErrorManager } from '@AllEcompassing/helpers/service';
import { ChatListService } from '../service';
import { SearchService } from '@AllEcompassing/components/Services/auth';
import { debounce } from 'lodash';
import { User } from '@AllEcompassing/types/partialUser';

const useChats = ({ userId }: { userId: string }) => {
  const [chatList, setChatList] = useState<Array<ChatListItemInterface>>([]);
  const [chatListLoading, setChatListLoading] = useState<boolean>(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Array<User>>([]);
  const [SearchSuggestionsLoading, setSearchSuggestionsLoading] =
    useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchChatList = useCallback(async () => {
    setChatListLoading(true);
    const [err, data] = await ServiceErrorManager(
      ChatListService({
        data: {
          payload: {},
          options: {
            sort: { updatedAt: -1 },
            populate: [
              {
                path: 'members',

                select: '-themConfig -refreshToken -password',
              },
            ],
          },
          query: { members: userId },
        },
      }),
      { failureMessage: 'Error while featcing chat list' },
    );
    setChatListLoading(false);
    if (err || !data) return;
    setChatList(data.docs || []);
  }, []);

  const fetchSearchResult = async (searchQuery?: string) => {
    setSearchSuggestionsLoading(true);
    const [err, data] = await ServiceErrorManager(
      SearchService({
        data: {
          options: {
            select: '-themConfig -password -refreshToken',
          },
          query: {
            _id: { $ne: userId },
            isVerified: { $ne: false },
            search: searchQuery,
            searchFields: ['name'],
          },
        },
      }),
      { failureMessage: 'Error fetching suggestions' },
    );
    setSearchSuggestionsLoading(false);
    if (err || !data) return;

    setSearchSuggestions(data?.docs || []);
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSearchResult, 350),
    [],
  );

  const handelOnSearchQueryChange = (text: string) => {
    setSearchQuery(text);
    if (text.length > 1) {
      debouncedFetchSuggestions(text);
    } else {
      setSearchSuggestions([]);
    }
  };

  useEffect(() => {
    fetchChatList().catch(console.log);
    fetchSearchResult().catch(console.log);
  }, []);

  const states = useMemo(
    () => ({
      chatList,
      chatListLoading,
      searchSuggestions,
      searchQuery,
      SearchSuggestionsLoading,
    }),
    [
      chatList,
      chatListLoading,
      searchSuggestions,
      searchQuery,
      SearchSuggestionsLoading,
    ],
  );

  const actons = useMemo(
    () => ({
      handelOnSearchQueryChange,
    }),
    [handelOnSearchQueryChange],
  );

  return { states, actons };
};

export default useChats;
