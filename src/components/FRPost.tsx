/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { Images } from 'types';
import FRComment from './FRComment';
import FRSlides from './FRSlides';
import FRUser from './FRUser';

type FRPostProps = {
  postUserName: string;
  date: string;
  postUserAvatar: string;
  images: Images[];
  sportCategory: string;
  weight: number;
  waistline: number;
  description: string;
  postUserId: number;
  postRecordId: number;
  currentUserId: number | null;
  onRefetch: () => void;
  onRefetchRank: () => void;
};

const FRPost = React.forwardRef<HTMLElement, FRPostProps>((props, ref) => {
  const {
    postUserName,
    date,
    postUserAvatar,
    images,
    sportCategory,
    weight,
    waistline,
    description,
    postUserId,
    postRecordId,
    currentUserId,
    onRefetch,
    onRefetchRank,
  } = props;

  const postBody = (
    <div className='pb-4 shadow-xl dark:shadow-gray-400/40 lg:my-8'>
      <FRUser
        name={postUserName}
        date={date}
        avatar={postUserAvatar}
        userId={postUserId}
        recordId={postRecordId}
        showMore={currentUserId === postUserId}
        onRefetch={onRefetch}
        onRefetchRank={onRefetchRank}
      />
      <FRSlides images={images} currentPage='post' />
      <FRComment
        sportCategory={sportCategory}
        weight={weight}
        waistline={waistline}
        description={description}
      />
    </div>
  );

  const content = ref ? <article ref={ref}>{postBody}</article> : <article>{postBody}</article>;

  return content;
});

export default React.memo(FRPost);
