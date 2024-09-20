import { AutoCompleteProps, Select } from 'antd';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTogglers } from '../../../hooks/togglers';
import { ServiceErrorManager } from '../../../../helpers/service';
import { SearchService } from '../../../services/Search';
import { User } from '../../../types/partialUser';
import { RenderItem } from '../UserListHeader';
import { CreateChatsService, ChtListService } from '../../../services/chart';
import { ChatListItemInterface } from '../../../types/charts';
import { debounce } from 'lodash-es';
const useChats = ({ userId }: { userId: string | undefined }) => {
  const [searchOptions, setSearchOptions] = useState<
    AutoCompleteProps['options']
  >([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<User[]>([]);
  const [chatList, setChatList] = useState<ChatListItemInterface[]>([]);
  const [chatListLoading, setChatListLoading] = useState<boolean>(false);
  const {
    open: openSearchBar,
    close: closeSearchBar,
    state: isOpenSearchBar,
  } = useTogglers(false);

  const handelOnSearchChange = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 10),
    []
  );

  const fetchSearchResults = useCallback(async () => {
    const [err, data] = await ServiceErrorManager(
      SearchService({
        data: {
          query: { name: searchTerm },
        },
      }),
      {}
    );
    if (err) return;
    setSearchData(data?.data || []);
    setSearchOptions(
      (data?.data || []).map((d: User) => ({
        label: <RenderItem resource={d} />,
        value: (d?._id || '') as string,
      }))
    );
  }, [searchTerm]);

  useEffect(() => {
    fetchSearchResults();
  }, [searchTerm]);

  useEffect(() => {
    if (selectedUser) {
      const matchedUser = searchData.find((user) => user._id === selectedUser);
      setSearchTerm(matchedUser?.name || '');
    }
  }, [selectedUser]);
  const handelOnCreateChatSelect = useCallback(
    async (value: string) => {
      setSelectedUser(value);
      closeSearchBar();

      const [err, data] = await ServiceErrorManager(
        CreateChatsService({
          data: {
            payload: { receiver: value },
          },
        }),
        {}
      );

      setSearchTerm('');
    },
    [closeSearchBar]
  );

  const fetchChatList = async () => {
    setChatListLoading(true);
    const [err, data] = await ServiceErrorManager(
      ChtListService({
        data: {
          payload: {},
          options: {
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
      {}
    );
    if (err) return;
    setChatListLoading(false);
    setChatList(data.docs);
  };

  useEffect(() => {
    fetchChatList().catch(console.log);
  }, [searchOptions]);

  const togglers = useMemo(
    () => ({
      selectUserToChat: { openSearchBar, closeSearchBar, isOpenSearchBar },
    }),
    [openSearchBar, closeSearchBar, isOpenSearchBar]
  );

  const actions = useMemo(
    () => ({
      handelOnSearchChange,
      handelOnCreateChatSelect,
    }),
    [handelOnSearchChange, handelOnCreateChatSelect]
  );

  const states = useMemo(
    () => ({
      searchOptions,
      searchTerm,
      chatList,
      chatListLoading,
    }),
    [searchOptions, searchTerm, chatListLoading, chatList]
  );
  return { togglers, actions, states };
};
export default useChats;
