"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../schemas/User"));
const Institution_1 = __importDefault(require("../schemas/Institution"));
const Company_1 = __importDefault(require("../schemas/Company"));
const logger_1 = require("../../config/logger");
const seedDatabase = async () => {
    try {
        // 1. Seed Default Institution
        let institution = await Institution_1.default.findOne({ code: 'LNCT' });
        if (!institution) {
            institution = await Institution_1.default.create({
                name: 'LNCT Group of Colleges',
                code: 'LNCT',
                location: 'Bhopal, Madhya Pradesh',
                email: 'info@lnct.ac.in',
                address: 'Kalchuri Nagar, Raisen Road',
                state: 'Madhya Pradesh',
                city: 'Bhopal',
            });
            logger_1.logger.info(`Seeded LNCT Institution: ${institution._id}`);
        }
        // 2. Seed Default Company
        let company = await Company_1.default.findOne({ name: 'Netlink Technologies' });
        if (!company) {
            company = await Company_1.default.create({
                name: 'Netlink Technologies',
                industry: 'Information Technology',
                websiteUrl: 'https://www.netlink.com',
                isCIIMember: true,
            });
            logger_1.logger.info(`Seeded Netlink Company: ${company._id}`);
        }
        // 3. Seed Default Admin User
        const adminEmail = 'admin@ciisic.in';
        const adminUser = await User_1.default.findOne({ email: adminEmail });
        if (!adminUser) {
            const salt = await bcryptjs_1.default.genSalt(12);
            const passwordHash = await bcryptjs_1.default.hash('Password@123', salt);
            const admin = await User_1.default.create({
                name: 'Super Admin',
                email: adminEmail,
                passwordHash,
                role: 'SUPER_ADMIN',
                isVerified: true,
            });
            logger_1.logger.info(`Seeded Super Admin user account: ${admin.email}`);
        }
        // Seed default student login credentials for easy dev/prod check
        const studentEmail = 'student@lnct.ac.in';
        const studentUser = await User_1.default.findOne({ email: studentEmail });
        if (!studentUser) {
            const salt = await bcryptjs_1.default.genSalt(12);
            const passwordHash = await bcryptjs_1.default.hash('Password@123', salt);
            const student = await User_1.default.create({
                name: 'Default Student Solver',
                email: studentEmail,
                passwordHash,
                role: 'STUDENT',
                isVerified: true,
            });
            logger_1.logger.info(`Seeded Default Student user account: ${student.email}`);
        }
        // Seed default Industry SPOC login credentials
        const industryEmail = 'spoc@netlink.com';
        const industryUser = await User_1.default.findOne({ email: industryEmail });
        if (!industryUser) {
            const salt = await bcryptjs_1.default.genSalt(12);
            const passwordHash = await bcryptjs_1.default.hash('Password@123', salt);
            const indSpoc = await User_1.default.create({
                name: 'Netlink Industry SPOC',
                email: industryEmail,
                passwordHash,
                role: 'INDUSTRY_SPOC',
                isVerified: true,
            });
            logger_1.logger.info(`Seeded Default Industry SPOC user account: ${indSpoc.email}`);
        }
        // Seed default Institution SPOC login credentials
        const instEmail = 'spoc@lnct.ac.in';
        const instUser = await User_1.default.findOne({ email: instEmail });
        if (!instUser) {
            const salt = await bcryptjs_1.default.genSalt(12);
            const passwordHash = await bcryptjs_1.default.hash('Password@123', salt);
            const instSpoc = await User_1.default.create({
                name: 'LNCT Institution SPOC',
                email: instEmail,
                passwordHash,
                role: 'INSTITUTION_SPOC',
                isVerified: true,
            });
            logger_1.logger.info(`Seeded Default Institution SPOC user account: ${instSpoc.email}`);
        }
    }
    catch (error) {
        logger_1.logger.error(`Database seeding failed: ${error.message}`);
    }
};
exports.seedDatabase = seedDatabase;
