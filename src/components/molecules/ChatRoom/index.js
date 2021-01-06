import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import { fetchChats, createNewChat } from '../../../api/firebaseRealtimeDb';
import ArrowUpIcon from '@material-ui/icons/ArrowUpwardRounded';

const ChatRoom = ({ currentUser }) => {
  const messageBox = useRef(null);
  const { keyword: roomName } = useParams();
  const [chats, setChats] = useState([]);
  const emptyChat = {
    roomName: '',
    message: '',
    date: '',
  };
  const [newchat, setNewchat] = useState(emptyChat);

  const scrollToBottom = () => {
    if (!messageBox.current) return;

    messageBox.current.scrollIntoView({ behavior: 'smooth' });
  };

  const submitMessage = event => {
    const { type, key } = event;

    if (type === 'keypress' && key !== 'Enter') return;

    const chat = newchat;

    chat.roomName = roomName;
    chat.nickname = currentUser.displayName;
    chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');

    createNewChat(chat);
    setNewchat(emptyChat);
  };

  const inputChangeHandler = event => {
    event.persist();

    const { name, value } = event.target;

    setNewchat({
      ...newchat,
      [name]: value,
    });
  };

  useEffect(() => {
    if (!currentUser) return;

    fetchChats(setChats, roomName);
  }, [currentUser, roomName]);

  useEffect(scrollToBottom, [newchat]);

  return (
    <div className='chatroom_wrapper'>
      <div className='chatroom_viewport_wrapper'>
        <div className='chatroom_viewport'>
          {
            chats.map((item, idx) => (
              <div
                ref={messageBox}
                key={idx}
                className='message_box'
              >
                <div className={`${item.nickname === currentUser.displayName ? 'right_bubble' : 'left_bubble'}`}>
                  {
                    item.nickname === currentUser.displayName
                      ? <div className='message_name'>Me</div>
                      : <div className='message_name'>{item.nickname}</div>
                  }
                  <div className='message_data'>{item.date}</div>
                  <p>{item.message}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className='chatroom_input_wrapper'>
        {currentUser
          ? <>
            <Input
              type='text'
              name='message'
              className='message'
              placeholder='Enter message here'
              value={newchat.message}
              onKeyPress={submitMessage}
              onChange={inputChangeHandler}>
            </Input>
            <Button
              className='message_button'
              onKeyPress={submitMessage}
              onClick={submitMessage} >
              <ArrowUpIcon className='arrowup_icon' />
            </Button>
          </>
          : <div className='chatroom_description'>
            채팅은 로그인 후 이용할 수 있습니다 💬
          </div>
        }
      </div>
    </div>
  );
};

export default ChatRoom;
