module.exports.up = (queryInterface, DataTypes) => {
    return queryInterface.createTable(
        "youtubeChats", 
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
            },
            lastTimestamp: {
                allowNull: true,
                type: DataTypes.STRING
            }
        },
        {
            charset: "utf8"
        }
    );
};

module.exports.down = queryInterface => queryInterface.dropTable("youtubeChats");