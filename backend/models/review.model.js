// module.exports = (sequelize, DataTypes) => {
//     const Review = sequelize.define('Review', {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       doctorId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       rating: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       comment: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//     });
  
    // Review.associate = (models) => {
    //   Review.belongsTo(models.Doctor, {
    //     foreignKey: 'doctorId',
    //     as: 'doctor',
    //   });
    // };
  
//     return Review;
//   };