import { firebaseDB } from '../config/firebase';
import snapshotToArray from '../utils/snapshotToArray';
const ref = firebaseDB.ref('rooms/');

export const createRoom = roomname => {
  ref.orderByChild('roomname').equalTo(roomname).once('value', snapshot => {
    if (snapshot.exists()) return;

    const newRoom = firebaseDB.ref('rooms/').push();

    newRoom.set(roomname);
  });
};

export const fetchChats = async (setChats, roomname) => {
  await firebaseDB.ref('chats/').orderByChild('roomname').equalTo(roomname).on('value', resp => {
    setChats([]);
    setChats(snapshotToArray(resp));
  });
};

export const createNewChat = chat => {
  const newMessage = firebaseDB.ref('chats/').push();
  newMessage.set(chat);
};
