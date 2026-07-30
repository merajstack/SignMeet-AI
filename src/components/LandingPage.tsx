import React, { useState } from 'react';

interface LandingPageProps {
  onStartMeeting: () => void;
  onOpenExtension: () => void;
  onOpenDictionary: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartMeeting,
  onOpenExtension,
  onOpenDictionary,
}) => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'team'>('pro');

  return (
    <div className="flex flex-col w-full bg-[#f8f9ff]">
      {/* Hero Section */}
      <section className="relative w-full px-6 md:px-12 py-12 lg:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[600px] h-[600px] bg-[#0040a1]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[400px] h-[400px] bg-[#4648d4]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="w-12 h-[2px] bg-[#4648d4]"></span>
              <span className="font-label-sm text-sm uppercase tracking-widest text-[#4648d4] font-semibold">
                Revolutionizing Accessibility
              </span>
            </div>

            <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-[#121c2a] leading-tight">
              Bridge the Communication <br />
              <span className="text-[#0040a1] italic">Gap with AI</span> Sign Interpretation.
            </h1>

            <p className="font-body-lg text-lg text-[#424654] max-w-xl">
              Experience seamless, real-time sign-to-speech and speech-to-sign translation. Empowering the Deaf and hard-of-hearing community with lightning-fast AI vision.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <button
                onClick={onStartMeeting}
                className="bg-[#0040a1] text-white px-8 py-4 rounded-full font-headline-md text-lg hover:scale-105 transition-transform shadow-xl hover:bg-[#0056d2]"
              >
                Try for Free
              </button>
              <button
                onClick={onOpenExtension}
                className="bg-[#dee9fc] text-[#121c2a] px-8 py-4 rounded-full font-headline-md text-lg hover:bg-[#d9e3f6] transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[22px]">extension</span>
                Chrome Extension Demo
              </button>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-[#c3c6d6]/30 mt-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#0040a1] text-white font-bold flex items-center justify-center border-2 border-[#f8f9ff]">G</div>
                <div className="w-10 h-10 rounded-full bg-[#4648d4] text-white font-bold flex items-center justify-center border-2 border-[#f8f9ff]">M</div>
                <div className="w-10 h-10 rounded-full bg-[#00514a] text-white font-bold flex items-center justify-center border-2 border-[#f8f9ff]">S</div>
              </div>
              <span className="font-label-sm text-sm text-[#424654]">
                Trusted by 5,000+ Deaf & hard-of-hearing professionals worldwide
              </span>
            </div>
          </div>

          {/* Video Preview Card with Live AI Skeleton */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-[#27313f]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjnSvh3FrO-jia1WWbQ6TN2QyZobnvf1DOP2YfGmR8gN0kvsGcZZZVAxFvABLrlty-QBIhSUsdUDzIJAIJFA1EoRi95aMZz2Hs217WAhu0oMNJStfwbR17EzWA7i298_C4xRYkiLIWBjQzbEiJTGcbIIbAxjIG34JqOs9L9QFR4Cu-c9KXiojWEZZ2RuHFqG2YFTImsk0ViJuNQtds6tXz9dBiVSzn-sKQ8BwUY7geJus4BQ65P8iV"
                alt="Sign Language User Demo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121c2a]/60 via-transparent to-transparent"></div>

              {/* Hand Landmarks Vector Skeleton Overlay */}
              {showSkeleton && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
                  <g className="stroke-[#89f5e7] stroke-[3] fill-none">
                    <path className="animate-pulse" d="M450,550 L470,520 L500,510 L530,520 L550,550" />
                    <path d="M470,520 L475,480" />
                    <path d="M500,510 L505,460" />
                    <path d="M530,520 L535,485" />
                  </g>
                  <circle cx="450" cy="550" r="6" className="fill-[#89f5e7] animate-ping" />
                  <circle cx="470" cy="520" r="5" className="fill-[#89f5e7]" />
                  <circle cx="500" cy="510" r="5" className="fill-[#89f5e7]" />
                  <circle cx="530" cy="520" r="5" className="fill-[#89f5e7]" />
                  <circle cx="550" cy="550" r="5" className="fill-[#89f5e7]" />
                </svg>
              )}

              {/* Floating Caption Banner */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#f8f9ff]/90 backdrop-blur-md rounded-xl shadow-lg border-l-4 border-[#0040a1]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#ba1a1a] rounded-full animate-pulse"></div>
                    <span className="font-caption-bold text-base text-[#121c2a]">
                      AI Interpreter: "How can I help you today?"
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSkeleton(!showSkeleton)}
                    className="text-xs bg-[#0040a1] text-white px-3 py-1 rounded-full font-label-sm hover:bg-[#0056d2]"
                  >
                    {showSkeleton ? 'Hide Landmark Skeleton' : 'Show AI Skeleton'}
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative Floating Icon */}
            <div className="absolute -top-6 -right-6 p-4 bg-[#4648d4] text-white rounded-2xl shadow-xl hidden lg:block animate-bounce">
              <span className="material-symbols-outlined text-[32px]">interpreter_mode</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Logotypes */}
      <section className="w-full py-8 bg-[#eff4ff] border-y border-[#c3c6d6]/20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-wrap justify-between items-center opacity-60 font-bold text-xl md:text-2xl text-[#121c2a] gap-8">
          <span>Gallaudet</span>
          <span>Microsoft</span>
          <span>Stanford</span>
          <span>MayoClinic</span>
          <span>UNESCO</span>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full px-6 md:px-12 py-20 bg-[#f8f9ff]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-12">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl md:text-4xl text-[#121c2a]">
              Communication in <span className="text-[#4648d4]">Three Steps</span>
            </h2>
            <p className="font-body-lg text-base text-[#424654]">
              Simple, fast, and accessible for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 w-full">
            {/* Step 1 */}
            <div className="group flex flex-col items-center gap-4 p-6 bg-white border border-[#c3c6d6]/30 hover:shadow-xl transition-all rounded-3xl">
              <div className="w-20 h-20 rounded-2xl bg-[#0040a1]/10 flex items-center justify-center text-[#0040a1] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[40px]">video_call</span>
              </div>
              <h3 className="font-headline-lg text-2xl text-[#121c2a]">1. Connect</h3>
              <p className="font-body-md text-sm text-[#424654]">
                Open the SignMeet web app or browser extension during any video call or in-person meeting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group flex flex-col items-center gap-4 p-6 bg-white border border-[#c3c6d6]/30 hover:shadow-xl transition-all rounded-3xl">
              <div className="w-20 h-20 rounded-2xl bg-[#4648d4]/10 flex items-center justify-center text-[#4648d4] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[40px]">sign_language</span>
              </div>
              <h3 className="font-headline-lg text-2xl text-[#121c2a]">2. Sign</h3>
              <p className="font-body-md text-sm text-[#424654]">
                Sign naturally in front of your camera. Our AI recognizes nuances, speed, and facial expressions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group flex flex-col items-center gap-4 p-6 bg-white border border-[#c3c6d6]/30 hover:shadow-xl transition-all rounded-3xl">
              <div className="w-20 h-20 rounded-2xl bg-[#00514a]/10 flex items-center justify-center text-[#00514a] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[40px]">forum</span>
              </div>
              <h3 className="font-headline-lg text-2xl text-[#121c2a]">3. Communicate</h3>
              <p className="font-body-md text-sm text-[#424654]">
                Your signs are converted to text and voice instantly, while their speech is captioned for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Bento Grid */}
      <section className="w-full px-6 md:px-12 py-20 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-[#121c2a] mb-2">Powerful Core Features</h2>
            <div className="h-1.5 w-32 bg-[#0040a1] rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Feature 1 */}
            <div className="md:col-span-8 bg-[#f8f9ff] border border-[#c3c6d6]/30 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-1 space-y-4">
                <span className="px-3 py-1 bg-[#0040a1]/10 text-[#0040a1] rounded font-label-sm text-xs font-bold uppercase">
                  CORE AI
                </span>
                <h3 className="font-headline-lg text-2xl text-[#121c2a]">Real-Time Sign-to-Text</h3>
                <p className="font-body-md text-sm text-[#424654]">
                  Proprietary computer vision models translate ASL, BSL, and more into written text with 98.4% accuracy.
                </p>
                <button
                  onClick={onOpenDictionary}
                  className="text-[#0040a1] font-bold text-sm flex items-center gap-1 hover:underline"
                >
                  Explore 5,000+ ASL Signs Dictionary <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-[#dee9fc] rounded-2xl overflow-hidden relative border border-[#c3c6d6]/30">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-T7EqAEjuWLeSyoa7JIuUyPMFVRqBsYeHJeKhjg0uZUEVEYzAPJIERrv874rG5CQkn4BXZOaHm6mxKcvb3nOHUrmQWiTZS0AiOJoyQkp7aVJzlzh_8GgycFP3gSik_c6sleiolxw4kYv_rdPNlF1YKW5AopZVwDPkEae8Q0wGYjUo7_EOjzcj5Or6FHv-2kIk6M13yNEHv2JbUdmLVGwWh2rsHz4ewu_t-S86IGLAKb9bq4WIaO1_"
                  alt="3D Hand Landmark Tracking"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="md:col-span-4 bg-[#4648d4] text-white rounded-3xl p-8 flex flex-col justify-between shadow-lg">
              <span className="material-symbols-outlined text-[48px]">closed_caption</span>
              <div className="space-y-2 mt-8">
                <h3 className="font-headline-lg text-2xl">Live Captions</h3>
                <p className="font-body-md text-sm opacity-90">
                  High-fidelity transcription of spoken words for immediate understanding during meetings.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="md:col-span-4 bg-[#00514a] text-white rounded-3xl p-8 flex flex-col justify-between shadow-lg">
              <span className="material-symbols-outlined text-[48px]">translate</span>
              <div className="space-y-2 mt-8">
                <h3 className="font-headline-lg text-2xl">Multi-Language</h3>
                <p className="font-body-md text-sm opacity-90">
                  Support for ASL, BSL, Auslan, IS and 100+ spoken languages, breaking international barriers.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-8 bg-[#eff4ff] border border-[#c3c6d6]/30 rounded-3xl p-8 flex flex-col md:flex-row-reverse gap-8 items-center shadow-sm">
              <div className="flex-1 space-y-4">
                <h3 className="font-headline-lg text-2xl text-[#121c2a]">Chrome Integration</h3>
                <p className="font-body-md text-sm text-[#424654]">
                  One-click activation on Zoom, Google Meet, and Microsoft Teams. Floating widget overlay with customizable transparency and position.
                </p>
                <button
                  onClick={onOpenExtension}
                  className="bg-[#0040a1] text-white px-5 py-2.5 rounded-full font-label-sm text-sm hover:bg-[#0056d2]"
                >
                  Launch Extension Overlay
                </button>
              </div>
              <div className="w-full md:w-1/2 p-4 bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-inner">
                <div className="flex items-center gap-2 border-b border-[#c3c6d6]/30 pb-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#ba1a1a]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#0040a1]/40"></div>
                  <div className="w-3 h-3 rounded-full bg-[#00514a]/40"></div>
                  <span className="text-xs font-mono text-[#424654] ml-2">meet.google.com/abc-defg-hij</span>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-[#dee9fc] rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-[#dee9fc] rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users / Environment Section */}
      <section className="w-full px-6 md:px-12 py-20 bg-[#f8f9ff]">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-[#121c2a] text-center mb-16">
            Built for Every Environment
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* User 1 */}
            <div className="relative group h-[380px] rounded-3xl overflow-hidden shadow-lg cursor-pointer">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDImRwxMN6z3Dsrh5k1es6Jl1l9Y4eMiT-3vM41kJM6Sxta-OtliK0msgNOiYhaWJEiDdZkTY4TqyI6isGt_zGIxlIkjfj7sStzLLR-sxnGutZDViirlFTzQaEVlQpmiT4JexLcZ3Qmd6FVuZQ_FfQlRZ6yKOSZ6D2xwHyb4vFWxzgq7lYG40vduD6z7Ig0EwySv44xCAVy4YumkerhgEHZbRLs8rIdVoVdXR-czkUs2kgNVQfmWGHM"
                alt="Individuals"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121c2a] via-[#121c2a]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h4 className="font-headline-lg text-2xl text-white">Individuals</h4>
                <p className="font-label-sm text-sm text-white/80 mt-1">Personal freedom in every conversation.</p>
              </div>
            </div>

            {/* User 2 */}
            <div className="relative group h-[380px] rounded-3xl overflow-hidden shadow-lg cursor-pointer">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGl67t-ft01v6WZNnmVNcJu4SMqsYX9fpOmBg14AgMzxTkVnNk8s6Ev2ORNFILm4sZYKbDU-KqyDyhtg1ZTBstqmv7t9nyEuGJXYDNvMmW4BkThfZTJRot_k5kuk04ZTkqGcm_HOnEJFcCFoGy4IQ4sYgwxTof2KrkEfPZ_qCUjDB10hbFQckWMRUvPEQ_neSCxGMfL3UVvgkzWxBNEubob-Z5l3_7SoQxCBp6X7e9l3dTDLkrZTGF"
                alt="Healthcare"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121c2a] via-[#121c2a]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h4 className="font-headline-lg text-2xl text-white">Healthcare</h4>
                <p className="font-label-sm text-sm text-white/80 mt-1">Critical clarity for patient care.</p>
              </div>
            </div>

            {/* User 3 */}
            <div className="relative group h-[380px] rounded-3xl overflow-hidden shadow-lg cursor-pointer">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5yFj0AbE6r9p5Z_WF0Sg6WVGh8W-mZb1k6O_aaN-mhf6Usk9zy7LsWz5m_iNjNPsDSASum8FeUcsE3kvhgQyzVqmktf57q1kzpoMYXJ84I4HPv4OkYzO-CtnQwJxFIxiby5noY1RF5FWj0g7klJYl61Yx9YFxuyf5Ii7fiuX-5IteSw4pAjYiXEjUl6SeeXZPIkD1ck5utuiCSgWFc32PdpC7x1ro2XAHU8H-j2w9Pm0M1o_P1rCc"
                alt="Education"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121c2a] via-[#121c2a]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h4 className="font-headline-lg text-2xl text-white">Education</h4>
                <p className="font-label-sm text-sm text-white/80 mt-1">Equal access in every classroom.</p>
              </div>
            </div>

            {/* User 4 */}
            <div className="relative group h-[380px] rounded-3xl overflow-hidden shadow-lg cursor-pointer">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW0IwCrJ5mMijJOLeMA5kFH8FN_-XHwFgM3nBxABlsK2jSiaKFQqeIF1FNOs74pHgLK2HZKetSh266-xvwjAkPudkjgbvbfcSJLPhFq9-uGk1IWXFVzk0_9D8oMDqYzmIY4zBT36Lj3kHaeHzMAXkJNQVS6LQ7qv1EkqrNAaN7rBcImDeHvCVSSKnfjILd3Q4FrUTAHwOcszydGwjXCPrDaWquSBL8P2KwpS-qq12Uj026AOguzaOm"
                alt="Enterprise"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121c2a] via-[#121c2a]/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h4 className="font-headline-lg text-2xl text-white">Enterprise</h4>
                <p className="font-label-sm text-sm text-white/80 mt-1">Inclusive workspaces by default.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="w-full px-6 md:px-12 py-20 bg-white border-t border-[#c3c6d6]/20">
        <div className="max-w-[1440px] mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-[#121c2a] mb-3">Simple & Flexible Pricing</h2>
          <p className="font-body-lg text-base text-[#424654] max-w-xl mx-auto mb-12">
            Empower your team with instant sign language translation. Upgrade anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Free */}
            <div className="border border-[#c3c6d6]/40 rounded-3xl p-8 flex flex-col justify-between hover:border-[#0040a1] transition-colors">
              <div>
                <span className="font-headline-md text-xl text-[#121c2a]">Free Plan</span>
                <p className="text-xs text-[#424654] mt-1">For individuals starting out</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-[#121c2a]">$0</span>
                  <span className="text-sm text-[#424654]"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-[#424654]">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> 30 mins daily sign-to-text</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> Standard ASL recognition</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> Chrome Extension Overlay</li>
                  <li className="flex items-center gap-2 opacity-50"><span className="material-symbols-outlined text-[18px]">cancel</span> Multi-language translation</li>
                </ul>
              </div>
              <button
                onClick={onStartMeeting}
                className="mt-8 w-full py-3 rounded-full border border-[#0040a1] text-[#0040a1] font-label-sm hover:bg-[#eff4ff]"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-[#0040a1] rounded-3xl p-8 flex flex-col justify-between bg-[#eff4ff]/30 shadow-xl relative">
              <span className="absolute -top-3 right-8 bg-[#0040a1] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Most Popular
              </span>
              <div>
                <span className="font-headline-md text-xl text-[#0040a1]">Pro Plan</span>
                <p className="text-xs text-[#424654] mt-1">For active Deaf & hard-of-hearing professionals</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-[#0040a1]">$29</span>
                  <span className="text-sm text-[#424654]"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-[#121c2a]">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> Unlimited translations</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> Low-latency RunPod GPU pipeline</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> 40+ sign & 100+ spoken languages</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> Export PDF/TXT Transcripts</li>
                </ul>
              </div>
              <button
                onClick={() => alert("Simulating Stripe Checkout for Pro Plan ($29/mo)... Upgrade successful!")}
                className="mt-8 w-full py-3 rounded-full bg-[#0040a1] text-white font-label-sm hover:bg-[#0056d2] shadow-md"
              >
                Upgrade to Pro (Stripe)
              </button>
            </div>

            {/* Team Plan */}
            <div className="border border-[#c3c6d6]/40 rounded-3xl p-8 flex flex-col justify-between hover:border-[#0040a1] transition-colors">
              <div>
                <span className="font-headline-md text-xl text-[#121c2a]">Team / Enterprise</span>
                <p className="text-xs text-[#424654] mt-1">For organizations and schools</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-[#121c2a]">$99</span>
                  <span className="text-sm text-[#424654]"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-[#424654]">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> Multi-user workspace</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> Custom AI model fine-tuning</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> Admin controls & GPU monitoring</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#00514a] text-[18px]">check_circle</span> Virtual Camera Driver for Zoom/Teams</li>
                </ul>
              </div>
              <button
                onClick={() => alert("Contact Sales team requested! An enterprise advisor will reach out.")}
                className="mt-8 w-full py-3 rounded-full border border-[#121c2a] text-[#121c2a] font-label-sm hover:bg-[#121c2a] hover:text-white transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full px-6 md:px-12 py-20 bg-[#4648d4] text-white overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-8 relative z-10">
          <span className="material-symbols-outlined text-[64px] opacity-40">format_quote</span>
          <blockquote className="font-display text-2xl md:text-3xl max-w-4xl leading-relaxed">
            "SignMeet AI has completely changed how I interact with my hearing colleagues. I no longer feel like a passive observer in meetings—I am an active participant, heard and understood in real-time."
          </blockquote>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwggNTp-vJfRg34hjXVKZ-zGBvuDSOoMrLHI_cWQQurHeTrmd4tQwTS2-g-G36oxpr14UAowlw5MYBjYrpEuumnBJCQPLO5FP3Y50ka5X2ZHtB2xFK7xtJFCvyjWQ-AQ4vqYHQLOpv1ZA30UsO8wORzBzCzQac3jAHtrsCJ19SE2RFFYL4dtPr7yaDtsC32WKMMhDWpYiSQgIppc_J6P4IxPYe21lnvTqHT38T7dJ4jHBdbcDSLdKo"
                alt="Sarah Chen"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-caption-bold text-lg font-bold">Sarah Chen</p>
              <p className="font-label-sm text-xs opacity-80 uppercase tracking-widest">Senior Design Architect, ArchiTech</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full px-6 md:px-12 py-20 bg-[#f8f9ff]">
        <div className="max-w-[1440px] mx-auto bg-[#e6eeff] rounded-[48px] p-8 md:p-16 flex flex-col items-center text-center gap-6 relative overflow-hidden">
          <h2 className="font-display text-3xl md:text-4xl text-[#121c2a]">Ready to break the silence?</h2>
          <p className="font-body-lg text-lg text-[#424654] max-w-2xl">
            Join thousands of users who are using SignMeet AI to communicate without limits. Start your meeting now or try the browser extension.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onStartMeeting}
              className="bg-[#0040a1] text-white px-8 py-4 rounded-full font-headline-md text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Start Live Meeting Now
            </button>
            <button
              onClick={onOpenExtension}
              className="bg-white text-[#0040a1] border-2 border-[#0040a1]/20 px-8 py-4 rounded-full font-headline-md text-lg hover:bg-[#0040a1]/5 transition-colors"
            >
              Open Extension Widget
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#eff4ff] py-8 border-t border-[#c3c6d6]/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[#424654] font-label-sm text-sm">
          <span>© 2026 SignMeet AI. Accessibility First.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0040a1]">Privacy Policy</a>
            <a href="#" className="hover:text-[#0040a1]">Terms of Service</a>
            <a href="#" className="hover:text-[#0040a1]">Accessibility Statement (WCAG AAA)</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
