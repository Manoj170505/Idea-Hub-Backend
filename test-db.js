// Quick database connection test
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log('Testing database connection...');
        await prisma.$connect();
        console.log('✅ Database connected successfully!');

        const userCount = await prisma.user.count();
        console.log(`📊 Total users in database: ${userCount}`);

        await prisma.$disconnect();
        console.log('✅ Connection closed');
    } catch (error) {
        console.error('❌ Database connection failed:');
        console.error(error.message);
        process.exit(1);
    }
}

testConnection();
