module.exports.up = (queryInterface, DataTypes) => {
    return queryInterface.createTable(
        "twitchChats", 
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
                type: DataTypes.JSON
            }
        },
        {
            charset: "utf8"
        }
    );
};

module.exports.down = queryInterface => queryInterface.dropTable("twitchChats");