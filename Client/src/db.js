import Dexie from 'dexie';

const db = new Dexie('ChatDB');
db.version(1).stores({
    online_users: "id, name",
    chatting_users: "id, name",
    chatstore: "++id, room, msg_from, msg_to, msg_time, msg"
});

export default db;