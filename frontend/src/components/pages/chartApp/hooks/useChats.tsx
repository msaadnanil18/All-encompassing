import { AutoCompleteProps } from 'antd';
import { useState, useEffect } from 'react';
import { useTogglers } from '../../../hooks/togglers';
import { ServiceErrorManager } from '../../../../helpers/service';
import { SearchService } from '../../../services/Search';
import { User } from '../../../types/partialUser';
import { RenderItem } from '../UserListHeader';
import { CreateChatsService } from '../../../services/chart';
const useChats = () => {
  const [searchOptions, setSearchOptions] = useState<
    AutoCompleteProps['options']
  >([]);

  const [onSearchValue, setOnSearchValue] = useState<string>();

  const {
    open: openSearchBar,
    close: closeSearchBar,
    state: isOpenSearchBar,
  } = useTogglers(false);

  const handelOnSearchChange = (value: string) => {
    setOnSearchValue(value);
  };

  const handleSearch = async () => {
    const [err, data] = await ServiceErrorManager(
      SearchService({
        data: {
          query: { name: onSearchValue },
        },
      }),
      {}
    );
    if (err) return;

    setSearchOptions(
      (data?.data || []).map((d: User) => ({
        label: <RenderItem resource={d} />,
        value: (d?._id || '') as string,
      }))
    );
  };

  useEffect(() => {
    handleSearch();
  }, [onSearchValue]);

  const handelOnCreateCharSelect = async (value: string) => {
    closeSearchBar();
    const [err, data] = await ServiceErrorManager(
      CreateChatsService({
        data: {
          payload: {
            receiver: value,
          },
        },
      }),
      {}
    );
  };

  const togglers = {
    selectUserToChat: { openSearchBar, closeSearchBar, isOpenSearchBar },
  };

  const actions = {
    handelOnSearchChange,
    handelOnCreateCharSelect,
  };
  const states = {
    searchOptions,
  };
  return { togglers, actions, states };
};
export default useChats;
