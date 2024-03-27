import { sequelize } from "../db";
import { DataTypes } from 'sequelize';
import {v4 as uuidv4} from 'uuid';

const ReplyThread = sequelize.define('reply_threads', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: uuidv4(),
    },
    ticketId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'tickets',
            key: 'id',
        }
    },
    replyParentId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'reply_threads', // Reference to the same table
            key: 'id',
        }
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Anonymous",
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isInternal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    timestamps: true
});

// Self-referential association to support a hierarchy of replies
ReplyThread.hasMany(ReplyThread, { as: 'Replies', foreignKey: 'replyParentId' });
ReplyThread.belongsTo(ReplyThread, { as: 'Parent', foreignKey: 'replyParentId' });

export default ReplyThread;
