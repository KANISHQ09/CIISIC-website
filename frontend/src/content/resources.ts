export interface ResourceItem {
  id: string;
  title: string;
  fileSize: string;
  fileType: 'PDF' | 'DOCX';
  downloadUrl: string;
  associatedChallengeId?: string;
  associatedCell?: string;
}

export const resources: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Crop Disease Dataset Specification',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    downloadUrl: '/assets/docs/crop_disease_dataset_spec.pdf',
    associatedChallengeId: 'chal-1',
    associatedCell: 'AGRITECH'
  },
  {
    id: 'res-2',
    title: 'Madhya Pradesh Agriculture Remuneration Guide',
    fileSize: '1.8 MB',
    fileType: 'DOCX',
    downloadUrl: '/assets/docs/mp_agri_remuneration_guide.docx',
    associatedChallengeId: 'chal-1',
    associatedCell: 'AGRITECH'
  },
  {
    id: 'res-3',
    title: 'Alternative Credit Engine Design Parameters',
    fileSize: '2.5 MB',
    fileType: 'PDF',
    downloadUrl: '/assets/docs/alternative_credit_spec.pdf',
    associatedChallengeId: 'chal-2',
    associatedCell: 'AI_IN_BUSINESS'
  },
  {
    id: 'res-4',
    title: 'Family Business Corporate Governance Standards',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    downloadUrl: '/assets/docs/family_business_standards.pdf',
    associatedChallengeId: 'chal-3',
    associatedCell: 'FAMILY_BUSINESS'
  }
];
export default resources;
