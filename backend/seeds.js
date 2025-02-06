const { faker } = require('@faker-js/faker');
const db = require("./models/index");

const seedDatabase = async () => {
  try {
    await db.connection.sync({ force: true });
    console.log("Seeding database...");

    // 🔹 Seed Users
    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push(await db.User.create({
        FirstName: faker.person.firstName(),
        LastName: faker.person.lastName(),
        Username: faker.internet.userName(),
        Password: faker.internet.password(),
        Email: faker.internet.email(),
        Role: faker.helpers.arrayElement(["Doctor", "Patient", "Admin"]),
        Bio: faker.lorem.sentence(),
        MeetingPrice: faker.finance.amount(20, 200, 2),
      }));
    }

    // 🔹 Seed Specialties
    const specialties = [];
    const specialtyNames = ["Cardiology", "Neurology", "Pediatrics", "Dermatology"];
    for (let name of specialtyNames) {
      specialties.push(await db.Specialty.create({ name }));
    }

    // 🔹 Seed Doctors
    const doctors = [];
    for (let i = 0; i < 5; i++) {
      doctors.push(await db.Doctor.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        specialty: faker.helpers.arrayElement(specialtyNames),
        experience: faker.number.int({ min: 1, max: 30 }),
        bio: faker.lorem.paragraph(),
        isVerified: faker.datatype.boolean(),
        Password: faker.internet.password(), // Added password field
      }));
    }

    // 🔹 Seed Patients
    const patients = [];
    for (let i = 0; i < 5; i++) {
      patients.push(await db.Patient.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.birthdate(),
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        Password: faker.internet.password(), // Added password field
      }));
    }

    // 🔹 Seed Appointments
    for (let i = 0; i < 5; i++) {
      await db.Appointment.create({
        PatientID: faker.helpers.arrayElement(patients).id,
        DoctorID: faker.helpers.arrayElement(doctors).id,
        AppointmentDate: faker.date.future(),
        DurationMinutes: faker.number.int({ min: 15, max: 60 }),
        Status: faker.helpers.arrayElement(["pending", "confirmed", "rejected"]),
      });
    }

    // 🔹 Seed Availability
    for (let i = 0; i < 5; i++) {
      await db.Availability.create({
        DoctorID: faker.helpers.arrayElement(doctors).id,
        AvailableDate: faker.date.future(),
        StartTime: "09:00",
        EndTime: "17:00",
        IsAvailable: true,
      });
    }

    // 🔹 Seed Chatrooms
    const chatrooms = [];
    for (let i = 0; i < 5; i++) {
      chatrooms.push(await db.Chatrooms.create({
        PatientID: faker.helpers.arrayElement(patients).id,
        DoctorID: faker.helpers.arrayElement(doctors).id,
        StartTime: faker.date.recent(),
      }));
    }

    // 🔹 Seed Chatroom Messages
    for (let i = 0; i < 10; i++) {
      await db.ChatroomMessage.create({
        ChatroomID: faker.helpers.arrayElement(chatrooms).ChatroomID,
        SenderID: faker.helpers.arrayElement(users).UserID,
        MessageText: faker.lorem.sentence(),
        SentAt: faker.date.recent(),
      });
    }

    // 🔹 Seed Doctor Reviews
    for (let i = 0; i < 5; i++) {
      await db.DoctorReview.create({
        DoctorID: faker.helpers.arrayElement(doctors).id,
        PatientID: faker.helpers.arrayElement(patients).id,
        Rating: faker.number.int({ min: 1, max: 5 }),
        ReviewText: faker.lorem.sentence(),
        ReviewDate: faker.date.past(),
      });
    }

    // 🔹 Seed Media
    for (let i = 0; i < 10; i++) {
      await db.Media.create({
        UserID: faker.helpers.arrayElement(users).UserID,
        url: faker.image.url(),
      });
    }

    console.log("✅ Database successfully seeded!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
