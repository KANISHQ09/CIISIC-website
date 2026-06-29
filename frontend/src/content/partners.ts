export interface Partner {
  id: string;
  name: string;
  type: 'ACADEMIC' | 'INDUSTRY';
  logoUrl?: string;
}

export const partners: Partner[] = [
  { id: 'part-1', name: 'LNCT Group', type: 'ACADEMIC' },
  { id: 'part-2', name: 'Jagran Lakecity University', type: 'ACADEMIC' },
  { id: 'part-3', name: 'RNTU', type: 'ACADEMIC' },
  { id: 'part-4', name: 'Oriental Group', type: 'ACADEMIC' },
  { id: 'part-5', name: 'Scope Global University', type: 'ACADEMIC' },
  { id: 'part-6', name: 'IIT Indore', type: 'ACADEMIC' },
  { id: 'part-7', name: 'IIM Indore', type: 'ACADEMIC' },
  { id: 'part-8', name: 'IIFM', type: 'ACADEMIC' },
  { id: 'part-9', name: 'CRISP', type: 'ACADEMIC' },
  { id: 'part-10', name: 'GSITS', type: 'ACADEMIC' },
  { id: 'part-11', name: 'Prestige Institute', type: 'ACADEMIC' },
  { id: 'part-12', name: 'BSSS IAS', type: 'ACADEMIC' },
  { id: 'part-13', name: 'Netlink Business Solutions', type: 'INDUSTRY' },
  { id: 'part-14', name: 'Dilip Buildcon Ltd.', type: 'INDUSTRY' }
];
export default partners;
