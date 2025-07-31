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
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
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

              {/* Social Media */}
              <div className="flex gap-2">
                <a
                  className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                  href="#0"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-6 w-6 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
                  </svg>
                </a>
                <a
                  className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                  href="#0"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-6 w-6 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.335 28H2.667V12.667h15.668V28ZM10.5 11.5C8.567 11.5 7 9.933 7 8s1.567-3.5 3.5-3.5S14 6.067 14 8s-1.567 3.5-3.5 3.5Zm17.5 16.5h-4.332v-6.5c0-1.567-.933-2.5-2.5-2.5s-2.5.933-2.5 2.5v6.5h-4.332V12.667h4.332v2.5c.933-1.567 2.5-2.5 4.5-2.5 3.067 0 5.5 2.433 5.5 5.5v10.333Z" />
                  </svg>
                </a>
                <a
                  className="flex items-center justify-center text-indigo-500 transition hover:text-indigo-400"
                  href="#0"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-6 w-6 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14.023 24L14 17h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V14H21l-1 3h-2.72v7h-3.257z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
