import {DataTypes, Model } from  "sequelize";

import sequelize from "./connection";

export class User extends Model {}
User.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        passwordHash: {
            allowNull: false,
            type: DataTypes.CHAR(64)
        }
    },
    {
        defaultScope: {
            rawAttributes: {exclude: ["passwordHash"]}
        },
        modelName: "users",
        sequelize
    }
);

export class UserSession extends Model{}
UserSession.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
        },
        userId: {
            allowNull: false,
            references: {
                key: "id",
                model: "users"
            },
            type: DataTypes.UUID
        },
        expiresAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    },
    {
        modelName: "userSessions",
        paranoid: false,
        sequelize,
        updatedAt: false
    }
);

export class YouTube extends Model {}
YouTube.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
        },
        userId: {
            allowNull: false,
            references: {
                key: "id",
                model: "users"
            },
            type: DataTypes.UUID
        },
        access_token: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        refresh_token: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        }
    },
    {
        modelName: "youtubes",
        paranoid: false,
        sequelize,
        updatedAt: false,
        expiresAt: false,
        createdAt: false
    }
);

export class Twitch extends Model {}
Twitch.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
        },
        userId: {
            allowNull: false,
            references: {
                key: "id",
                model: "users"
            },
            type: DataTypes.UUID
        },
        access_token: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        refresh_token: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        }
    },
    {
        modelName: "twitchs",
        paranoid: false,
        sequelize,
        updatedAt: false,
        expiresAt: false,
        createdAt: false
    }
);

export class TwitchChat extends Model {}
TwitchChat.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
        },
        videoId: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        chat: {
            allowNull: true,
            type: DataTypes.STRING
        }
    },
    {
        modelName: "twitchChats",
        paranoid: false,
        sequelize,
        updatedAt: false,
        expiresAt: false,
        createdAt: false
    }
);

export class YoutubeChat extends Model {}
YoutubeChat.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
        },
        videoId: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        chat: {
            allowNull: true,
            type: DataTypes.STRING
        },
        lastTimestamp: {
            allowNull: true,
            type: DataTypes.STRING
        }
    },
    {
        modelName: "youtubeChats",
        paranoid: false,
        sequelize,
        updatedAt: false,
        expiresAt: false,
        createdAt: false
    }
);
