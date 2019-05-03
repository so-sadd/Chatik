import Dexie from 'dexie';

const db = new Dexie('ChatDB');
db.version(1).stores({
    chatname: "name, id",
    chatstore: "++id, chat_name, msg_from, msg_to, msgtime, msg"
});

export default db;