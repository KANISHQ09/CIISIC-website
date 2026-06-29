import React from 'react';
import { notFound } from 'next/navigation';
import { Briefcase, ArrowRight, ShieldCheck, FileText, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

const mockChallenges = [
  {
    id: "ch-101",
    title: "IoT Soil Moisture Telemetry Optimizations",
    category: "Agritech & Bio-Sciences",
    companyName: "Netlink Technologies Ltd",
    cellTheme: "agritech",
    skills: ["Raspberry Pi", "LoRaWAN", "Python", "MQTT"],
    reward: "Paid Internship & Prototyping Grant",
    description: "Optimize IoT sensor networks and LoRaWAN telemetry packages for agricultural moisture sensors deployed across dry-land research zones in Madhya Pradesh. The student team must optimize power management states and MQTT queue schedules.",
    requirements: [
      "Submit schematic routing designs with power constraints under 1.2mA active.",
      "Write telemetry queue buffers supporting offline state persistence.",
      "Support LoRaWAN SF10 network configurations."
    ],
    submissionTimeline: "Applications close August 15, 2026. Phase 1 evaluation begins September 1, 2026."
  },
  {
    id: "ch-102",
    title: "Bio-Fuel Catalyst Viscosity Enhancement",
    category: "Clean Energy",
    companyName: "Dilip Buildcon Energy",
    cellTheme: "energy",
    skills: ["Chemical Engineering", "Catalysis", "Viscosity Mapping"],
    reward: "Direct Placement Key Offer",
    description: "Design catalyst configurations to reduce biodiesel sedimentation and improve fluid kinetics under temperature extremes. Student researchers will gain access to corporate labs for chemical testing.",
    requirements: [
      "Formulate sediment analysis templates using mass balance models.",
      "Develop viscosity simulation profiles using MATLAB/ASPEN.",
      "Adhere to zero carbon fuel safety criteria."
    ],
    submissionTimeline: "Applications close September 1, 2026. Evaluation begins September 20, 2026."
  },
  {
    id: "ch-103",
    title: "EV Thermal Runaway Pre-Emptive Alarm Loop",
    category: "Automotive & Smart mobility",
    companyName: "Som Distilleries & R&D Labs",
    cellTheme: "automotive",
    skills: ["Battery Management Systems", "Arduino", "SolidWorks"],
    reward: "National Grand Challenge Nominee",
    description: "Develop automated firmware loops that detect early thermal surges inside lithium-ion battery modules before hardware damage or venting occurs.",
    requirements: [
      "Design localized analog circuit sensors feeding central controllers.",
      "Code Arduino pre-emptive thermal warning triggers under 5ms latency.",
      "Perform heat distribution simulations in SolidWorks/ANSYS."
    ],
    submissionTimeline: "Applications close August 30, 2026. Active hacking starts October 5, 2026."
  },
  {
    id: "ch-104",
    title: "AI Crop Health Diagnostic Computer Vision",
    category: "Agritech & Bio-Sciences",
    companyName: "Vardhman Yarns R&D",
    cellTheme: "agritech",
    skills: ["PyTorch", "OpenCV", "TensorFlow", "React Native"],
    reward: "Corporate Sponsorship & Incubation",
    description: "Build deep learning classification pipelines that identify insect pest profiles from phone cameras in low-bandwidth rural zones.",
    requirements: [
      "Train pest classification models under 25MB total model size.",
      "Provide Android/iOS wrappers for client offline diagnostics.",
      "Deliver dataset annotation proof logs."
    ],
    submissionTimeline: "Applications close October 10, 2026. Mentorship matching begins October 25, 2026."
  }
];

export default async function ChallengeDetailPage(props) {
  const params = await props.params;
  const challengeId = params.id?.toLowerCase();

  const challenge = mockChallenges.find(
    (ch) => ch.id === challengeId
  );

  if (!challenge) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12 text-left">
        
        {/* Header */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="px-3 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold uppercase tracking-wider text-blue-900 border border-blue-200">
              {challenge.category}
            </span>
            <span className="text-xs font-mono font-bold text-neutral-400 uppercase">{challenge.id}</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-neutral-500 uppercase">
              Posted by {challenge.companyName}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              {challenge.title}
            </h1>
          </div>
        </div>

        {/* Challenge details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-zinc-200 pt-8">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-900">Problem Description</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                {challenge.description}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-900">Technical Requirements</h3>
              <ul className="space-y-2.5">
                {challenge.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium">
                    <CheckCircle2 className="w-4.5 h-4.5 text-green-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-900">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {challenge.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-bold text-neutral-600 border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Evaluation Timeline</span>
                <p className="text-xs text-neutral-700 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>Applications Active</span>
                </p>
                <p className="text-[10px] text-neutral-500 leading-relaxed pt-1.5 font-medium">
                  {challenge.submissionTimeline}
                </p>
              </div>

              <div className="border-t pt-4 space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Reward & Compensation</span>
                <p className="text-xs text-neutral-800 font-bold">{challenge.reward}</p>
              </div>
            </div>

            <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-blue-900">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wide">SPOC Verified Vetting</h4>
              </div>
              <p className="text-[10px] text-blue-950 leading-relaxed font-medium">
                This challenge is verified under CIISIC cooperation rules. Only student SPOC team accounts can submit solution approach sheets.
              </p>
            </div>
          </div>
        </div>

        {/* Apply Call to Action */}
        <div className="bg-[#0F294A] text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h4 className="text-base font-bold">Have an innovation proposal?</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Login to your student profile workspace, team up with your college faculty SPOC, and submit your proposal package.
            </p>
          </div>
          <Link href="/auth/login">
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-full shadow-md transition-all flex items-center gap-1 cursor-pointer border-none shrink-0">
              <span>Login to Submit Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
