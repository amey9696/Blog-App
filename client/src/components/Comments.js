import React from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Avatar from 'react-avatar';

const Comments = ({ comments }) => {
    // console.log("My Comments:",comments);
    return (
        <div className='comment_container'>
            <Scrollbars>
                {
                    comments.length > 0 ? comments.map(comment => (
                            <div className='commentSection' key={comment._id}>
                                <div className='post_header'>
                                    <div className='post_header_avator' style={{ background: '#ffbf00' }}>
                                        {comment.userName ? <Avatar className="mr-2" name={comment.userName} size='50' round={true} style={{border:'none'}}/> : ''}
                                    </div>
                                    <div className='post_header_user'>
                                        <span>{comment.userName}</span>
                                        <span>{moment(comment.updatedAt).format('MMM Do YY')}</span>
                                    </div>
                                </div>
                                <div className='comment_body'>
                                    {comment.comment}
                                </div>
                            </div>
                    ))
                        : 'No Comments'
                }
            </Scrollbars>
        </div>
    )

}

export default Comments;