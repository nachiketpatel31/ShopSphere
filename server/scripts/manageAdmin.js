require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const readline = require('readline');
const { connectDB } = require('../config/db');
const User = require('../models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const run = async () => {
  try {
    await connectDB();
    const args = process.argv.slice(2);

    console.log('========================================================');
    console.log('       ShopSphere Admin User Management CLI');
    console.log('========================================================');

    // Promotion mode: node manageAdmin.js --promote user@example.com
    const promoteIndex = args.indexOf('--promote');
    if (promoteIndex !== -1) {
      let email = args[promoteIndex + 1];
      if (!email || email.startsWith('--')) {
        email = await question('Enter email address of user to promote to Admin: ');
      }

      if (!email) {
        console.error('Error: Email address is required.');
        process.exit(1);
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        console.error(`Error: No user found with email "${normalizedEmail}". Register the user first or use --create.`);
        process.exit(1);
      }

      user.role = 'admin';
      await user.save();

      console.log(`\nSUCCESS: User "${user.name}" (${user.email}) has been promoted to Admin role!`);
      rl.close();
      process.exit(0);
    }

    // Create mode: either interactive or flags
    let name = '';
    let email = '';
    let password = '';

    const nameIdx = args.indexOf('--name');
    if (nameIdx !== -1 && args[nameIdx + 1]) name = args[nameIdx + 1];

    const emailIdx = args.indexOf('--email');
    if (emailIdx !== -1 && args[emailIdx + 1]) email = args[emailIdx + 1];

    const passIdx = args.indexOf('--password');
    if (passIdx !== -1 && args[passIdx + 1]) password = args[passIdx + 1];

    if (!name) {
      name = await question('Admin Full Name: ');
    }
    if (!email) {
      email = await question('Admin Email Address: ');
    }
    if (!password) {
      password = await question('Admin Password (min 8 chars): ');
    }

    if (!name.trim() || !email.trim() || !password) {
      console.error('\nError: All fields are required.');
      rl.close();
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('\nError: Password must be at least 8 characters long for an admin account.');
      rl.close();
      process.exit(1);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.role === 'admin') {
        console.log(`\nAccount "${normalizedEmail}" already exists and is already an Admin.`);
      } else {
        const confirm = await question(`Account exists as standard user. Promote to Admin? (y/n): `);
        if (confirm.toLowerCase() === 'y') {
          existing.role = 'admin';
          await existing.save();
          console.log(`\nSUCCESS: User "${existing.name}" (${existing.email}) has been promoted to Admin!`);
        }
      }
      rl.close();
      process.exit(0);
    }

    const passwordHash = await User.hashPassword(password);
    const newAdmin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'admin'
    });

    console.log(`\nSUCCESS: Admin account created successfully!`);
    console.log(`  Name:  ${newAdmin.name}`);
    console.log(`  Email: ${newAdmin.email}`);
    console.log(`  Role:  ${newAdmin.role}`);
    console.log(`  ID:    ${newAdmin._id}`);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error(`\nCLI Error: ${error.message}`);
    rl.close();
    process.exit(1);
  }
};

run();
