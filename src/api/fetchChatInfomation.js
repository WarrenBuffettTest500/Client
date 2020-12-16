import { firebaseDB } from '../config/firebase';
import snapshotToArray from '../utils/snapshotToArray';
const ref = firebaseDB.ref('rooms/');

export const createRoom = roomName => {
  ref.orderByChild('roomName').equalTo(roomName).once('value', snapshot => {
    if (snapshot.exists()) return;

    const newRoom = firebaseDB.ref('rooms/').push();

    newRoom.set(roomName);
  });
};

export const fetchChats = async (setChats, roomName) => {
  await firebaseDB.ref('chats/').orderByChild('roomName').equalTo(roomName).limitToLast(100).on('value', resp => {
    setChats([]);
    setChats(snapshotToArray(resp));
  });
};

export const createNewChat = chat => {
  const newMessage = firebaseDB.ref('chats/').push();
  newMessage.set(chat);
};
