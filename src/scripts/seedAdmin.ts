import { User } from '../modules/user/user.model';

const seedAdmin = async (): Promise<void> => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            return; // Don't exit, just return
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

        // Don't call process.exit() - just return
        return;
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        throw error; // Throw error instead of process.exit()
    }
};

export default seedAdmin;
