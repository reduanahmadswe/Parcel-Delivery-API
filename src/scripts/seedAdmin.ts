import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../modules/user/user.model';

dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to database
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/parcel-delivery';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('ℹ️ Admin user already exists');
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

seedAdmin();
