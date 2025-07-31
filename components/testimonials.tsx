"use client";

import Image from "next/image";
import TestimonialImage01 from "@/public/images/testimonial-01.jpg";
import TestimonialImage02 from "@/public/images/testimonial-02.jpg";
import TestimonialImage03 from "@/public/images/testimonial-03.jpg";
import TestimonialImage04 from "@/public/images/testimonial-04.jpg";
import TestimonialImage05 from "@/public/images/testimonial-05.jpg";
import TestimonialImage06 from "@/public/images/testimonial-06.jpg";

export default function Testimonials() {
  return (
    <section id="testimonials">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center">
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-blue-200),var(--color-gray-50),var(--color-blue-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Loved by landlords everywhere
            </h2>
            <p className="text-lg text-blue-200/65">
              See what our customers are saying about how Stayll transformed their rental business.
            </p>
          </div>

          {/* Testimonials */}
          <div className="mx-auto grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="flex flex-col h-full p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl" data-aos="fade-up">
              <div className="flex items-center mb-4">
                <Image
                  className="rounded-full mr-4"
                  src={TestimonialImage01}
                  width={48}
                  height={48}
                  alt="Testimonial 01"
                />
                <div>
                  <div className="font-semibold text-gray-200">Sarah Johnson</div>
                  <div className="text-sm text-blue-200/65">Property Manager</div>
                </div>
              </div>
              <blockquote className="text-blue-200/65 mb-4">
                "Stayll has completely transformed how I handle rental inquiries. I went from spending hours responding to leads to having AI handle everything automatically. My occupancy rate increased by 40% in the first month!"
              </blockquote>
              <div className="flex text-yellow-400 mt-auto">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="flex flex-col h-full p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl" data-aos="fade-up" data-aos-delay={100}>
              <div className="flex items-center mb-4">
                <Image
                  className="rounded-full mr-4"
                  src={TestimonialImage02}
                  width={48}
                  height={48}
                  alt="Testimonial 02"
                />
                <div>
                  <div className="font-semibold text-gray-200">Mike Chen</div>
                  <div className="text-sm text-blue-200/65">Real Estate Investor</div>
                </div>
              </div>
              <blockquote className="text-blue-200/65 mb-4">
                "The AI lead qualification is incredible. I used to waste so much time on unqualified prospects. Now Stayll filters them out automatically and only sends me serious renters. Game changer!"
              </blockquote>
              <div className="flex text-yellow-400 mt-auto">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="flex flex-col h-full p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl" data-aos="fade-up" data-aos-delay={200}>
              <div className="flex items-center mb-4">
                <Image
                  className="rounded-full mr-4"
                  src={TestimonialImage03}
                  width={48}
                  height={48}
                  alt="Testimonial 03"
                />
                <div>
                  <div className="font-semibold text-gray-200">Emily Rodriguez</div>
                  <div className="text-sm text-blue-200/65">Landlord</div>
                </div>
              </div>
              <blockquote className="text-blue-200/65 mb-4">
                "I was losing leads at night because I couldn't respond fast enough. Stayll replies instantly 24/7 and books tours automatically. My units fill up so much faster now!"
              </blockquote>
              <div className="flex text-yellow-400 mt-auto">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="flex flex-col h-full p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl" data-aos="fade-up" data-aos-delay={300}>
              <div className="flex items-center mb-4">
                <Image
                  className="rounded-full mr-4"
                  src={TestimonialImage04}
                  width={48}
                  height={48}
                  alt="Testimonial 04"
                />
                <div>
                  <div className="font-semibold text-gray-200">David Thompson</div>
                  <div className="text-sm text-blue-200/65">Property Manager</div>
                </div>
              </div>
              <blockquote className="text-blue-200/65 mb-4">
                "The integration with Zillow and Apartments.com is seamless. I set it up once and now all my leads are handled automatically. The ROI was immediate - I'm saving 10+ hours per week!"
              </blockquote>
              <div className="flex text-yellow-400 mt-auto">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="flex flex-col h-full p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl" data-aos="fade-up" data-aos-delay={400}>
              <div className="flex items-center mb-4">
                <Image
                  className="rounded-full mr-4"
                  src={TestimonialImage05}
                  width={48}
                  height={48}
                  alt="Testimonial 05"
                />
                <div>
                  <div className="font-semibold text-gray-200">Lisa Park</div>
                  <div className="text-sm text-blue-200/65">Landlord</div>
                </div>
              </div>
              <blockquote className="text-blue-200/65 mb-4">
                "The pet policy filtering is brilliant! I used to get so many inquiries from people with pets when my building doesn't allow them. Now Stayll handles that conversation automatically."
              </blockquote>
              <div className="flex text-yellow-400 mt-auto">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="flex flex-col h-full p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl" data-aos="fade-up" data-aos-delay={500}>
              <div className="flex items-center mb-4">
                <Image
                  className="rounded-full mr-4"
                  src={TestimonialImage06}
                  width={48}
                  height={48}
                  alt="Testimonial 06"
                />
                <div>
                  <div className="font-semibold text-gray-200">Robert Kim</div>
                  <div className="text-sm text-blue-200/65">Real Estate Investor</div>
                </div>
              </div>
              <blockquote className="text-blue-200/65 mb-4">
                "I manage 50+ units and was drowning in inquiries. Stayll's automation has been a lifesaver. The personalized responses are so good that tenants think they're talking to a real person!"
              </blockquote>
              <div className="flex text-yellow-400 mt-auto">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
