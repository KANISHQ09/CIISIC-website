import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from '../schemas/User';
import InstitutionModel from '../schemas/Institution';
import CompanyModel from '../schemas/Company';
import { logger } from '../../config/logger';

export const seedDatabase = async (): Promise<void> => {
  try {
    // 1. Seed Default Institution
    let institution = await InstitutionModel.findOne({ code: 'LNCT' });
    if (!institution) {
      institution = await InstitutionModel.create({
        name: 'LNCT Group of Colleges',
        code: 'LNCT',
        location: 'Bhopal, Madhya Pradesh',
      });
      logger.info(`Seeded LNCT Institution: ${institution._id}`);
    }

    // 2. Seed Default Company
    let company = await CompanyModel.findOne({ name: 'Netlink Technologies' });
    if (!company) {
      company = await CompanyModel.create({
        name: 'Netlink Technologies',
        industry: 'Information Technology',
        websiteUrl: 'https://www.netlink.com',
        isCIIMember: true,
      });
      logger.info(`Seeded Netlink Company: ${company._id}`);
    }

    // 3. Seed Default Admin User
    const adminEmail = 'admin@ciisic.in';
    const adminUser = await UserModel.findOne({ email: adminEmail });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('Password@123', salt);

      const admin = await UserModel.create({
        name: 'Super Admin',
        email: adminEmail,
        passwordHash,
        role: 'SUPER_ADMIN',
        isVerified: true,
      });
      logger.info(`Seeded Super Admin user account: ${admin.email}`);
    }

    // Seed default student login credentials for easy dev/prod check
    const studentEmail = 'student@lnct.ac.in';
    const studentUser = await UserModel.findOne({ email: studentEmail });
    if (!studentUser) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('Password@123', salt);

      const student = await UserModel.create({
        name: 'Default Student Solver',
        email: studentEmail,
        passwordHash,
        role: 'STUDENT',
        isVerified: true,
      });
      logger.info(`Seeded Default Student user account: ${student.email}`);
    }

    // Seed default Industry SPOC login credentials
    const industryEmail = 'spoc@netlink.com';
    const industryUser = await UserModel.findOne({ email: industryEmail });
    if (!industryUser) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('Password@123', salt);

      const indSpoc = await UserModel.create({
        name: 'Netlink Industry SPOC',
        email: industryEmail,
        passwordHash,
        role: 'INDUSTRY_SPOC',
        isVerified: true,
      });
      logger.info(`Seeded Default Industry SPOC user account: ${indSpoc.email}`);
    }

    // Seed default Institution SPOC login credentials
    const instEmail = 'spoc@lnct.ac.in';
    const instUser = await UserModel.findOne({ email: instEmail });
    if (!instUser) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('Password@123', salt);

      const instSpoc = await UserModel.create({
        name: 'LNCT Institution SPOC',
        email: instEmail,
        passwordHash,
        role: 'INSTITUTION_SPOC',
        isVerified: true,
      });
      logger.info(`Seeded Default Institution SPOC user account: ${instSpoc.email}`);
    }
  } catch (error) {
    logger.error(`Database seeding failed: ${(error as Error).message}`);
  }
};
