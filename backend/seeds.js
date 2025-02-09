const { faker } = require('@faker-js/faker');
const db = require("./models/index"); // ✅ Ensure correct import
const bcrypt = require("bcrypt");

const seedDatabase = async () => {
  try {
    await db.connection.sync({ force: true }); // Reset database
    console.log("🔄 Database reset and synced!");

    // ✅ Generate Users
    const users = await Promise.all([...Array(20)].map(async () => {
      return await db.User.create({
        FirstName: faker.person.firstName(),
        LastName: faker.person.lastName(),
        Username: faker.internet.userName(),
        Password: await bcrypt.hash("password123", 10),
        Email: faker.internet.email(),
        Role: faker.helpers.arrayElement(["Doctor", "Patient"]),
      });
    }));

    // ✅ Generate Doctors
    const doctors = await Promise.all(
      users.filter(u => u.Role === "Doctor").map(async user => {
        return await db.Doctor.create({
          Password: await bcrypt.hash("password123", 10),
          userId: user.UserID, // ✅ Matches `userId` field in Doctor model
          firstName: user.FirstName,
          lastName: user.LastName,
          email: user.Email,
          phone: faker.phone.number(),
          specialty: faker.person.jobTitle(), // ✅ Temporary single specialty
          experience: faker.number.int({ min: 1, max: 30 }),
          bio: faker.lorem.paragraph(),
          isVerified: faker.datatype.boolean(),
        });
      })
    );

    // ✅ Generate Specialties & Link to Doctors
    const specialties = ["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Radiology", "Orthopedics"];
    
    await Promise.all(doctors.map(async doctor => {
      const assignedSpecialties = faker.helpers.arrayElements(specialties, faker.number.int({ min: 1, max: 3 })); // Assign 1-3 specialties per doctor

      await Promise.all(assignedSpecialties.map(async (specialtyName) => {
        await db.Specialty.create({
          userId: doctor.userId, // ✅ Associate specialty with doctor
          name: specialtyName
        });
      }));
    }));

    // ✅ Generate Patients
    const patients = await Promise.all(
      users.filter(u => u.Role === "Patient").map(async user => {
        return await db.Patient.create({
          userId: user.UserID,
          Password: await bcrypt.hash("password123", 10),
          firstName: user.FirstName,
          lastName: user.LastName,
          email: user.Email,
          phone: faker.phone.number(),
          dateOfBirth: faker.date.past(30, new Date(2000, 0, 1)),
          gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        });
      })
    );

    // ✅ Generate Chatrooms
    const chatrooms = await Promise.all([...Array(10)].map(async () => {
      const patient = faker.helpers.arrayElement(patients);
      const doctor = faker.helpers.arrayElement(doctors);
      return await db.Chatrooms.create({
        PatientID: patient.id,
        DoctorID: doctor.id,
        StartTime: new Date(),
      });
    }));

    // ✅ Generate Chatroom Messages
    await Promise.all([...Array(30)].map(async () => {
      const chatroom = faker.helpers.arrayElement(chatrooms);
      const sender = faker.helpers.arrayElement([...patients, ...doctors]);

      return await db.ChatroomMessage.create({
        ChatroomID: chatroom.ChatroomID,
        PatientID: sender.Role === "Patient" ? sender.id : null,
        DoctorID: sender.Role === "Doctor" ? sender.id : null,
        MessageText: faker.lorem.sentence(),
        SentAt: new Date(),
      });
    }));

    // ✅ Generate Doctor Reviews
    await Promise.all([...Array(15)].map(async () => {
      const patient = faker.helpers.arrayElement(patients);
      const doctor = faker.helpers.arrayElement(doctors);
      return await db.DoctorReview.create({
        DoctorID: doctor.id,
        PatientID: patient.id,
        Rating: faker.number.int({ min: 1, max: 5 }),
        ReviewText: faker.lorem.sentence(),
        ReviewDate: new Date(),
      });
    }));

    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await db.connection.close();
  }
};

seedDatabase();
