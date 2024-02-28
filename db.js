const mongoose = require('mongoose');
const MONGOOSE_URI = process.env.MONGOOSE_URI;

const { User, Role } = require('./models');

const mongoConnection = () => {
    mongoose.connect(MONGOOSE_URI)
        .then(async () => {
            console.log('Connected to MongoDB');
            const isRoleExist = await Role.find({})
            const rolesToInsert = ['admin', 'faculty', 'student'];
            isRoleExist.map((data) => {
                if (!rolesToInsert.includes(data.roleName)) {
                    rolesToInsert.pop(data.roleName)
                }
            })

            if (isRoleExist.length !== 3) {
                let isRoleCreated = true;
                let adminRoleId;

                const rolePromises = rolesToInsert.map(roleName => {
                    return Role.create({ roleName })
                        .then(role => {
                            console.log(`Role '${roleName}' created successfully.`);
                            if (role.roleName === 'admin') {
                                adminRoleId = role._id;
                            }
                        })
                        .catch(error => {
                            console.error(`Error creating role '${roleName}': ${error.message}`);
                            isRoleCreated = false;
                        });
                });

                await Promise.all(rolePromises);

                if (isRoleCreated) {
                    const isAdminExist = await User.findOne({ email: 'admin@gmail.com', isDeleted: false });
                    if (!isAdminExist) {
                        User.create({
                            firstName: 'admin',
                            email: 'admin@gmail.com',
                            role: adminRoleId,
                            password: 'admin',
                        })
                            .then(res => {
                                console.log("email: ", res.email, " password: admin");
                            })
                            .catch(error => {
                                console.log(error.message);
                            });
                    }
                }
            }

        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
};

module.exports = mongoConnection;
