import mongoose from 'mongoose';
import { envVars } from '../config/env';
import { User } from '../modules/user/user.model';

const seedAdminStandalone = async (): Promise<void> => {
    try {
        // Connect to database
        const mongoUri = envVars.MONGODB_URI;
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            email: 'admin@parceldelivery.com',
            password: 'Admin123!',
            name: 'System Administrator',
            phone: '+8801700000000',
            role: 'admin',
            address: {
                street: '123 Admin Street',
                city: 'Dhaka',
                state: 'Dhaka Division',
                zipCode: '1000',
                country: 'Bangladesh',
            },
            isVerified: true,
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully');
        console.log('📧 Email: admin@parceldelivery.com');
        console.log('🔑 Password: Admin123!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        process.exit(1);
    }
};

// Run if this file is executed directly
if (require.main === module) {
    seedAdminStandalone();
}

export default seedAdminStandalone;
