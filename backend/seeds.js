const { faker } = require('@faker-js/faker');
const db = require("./models/index");

const getRandomCoordinatesWithinRadius = (lat, lon, radius) => {
  const earthRadiusKm = 6371;
  const randomDistance = Math.random() * radius;
  const randomBearing = Math.random() * 2 * Math.PI;

  const deltaLatitude = randomDistance / earthRadiusKm;
  const deltaLongitude = randomDistance / (earthRadiusKm * Math.cos((Math.PI * lat) / 180));

  const newLat = lat + deltaLatitude * Math.cos(randomBearing);
  const newLon = lon + deltaLongitude * Math.sin(randomBearing);

  return { latitude: parseFloat(newLat.toFixed(6)), longitude: parseFloat(newLon.toFixed(6)) };
};

const seedDatabase = async () => {
  try {
    await db.connection.sync({ force: true });

    console.log("Seeding database...");

    const baseLatitude = 36.89475;
    const baseLongitude = 10.19030;
    const maxRadiusKm = 5000;

    // 🔹 Seed Users (Doctors & Patients)
    const users = [];
    for (let i = 0; i < 10; i++) {
      const userCoordinates = getRandomCoordinatesWithinRadius(baseLatitude, baseLongitude, maxRadiusKm);
      users.push(await db.User.create({
        FirstName: faker.person.firstName(),
        LastName: faker.person.lastName(),
        Username: faker.internet.userName(),
        Password: faker.internet.password(),
        Email: faker.internet.email(),
        Role: faker.helpers.arrayElement(["Doctor", "Patient"]),
        media: faker.image.url(),  // Corrected for the updated faker
        specialist: faker.helpers.arrayElement(["Pediatrics", "Orthopedics", "Psychiatry", "Cardiology"]),
        LocationLatitude: userCoordinates.latitude,
        LocationLongitude: userCoordinates.longitude,
      }));
    }

    // 🔹 Seed Doctors
    const doctors = [];
    for (let i = 0; i < 5; i++) {
      const doctorCoordinates = getRandomCoordinatesWithinRadius(baseLatitude, baseLongitude, maxRadiusKm);
      doctors.push(await db.Doctor.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        specialty: faker.helpers.arrayElement(["Cardiology", "Dermatology", "Neurology"]),
        experience: faker.number.int({ min: 1, max: 20 }),
        bio: faker.lorem.sentence(),
        media: faker.image.url(),  // Updated for faker compatibility
        specialist: faker.helpers.arrayElement(["Endocrinology", "Oncology", "Gastroenterology"]),
        LocationLatitude: doctorCoordinates.latitude,
        LocationLongitude: doctorCoordinates.longitude,
      }));
    }

    // 🔹 Seed Patients
    const patients = [];
    for (let i = 0; i < 5; i++) {
      const patientCoordinates = getRandomCoordinatesWithinRadius(baseLatitude, baseLongitude, maxRadiusKm);
      patients.push(await db.Patient.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.birthdate(),
        gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
        media: faker.image.url(),  // Corrected image URL
        specialist: faker.helpers.arrayElement(["General Medicine", "Rehabilitation", "Psychology"]),
        LocationLatitude: patientCoordinates.latitude,
        LocationLongitude: patientCoordinates.longitude,
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

    // 🔹 Seed Availability
    for (let i = 0; i < 5; i++) {
      await db.Availability.create({
        DoctorID: faker.helpers.arrayElement(doctors).id,
        AvailableDate: faker.date.future(),
        StartTime: "09:00",
        EndTime: "17:00",
        IsAvailable: faker.datatype.boolean(),
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
