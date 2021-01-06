import { firebaseDB } from '../config/firebase';
import snapshotToArray from '../utils/snapshotToArray';

export const fetchChats = async (setChats, roomName) => {
  await firebaseDB
    .ref('chats/')
    .orderByChild('roomName')
    .equalTo(roomName)
    .limitToLast(20)
    .on('value', resp => {
      setChats([]);
      setChats(snapshotToArray(resp));
    });
};

export const createNewChat = chat => {
  const newMessage = firebaseDB.ref('chats/').push();
  newMessage.set(chat);
};
