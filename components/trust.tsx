export default function Trust() {
  return (
    <section id="trust" className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-gray-900/50 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="h2 mb-4 text-gray-200">
              Built by Landlords, for Landlords
            </h2>
            <p className="text-xl text-indigo-200/65">
              We know your pain because we've lived it. Here's why we built Stayll.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Our Story */}
            <div>
              <h3 className="h3 mb-6 text-gray-200">
                Why We Built Stayll
              </h3>
              <div className="space-y-4 text-indigo-200/80">
                <p>
                  As landlords ourselves, we were drowning in rental inquiries. Missing leads at 2 AM, 
                  spending hours on unqualified applicants, and losing good tenants to faster responses.
                </p>
                <p>
                  We tried everything - hiring assistants, using generic templates, even working 18-hour days. 
                  Nothing worked. That's when we realized: what if AI could handle this for us?
                </p>
                <p>
                  So we built Stayll. Not just another tool, but a solution that understands the rental business 
                  because we built it from our own frustrations. Now we help landlords across the country 
                  fill units faster while getting their lives back.
                </p>
              </div>
            </div>

            {/* Team Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <h3 className="h3 mb-6 text-gray-200">
                Meet the Team
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    AJ
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Atin Jain</h4>
                    <p className="text-sm text-indigo-200/65">Founder & CEO</p>
                    <p className="text-sm text-indigo-200/60 mt-1">
                      Former landlord with 15+ properties. Built Stayll after losing $50K in missed rent due to slow responses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    MK
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Mike Chen</h4>
                    <p className="text-sm text-indigo-200/65">CTO & Co-founder</p>
                    <p className="text-sm text-indigo-200/60 mt-1">
                      AI/ML engineer with 10+ years experience. Previously at Google and Airbnb. Owns 8 rental properties.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    SL
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Sarah Lee</h4>
                    <p className="text-sm text-indigo-200/65">Head of Customer Success</p>
                    <p className="text-sm text-indigo-200/60 mt-1">
                      Property manager for 12 years. Helps landlords get the most out of Stayll and provides 24/7 support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="h4 mb-2 text-gray-200">Bank-Level Security</h3>
              <p className="text-indigo-200/65">
                SOC 2 compliant, end-to-end encryption, and GDPR compliant. Your data is as secure as your bank account.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="h4 mb-2 text-gray-200">24/7 Support</h3>
              <p className="text-indigo-200/65">
                Real humans available anytime. Average response time: 2 minutes. We're here when you need us.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="h4 mb-2 text-gray-200">Money-Back Guarantee</h3>
              <p className="text-indigo-200/65">
                30-day money-back guarantee. If Stayll doesn't help you fill units faster, we'll refund every penny.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="h3 mb-4 text-gray-200">
                Get in Touch
              </h3>
              <p className="text-xl text-indigo-200/65">
                Questions? Want to see Stayll in action? We'd love to hear from you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 mb-4">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-200 mb-2">Email</h4>
                <a href="mailto:hello@stayll.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  hello@stayll.com
                </a>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 mb-4">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-200 mb-2">Phone</h4>
                <a href="tel:+1-555-123-4567" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  (555) 123-4567
                </a>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 mb-4">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-200 mb-2">Office</h4>
                <p className="text-indigo-200/65">
                  San Francisco, CA<br />
                  United States
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 mb-4">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-200 mb-2">Response Time</h4>
                <p className="text-indigo-200/65">
                  < 2 minutes<br />
                  24/7 support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 