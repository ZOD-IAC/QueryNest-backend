import User from '../models/user.js';
import bcrypt from 'bcrypt';

const createAdmin = async () => {
  try {
    const currAdmin = await User.findOne({ role: 'admin' });
    if (currAdmin) {
      console.log(`admin: ${currAdmin.email} \n pass : Admin@123`);
      return;
    }

    const hashpass = await bcrypt.hash('Admin@123', 10);

    const admin = User.create({
      name: 'Super Admin',
      email: 'admin@querynest.com',
      password: hashpass,
      role: 'admin',
      reputation: 9999,
    });

    console.log(
      '✅ Admin user created: \n',
      `admin: ${admin.email} \n , pass : Admin@123`
    );
  } catch (error) {
    console.error('❌ Failed to create admin:', err.message);
  }
};

export default createAdmin;
