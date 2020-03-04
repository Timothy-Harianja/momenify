import React from 'react';

import './post-item.css'

const PostItem = ({imageUrl}) => (
     <img className='post-item' src={imageUrl} alt='post'/>
);

export default PostItem;