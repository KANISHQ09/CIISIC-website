"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalRepository = void 0;
const BaseRepository_1 = require("../../shared/repositories/BaseRepository");
const Proposal_1 = require("../../database/schemas/Proposal");
class ProposalRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Proposal_1.ProposalModel);
    }
}
exports.ProposalRepository = ProposalRepository;
