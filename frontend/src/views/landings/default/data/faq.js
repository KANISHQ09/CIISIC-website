// @project
import branding from '@/branding.json';

export const faq = {
  heading: 'Frequently Asked Questions',
  caption: `Answers to common queries about the ${branding.brandName} platform.`,
  defaultExpanded: 'What is CIISIC?',
  faqList: [
    {
      question: `What is the ${branding.brandName} Platform?`,
      answer: `${branding.brandName} is a state-level collaborative platform designed to link students, academic institutions, and leading industries to tackle real-world challenges through innovation. It hosts Innovation Cells and verified challenge pipelines.`,
      category: 'General'
    },
    {
      question: 'Who is eligible to participate in challenges?',
      answer:
        'All enrolled students at verified partner academic institutions can register, form teams, and apply to participate in open industry challenges.',
      category: 'General'
    },
    {
      question: 'How are Innovation & Excellence Cells set up?',
      answer:
        'Academic institutions can apply to set up a local Excellence Cell through their Institution Portal. Once verified by state administrators, designated faculty mentors can manage cell activities and student groups.',
      category: 'Excellence Cells'
    },
    {
      question: 'What resources do corporate partners provide?',
      answer:
        'Corporate partners publish challenges, provide mentoring support, share datasets, and offer internships or financial bounties to successful student groups.',
      category: 'Challenges'
    },
    {
      question: 'Who owns the intellectual property of submitted solutions?',
      answer:
        'Intellectual Property terms are defined individually for each challenge by the publishing industry partner. Students review and accept these terms during challenge registration.',
      category: 'Challenges'
    }
  ],
  getInTouch: {
    link: { children: 'Get in Touch', href: '/contact' }
  },
  categories: ['General', 'Challenges', 'Excellence Cells'],
  activeCategory: 'General'
};
