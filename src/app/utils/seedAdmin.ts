/* eslint-disable no-console */
import { envVars } from "../config/env";
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedAdmin = async () => {
    try {
        const isAdmin = await User.findOne({
            email: envVars.ADMIN_EMAIL,
        });

        if (isAdmin) {
            console.log("Admin already exists.");
            return;
        }

        const hashedPassword = await bcryptjs.hash(
            envVars.ADMIN_PASSWORD,
            parseInt(envVars.BCRYPT_SALT_ROUNDS)
        );
        const payload: IUser = {
            name: "Admin",
            role: Role.ADMIN,
            email: envVars.ADMIN_EMAIL,
            password: hashedPassword,
            phone: envVars.ADMIN_PHONE,
            address: "admin address",
        };
        const Admin = await User.create(payload);
        console.log("Admin seeded successfully:", Admin);
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
};
