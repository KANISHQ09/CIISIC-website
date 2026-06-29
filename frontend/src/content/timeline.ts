export interface TimelineStep {
  step: number;
  title: string;
  desc: string;
  badge: string;
}

export const timeline: TimelineStep[] = [
  {
    step: 1,
    title: 'Industry Posts Blocker',
    desc: 'Corporate sponsors register active challenges requiring specific technical expertise.',
    badge: 'Corporate Collaboration'
  },
  {
    step: 2,
    title: 'CIISIC Routes Prompt',
    desc: 'The platform dynamically matches the challenge requirements to the relevant Excellence Cell.',
    badge: 'Automated Routing'
  },
  {
    step: 3,
    title: 'Excellence Cell Evaluates',
    desc: 'Domain experts verify challenge guidelines, scoping, and validation targets.',
    badge: 'Excellence Cell Review'
  },
  {
    step: 4,
    title: 'Students Submit Solutions',
    desc: 'Student cohorts build and submit detailed approach documents to address the blocker.',
    badge: 'Verified Student Submission'
  },
  {
    step: 5,
    title: 'Institution SPOC Confirms',
    desc: 'University coordinators verify student credentials and approve solutions to prevent bias.',
    badge: 'Institution Coordination'
  },
  {
    step: 6,
    title: 'Industry Roster Accepts',
    desc: 'Corporate sponsors review anonymized proposals, unlock profiles, and schedule placements.',
    badge: 'Impact Achieved'
  }
];
export default timeline;
