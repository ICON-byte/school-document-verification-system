require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@school.edu' });
    if (existingAdmin) {
      console.log('Admin already exists. No action taken.');
      process.exit();
    }
    
    // Create admin user
    const admin = new User({
      email: 'admin@school.edu',
      password: 'admin123',
      role: 'admin',
      fullName: 'System Administrator'
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@school.edu');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();