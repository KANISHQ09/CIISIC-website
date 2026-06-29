"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const logger_1 = require("../../config/logger");
class QueueService {
    static instance;
    jobs;
    constructor() {
        this.jobs = new Map();
    }
    static getInstance() {
        if (!QueueService.instance) {
            QueueService.instance = new QueueService();
        }
        return QueueService.instance;
    }
    async add(name, data) {
        const job = {
            id: `job-${Math.random().toString(36).slice(2, 11)}`,
            name,
            data,
            status: 'PENDING',
            createdAt: new Date(),
        };
        this.jobs.set(job.id, job);
        logger_1.logger.info(`Job registered: ${job.name} (ID: ${job.id})`);
        // Process job asynchronously to simulate background execution workers
        this.processJob(job.id).catch((err) => {
            logger_1.logger.error(`Job execution failure on ${job.id}: ${err.message}`);
        });
        return job;
    }
    async processJob(jobId) {
        const job = this.jobs.get(jobId);
        if (!job)
            return;
        job.status = 'PROCESSING';
        logger_1.logger.info(`Job processing activated: ${job.name} (ID: ${job.id})`);
        // Simulate task processing wait
        await new Promise((resolve) => setTimeout(resolve, 1000));
        job.status = 'COMPLETED';
        job.completedAt = new Date();
        logger_1.logger.info(`Job completed: ${job.name} (ID: ${job.id})`);
    }
    getJob(jobId) {
        return this.jobs.get(jobId);
    }
    getAllJobs() {
        return Array.from(this.jobs.values());
    }
}
exports.QueueService = QueueService;
exports.default = QueueService;
