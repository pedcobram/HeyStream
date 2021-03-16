module.exports.up = (queryInterface, DataTypes) => {
    return queryInterface.createTable(
        "twitchs", 
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
                allowNull: true,
                type: DataTypes.STRING,
                unique: true
            }
        },
        {
            charset: "utf8"
        }
    );
};

module.exports.down = queryInterface => queryInterface.dropTable("twitchs");