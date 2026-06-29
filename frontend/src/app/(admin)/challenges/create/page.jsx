'use client';

import dynamic from 'next/dynamic';

const CreateChallengeWizard = dynamic(() => import('@/views/industry/challenges/create'));

export default function CreateChallengePage() {
  return <CreateChallengeWizard />;
}
