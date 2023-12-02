const { DataTypes } = require("sequelize");
const { DB } = require("../connect");
class UserModel {
	constructor() {
		this.db = DB.connection;
		this.schema = DB.connection.define(
			"users",
			{
				id: {
					type: DataTypes.STRING,
					allowNull: false,
					primaryKey: true,
				},
				first_name: {
					type: DataTypes.STRING,
				},
				last_name: {
					type: DataTypes.STRING,
				},
				email: {
					type: DataTypes.STRING,
					unique: true,
				},
				password: {
					type: DataTypes.STRING(355),
				},
				phone_number: {
					type: DataTypes.STRING(355),
				},
				gender: {
					type: DataTypes.STRING(255),
				},
				salt: {
					type: DataTypes.STRING(255),
				},
				verified: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
				},
				email_notification: {
					type: DataTypes.BOOLEAN,
					defaultValue: true,
				},
				sms_notification: {
					type: DataTypes.BOOLEAN,
					defaultValue: true,
				},
				created_at: {
					type: DataTypes.DATE,
					defaultValue: this.db.literal("CURRENT_TIMESTAMP"),
					allowNull: false,
				},
				updated_at: {
					type: DataTypes.DATE,
					defaultValue: this.db.literal("CURRENT_TIMESTAMP"),
					allowNull: false,
				},
			},
			{
				timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
				hooks: {
					beforeUpdate(user) {
						user.setDataValue("updated_at", new Date()); // Update the updated_at field before saving
					},
				},
			},
			{
				indexes: [
					{
						unique: true, // Ensures that the values in this index are unique
						fields: ["email"], // The field(s) you want to create an index on
					},
				],
			},
			{
				schema: "public",
			},
			{
				underscored: true,
			}
		);
	}
}

module.exports = UserModel;
