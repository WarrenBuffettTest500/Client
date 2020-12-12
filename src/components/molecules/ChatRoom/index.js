import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Moment from 'moment';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import { createRoom, fetchChats, createNewChat } from '../../../api/fetchChatInfomation';
import ArrowUpIcon from '@material-ui/icons/ArrowUpwardRounded';

const ChatRoom = () => {
  const {
    currentUser,
  } = useSelector(state => ({
    currentUser: state.user.currentUser,
  }));
  const messageBox = useRef(null);
  const { keyword: roomname } = useParams();
  const [chats, setChats] = useState([]);
  const [nickname, setNickname] = useState('');
  const [newchat, setNewchat] = useState({
    roomname: '',
    nickname: '',
    message: '',
    date: '',
    type: ''
  });

  const scrollToBottom = () => {
    if (!messageBox.current) return;
    messageBox.current.scrollIntoView({ behavior: 'smooth' });
  };

  const submitMessage = event => {
    const { type, key } = event;
    if (type === 'keypress' && key !== 'Enter') return;
    const chat = newchat;

    chat.roomname = roomname;
    chat.nickname = nickname;
    chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
    chat.type = 'message';
    createNewChat(chat);
    setNewchat({ roomname: '', nickname: '', message: '', date: '', type: '' });
  };

  const onChange = event => {
    event.persist();

    const { name, value } = event.target;
    setNewchat({ ...newchat, [name]: value });
  };

  useEffect(() => {
    createRoom(roomname);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setNickname(currentUser.displayName);
    fetchChats(setChats, roomname);
  }, [roomname]);

  useEffect(scrollToBottom, [newchat]);

  return (
    <div className='chatroom_wrapper'>
      <div className='chatroom_viewport_wrapper'>
        <div className='chatroom_viewport'>
          {chats.map((item, idx) => (
            <div
              ref={messageBox} key={idx} className='message_box'>
              <div className={`${item.nickname === nickname ? 'right_bubble' : 'left_bubble'}`}>
                {item.nickname === nickname ?
                  <div className='message_name'>Me</div> : <div className='message_name'>{item.nickname}</div>
                }
                <div className='message_data'> {item.date}</div>
                <p>{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='chatroom_input_wrapper'>
        {currentUser ?
          <>
            <Input
              type='text'
              name='message'
              className='message'
              placeholder='Enter message here'
              value={newchat.message}
              onKeyPress={submitMessage}
              onChange={onChange}>
            </Input>
            <Button
              className='message_button'
              onKeyPress={submitMessage}
              onClick={submitMessage} >
              <ArrowUpIcon className='arrowup_icon'></ArrowUpIcon>
            </Button>
          </>
          :
          <div className='chatroom_description'>채팅은 로그인 후 이용가능합니다 💬</div>
        }
      </div>
    </div>
  );
};

export default ChatRoom;
