import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash-es';
import { ServiceErrorManager } from '../../helpers/service';
import { SearchService } from '../services/Search';
import { useParams } from 'react-router-dom';
import { User } from '../types/partialUser';

const useUserList = ({ limit }: { limit: number }) => {
  const { id: userId } = useParams();
  const [userList, setUserList] = useState<Array<User>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchUserList = async (searchTerm?: string, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const [_, data] = await ServiceErrorManager(
        SearchService({
          data: {
            options: {
              select: '-themConfig -password -refreshToken',
              limit,
              page: reset ? 1 : page,
            },
            query: {
              _id: { $ne: userId },
              isVerified: { $ne: false },
              search: searchTerm,
              searchFields: ['name'],
            },
          },
        }),
        { failureMessage: 'Error while fetching user list' }
      );
      const users = data?.docs || [];
      setUserList((prev) => {
        const existingIds = new Set(prev.map((user) => user._id));
        const uniqueUsers = users.filter(
          (usr: User) => !existingIds.has(usr._id)
        );
        return reset ? users : [...prev, ...uniqueUsers];
      });
      setHasMore(!!data.nextPage);
      if (!reset) setPage((prev) => prev + 1);
    } catch (err) {
      console.error('Error fetching user list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const searchUser = useCallback(
    debounce(async (searchTerm) => {
      await fetchUserList(searchTerm, true);
    }, 340),
    []
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    await fetchUserList();
  }, [loading, hasMore, fetchUserList]);

  return { searchUser, userList, loading, loadMore, hasMore };
};

export default useUserList;
