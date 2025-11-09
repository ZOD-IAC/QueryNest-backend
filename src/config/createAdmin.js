import User from '../models/user.js';
import bcrypt from 'bcrypt';
import multiavatar from '@multiavatar/multiavatar/esm';

const createAdmin = async () => {
  try {
    const currAdmin = await User.findOne({ role: 'admin' });
    if (currAdmin) {
      console.log(`admin: ${currAdmin.email} \n pass : Admin@123`);
      return;
    }

    const hashpass = await bcrypt.hash('Admin@123', 10);
    const avatar = multiavatar('Super Admin');

    const admin = User.create({
      name: 'Super Admin',
      email: 'admin@querynest.com',
      bio: "hi i'm admin , boss of this app",
      location: 'Delhi ,In',
      password: hashpass,
      role: 'admin',
      avatar: avatar,
      reputation: 99999999,
      stats: {
        quesions: 999,
        answers: 999,
        accepted: 999,
      },
    });

    console.log(
      '✅ Admin user created: \n',
      `admin: ${admin[email]} \n , pass : Admin@123`
    );
  } catch (error) {
    console.error('❌ Failed to create admin:', err.message);
  }
};

export default createAdmin;
