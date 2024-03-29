import React from 'react';
import FRHeader, { IRef } from 'components/FRHeader';
import FRContainer from 'components/FRContainer';
import { shallow } from 'zustand/shallow';
import useRecordStore from 'store/useRecordStore';
import FRRanking from 'components/FRRanking';
import { useQuery } from 'react-query';
import { fetchGetUsers, fetchWaistlineRankUsers, fetchWeightRankUsers } from 'services/apis';
import { User } from 'types';
import FRSearchBar from 'components/FRSearchBar';
import FRUsersList from 'components/FRUsersList';

const Ranking: React.FC = () => {
  const { user, needUpdateRanking, onSetNeedUpdateRanking, onSetOpenPanel } = useRecordStore(
    (state) => {
      return {
        user: state.user,
        needUpdateRanking: state.needUpdateRanking,
        onSetNeedUpdateRanking: state.onSetNeedUpdateRanking,
        onSetOpenPanel: state.onSetOpenPanel,
      };
    },
    shallow,
  );

  const [weightRankUsers, setWeightRankUsers] = React.useState<User[] | []>([]);
  const [waistlineRankUsers, setWaistlineRankUsers] = React.useState<User[] | []>([]);

  // 使用者搜尋框輸入的文字
  const [search, setSearch] = React.useState<string>('');
  // 從資料庫獲取到的所有使用者資料
  const [users, setUsers] = React.useState<User[] | []>([]);
  // 根據使用者搜尋框輸入的文字篩選出來的使用者
  const [filteredUsers, setFilteredUsers] = React.useState<User[] | []>([]);

  // 控制顯示userList component
  const [showSearch, setShowSearch] = React.useState<boolean>(false);

  // popover panel ref
  const panelRef = React.useRef<IRef>(null);
  // search area ref
  const searchAreaRef = React.useRef<HTMLDivElement>(null);

  const [showX, setShowX] = React.useState<boolean>(false);

  // 畫面點擊時，如果element沒有包含在popoverRef底下的話，就關閉panel
  window.addEventListener('mousedown', (e) => {
    if (
      panelRef.current &&
      !panelRef.current.getDiv().contains(e.target as HTMLElement) &&
      !panelRef.current.getButton().contains(e.target as HTMLElement)
    ) {
      onSetOpenPanel(false);
    }
    if (searchAreaRef.current && !searchAreaRef.current.contains(e.target as HTMLElement)) {
      setShowSearch(false);
      setShowX(false);
    }
  });

  // fetch api
  // 體重排名
  const weightRank = useQuery('weightRank', fetchWeightRankUsers);

  // 腰圍排名
  const waistlineRank = useQuery('waistlineRank', fetchWaistlineRankUsers);

  // 使用者搜尋欄所有使用者資料
  const getAllUsers = useQuery('getAllUsers', fetchGetUsers);

  // 當使用者資料回傳後，設定使用者資料
  React.useEffect(() => {
    if (getAllUsers.isSuccess && !getAllUsers.isLoading && !getAllUsers.isError) {
      setUsers(getAllUsers.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllUsers.data]);

  // 當排名資料回傳後，設定排名資料
  React.useEffect(() => {
    if (weightRank.isSuccess && !weightRank.isLoading && !weightRank.isError) {
      setWeightRankUsers(weightRank.data.users);
    }

    if (waistlineRank.isSuccess && !waistlineRank.isLoading && !waistlineRank.isError) {
      setWaistlineRankUsers(waistlineRank.data.users);
    }
  }, [weightRank, setWeightRankUsers, waistlineRank, setWaistlineRankUsers]);

  // 獲取最新的排名資訊
  const refetchAll = React.useCallback(() => {
    weightRank.refetch();
    waistlineRank.refetch();
    onSetNeedUpdateRanking(false);
  }, [onSetNeedUpdateRanking, waistlineRank, weightRank]);

  // 當needUpdateRanking為true時，就refetch
  React.useEffect(() => {
    if (needUpdateRanking) {
      refetchAll();
    }
  }, [needUpdateRanking, refetchAll]);

  return (
    <>
      <FRHeader ref={panelRef} />
      <FRContainer>
        {/* search */}
        <div
          className='relative my-4 flex w-full justify-center lg:my-8 lg:justify-start'
          ref={searchAreaRef}
        >
          <FRSearchBar
            currentUserId={user?.id as number}
            users={users}
            search={search}
            showX={showX}
            onSetSearch={setSearch}
            onSetFilteredUsers={setFilteredUsers}
            onSetShowSearch={setShowSearch}
            onSetShowX={setShowX}
          />
          {showSearch && search !== '' && (
            <div className='absolute left-5 top-12 box-border flex w-[90%] justify-center rounded-xl bg-gray-100 px-3 py-2 dark:bg-[#262626] lg:left-0 lg:ml-4 lg:w-[480px]'>
              <FRUsersList filteredUsers={filteredUsers} search={search} />
            </div>
          )}
        </div>

        {/* ranking */}
        <div className='lg:mt-4 lg:flex lg:justify-center'>
          {/* left */}
          <div className='mb-4 box-border w-full p-2 shadow-xl dark:shadow-gray-400/40 lg:mx-4 lg:w-[512px]'>
            <FRRanking
              title='減重'
              users={weightRankUsers as User[]}
              isLoading={weightRank.isLoading}
              limit={10}
              user={user as User}
            />
          </div>
          {/* right */}
          <div className='mb-4 w-full p-2 shadow-xl dark:shadow-gray-400/40 lg:mx-4 lg:w-[512px]'>
            <FRRanking
              title='腰瘦'
              users={waistlineRankUsers as User[]}
              isLoading={waistlineRank.isLoading}
              limit={10}
              user={user as User}
            />
          </div>
        </div>
      </FRContainer>
    </>
  );
};

export default React.memo(Ranking);
