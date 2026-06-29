"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const genai_1 = require("@google/genai");
const logger_1 = require("../../config/logger");
const Proposal_1 = __importDefault(require("../../database/schemas/Proposal"));
const Challenge_1 = __importDefault(require("../../database/schemas/Challenge"));
class AIService {
    aiClient;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.aiClient = new genai_1.GoogleGenAI({ apiKey });
            logger_1.logger.info('Gemini AI Client initialized successfully.');
        }
        else {
            logger_1.logger.warn('GEMINI_API_KEY is not defined. AI Service will operate in fallback mode.');
        }
    }
    async analyzeProposalSimilarity(proposalId) {
        const target = await Proposal_1.default.findById(proposalId);
        if (!target) {
            throw new Error('Proposal not found');
        }
        const proposals = await Proposal_1.default.find({ _id: { $ne: target._id }, isDeleted: { $ne: true } }).exec();
        // Fallback heuristic check if Gemini is offline
        if (!this.aiClient) {
            const matches = proposals.map((p) => {
                const intersection = p.title.split(' ').filter((word) => target.title.includes(word)).length;
                const score = p.title.split(' ').length > 0 ? (intersection / p.title.split(' ').length) * 100 : 0;
                return {
                    proposalId: p._id,
                    title: p.title,
                    similarityPercentage: Math.round(score)
                };
            });
            return {
                mode: 'fallback',
                highestSimilarityScore: matches.length > 0 ? Math.max(...matches.map((m) => m.similarityPercentage)) : 0,
                matches: matches.filter((m) => m.similarityPercentage > 20)
            };
        }
        try {
            const context = `Compare this target proposal:
Title: ${target.title}
Abstract: ${target.abstract}

Against these database proposals:
${proposals.map((p) => `ID: ${p._id}\nTitle: ${p.title}\nAbstract: ${p.abstract}`).join('\n---\n')}

Return a valid JSON output matching this schema:
{
  "highestSimilarityScore": number,
  "matches": [
    { "proposalId": "string", "title": "string", "similarityPercentage": number }
  ]
}`;
            const response = await this.aiClient.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: context,
                config: {
                    responseMimeType: 'application/json'
                }
            });
            return JSON.parse(response.text || '{}');
        }
        catch (err) {
            logger_1.logger.error(`Gemini call error in analyzeProposalSimilarity: ${err.message}`);
            return { highestSimilarityScore: 0, matches: [], error: err.message };
        }
    }
    async generateReviewerAssistantSummary(proposalId) {
        const proposal = await Proposal_1.default.findById(proposalId);
        if (!proposal) {
            throw new Error('Proposal not found');
        }
        if (!this.aiClient) {
            return {
                summary: `Bullet summary (heuristic fallback):
- Title: ${proposal.title}
- Overview: Abstract details of ${proposal.title} outline engineering approach parameters.`,
                keyInnovation: 'Feasibility analysis pending API activation.',
                scoreEstimate: 7
            };
        }
        try {
            const context = `Summarize this proposal abstract into key bullet points and evaluate its potential score (1-10):
Title: ${proposal.title}
Abstract: ${proposal.abstract}

Return a valid JSON output matching this schema:
{
  "summary": "string",
  "keyInnovation": "string",
  "scoreEstimate": number
}`;
            const response = await this.aiClient.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: context,
                config: {
                    responseMimeType: 'application/json'
                }
            });
            return JSON.parse(response.text || '{}');
        }
        catch (err) {
            logger_1.logger.error(`Gemini call error in generateReviewerAssistantSummary: ${err.message}`);
            return { summary: 'Error generating summary', error: err.message };
        }
    }
    async recommendChallengesForStudent(skills) {
        const challenges = await Challenge_1.default.find({ isDeleted: { $ne: true } }).exec();
        if (!this.aiClient) {
            // Heuristic intersection match
            return challenges.map((c) => {
                const matchCount = c.tags.filter((tag) => skills.includes(tag)).length;
                return {
                    challenge: c,
                    relevanceScore: matchCount * 25 // 4 matching tags = 100%
                };
            }).sort((a, b) => b.relevanceScore - a.relevanceScore);
        }
        try {
            const context = `Given these student skills: [${skills.join(', ')}]
Recommend from these challenges based on tech stack fit:
${challenges.map((c) => `ID: ${c._id}\nTitle: ${c.title}\nTags: ${c.tags.join(', ')}`).join('\n---\n')}

Return a valid JSON list matching this schema:
[
  { "challengeId": "string", "relevanceScore": number }
]`;
            const response = await this.aiClient.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: context,
                config: {
                    responseMimeType: 'application/json'
                }
            });
            const parsed = JSON.parse(response.text || '[]');
            return parsed.map((item) => {
                const ch = challenges.find((c) => c._id.toString() === item.challengeId);
                return {
                    challenge: ch,
                    relevanceScore: item.relevanceScore
                };
            }).filter((item) => item.challenge !== undefined);
        }
        catch (err) {
            logger_1.logger.error(`Gemini call error in recommendChallengesForStudent: ${err.message}`);
            return [];
        }
    }
    async extractSkillsFromResume(text) {
        if (!this.aiClient) {
            // Simple word token extraction fallback
            const commonSkills = ['Node', 'Express', 'React', 'MongoDB', 'Python', 'Java', 'TypeScript'];
            return commonSkills.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()));
        }
        try {
            const context = `Extract technical skills and tags from this text:
${text}

Return a valid JSON output matching this schema:
{
  "skills": ["string"]
}`;
            const response = await this.aiClient.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: context,
                config: {
                    responseMimeType: 'application/json'
                }
            });
            const parsed = JSON.parse(response.text || '{}');
            return parsed.skills || [];
        }
        catch (err) {
            logger_1.logger.error(`Gemini call error in extractSkillsFromResume: ${err.message}`);
            return [];
        }
    }
}
exports.AIService = AIService;
