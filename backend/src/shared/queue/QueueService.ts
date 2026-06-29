import { logger } from '../../config/logger';

export interface Job {
  id: string;
  name: string;
  data: any;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  completedAt?: Date;
}

export class QueueService {
  private static instance: QueueService;
  private readonly jobs: Map<string, Job>;

  private constructor() {
    this.jobs = new Map();
  }

  public static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  public async add(name: string, data: any): Promise<Job> {
    const job: Job = {
      id: `job-${Math.random().toString(36).slice(2, 11)}`,
      name,
      data,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.jobs.set(job.id, job);
    logger.info(`Job registered: ${job.name} (ID: ${job.id})`);

    // Process job asynchronously to simulate background execution workers
    this.processJob(job.id).catch((err) => {
      logger.error(`Job execution failure on ${job.id}: ${err.message}`);
    });

    return job;
  }

  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'PROCESSING';
    logger.info(`Job processing activated: ${job.name} (ID: ${job.id})`);

    // Simulate task processing wait
    await new Promise((resolve) => setTimeout(resolve, 1000));

    job.status = 'COMPLETED';
    job.completedAt = new Date();
    logger.info(`Job completed: ${job.name} (ID: ${job.id})`);
  }

  public getJob(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  public getAllJobs(): Job[] {
    return Array.from(this.jobs.values());
  }
}
export default QueueService;
