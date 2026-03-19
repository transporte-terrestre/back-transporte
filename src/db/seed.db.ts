import { seedPasajeros } from '@seed/pasajero.seed';

async function seed() {
  try {
    console.log('🚀 Starting database seeding...\n');

    // ... (rest of commented out seeds)

    // 5. Seeds - Seeding is handled via separate commands normally
    // await seedTallerSucursal(); // Removed due to restructuring

    console.log('\n✨ Database seeding process finished (Note: most seeds are commented out)');

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
