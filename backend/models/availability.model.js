module.exports = (sequelize, DataTypes) => {
    const Availability = sequelize.define(
      "Availability",
      {
        AvailabilityID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        DoctorID: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        AvailableDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        StartTime: {
          type: DataTypes.STRING, // Store as string for time
          allowNull: false,
        },
        EndTime: {
          type: DataTypes.STRING, // Store as string for time
          allowNull: false,
        },
        IsAvailable: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        timestamps: false,
        tableName: "availability",
      }
    );
  
    return Availability;
  };
  