import { sequelize } from "../db";
import { DataTypes } from "sequelize";
import {v4 as uuidv4} from 'uuid';
import ReplyThread from "./replyThread.model";

export enum TicketStatus {
    NEW = "new",
    IN_PROGRESS = "in-progress",
    RESOLVED = "resolved",
}

export function generateSlug(title: string) {
    return title
      .toLowerCase() // Convert the title to lowercase
      .replace(/[^\w\s]/gi, "") // Remove all non-word characters
      .trim() // Trim whitespace from both ends
      .replace(/\s+/g, "-"); // Replace spaces with dashes
  }


const Ticket = sequelize.define('tickets', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: true, //TODO: Set to false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: ["new", "in-progress", "resolved"],
        defaultValue: "new",
        allowNull: false,
    },
});

Ticket.hasMany(ReplyThread, { as: 'replies', foreignKey: 'ticketId' });

export default Ticket;
