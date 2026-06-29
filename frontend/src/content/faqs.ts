export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const faqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is the role of CII in this platform?',
    answer: 'The Confederation of Indian Industry (CII) acts as the platform registry administrator, setting standards, vetting industry rosters, and auditing all academic-industry cells to ensure coordination and compliance.',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: 'How does Privacy by Design shield student data?',
    answer: 'When a student submits an approach document, their personal identifier is redacted and replaced with a unique Proposal ID. Reviewers evaluate the submission purely on technical merit. Profile details are unlocked only upon approval or direct chat initiation.',
    category: 'general'
  },
  {
    id: 'faq-3',
    question: 'What are the Excellence Cells?',
    answer: 'They are domain-focused cell chapters hosted directly by partner universities (such as Family Business, Agritech, AI, and Talent Readiness) to verify, coordinate, and review student approach submissions.',
    category: 'general'
  },
  {
    id: 'faq-4',
    question: 'Is there any cost for colleges or students?',
    answer: 'No. Under the CII coordination initiative, access, challenge filing, proposal submission, and evaluation are 100% free of cost with zero egress data fees.',
    category: 'general'
  }
];
export default faqs;
