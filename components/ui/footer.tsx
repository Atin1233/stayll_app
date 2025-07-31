import Image from "next/image";
import FooterIllustration from "@/public/images/footer-illustration.svg";

export default function Footer() {
  return (
    <footer>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Footer illustration */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2"
          aria-hidden="true"
        >
          <Image
            className="max-w-none"
            src={FooterIllustration}
            width={1076}
            height={378}
            alt="Footer illustration"
          />
        </div>
        <div className="py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Company Info */}
            <div className="text-center md:text-left">
              <div className="text-xl font-bold text-gray-200 mb-2">Stayll</div>
              <p className="text-sm text-indigo-200/65 mb-3">
                © 2024 Stayll, Inc. All rights reserved.
              </p>
              <p className="text-xs text-indigo-200/50 max-w-md">
                AI-powered rental management platform that helps landlords automate lead responses and fill units faster.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex gap-4 text-sm">
              <a
                className="text-indigo-200/65 transition hover:text-indigo-500"
                href="/privacy"
              >
                Privacy Policy
              </a>
              <a
                className="text-indigo-200/65 transition hover:text-indigo-500"
                href="/terms"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
