// Genepsyche_Backend/serviceApi/seed.js
const Service = require('./model');

const SERVICES = [
  { id: 1, name: "Medication Management" },
  { id: 2, name: "Psychosis" },
  { id: 3, name: "Depression Treatment" },
  { id: 4, name: "TeleHealth" },
  { id: 5, name: "Anxiety" },
  { id: 6, name: "Bipolar" },
  { id: 7, name: "OCD" },
  { id: 8, name: "PTSD" },
  { id: 9, name: "Gene_Sight Test" },
];

async function seedServices() {
  try {
    for (const s of SERVICES) {
      await Service.findOrCreate({ where: { name: s.name }, defaults: s });
    }
    console.log("✅ Services table seeded successfully!");
  } catch (error) {
    console.error("❌ Failed to seed services:", error.message);
  }
}

module.exports = seedServices;
