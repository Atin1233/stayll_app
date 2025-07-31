import Image from "next/image";
import FooterIllustration from "@/public/images/footer-illustration.svg";

export default function Footer() {
  return (
    <footer className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Company Info */}
            <div className="text-center md:text-left">
              <div className="text-xl font-bold text-gray-200 mb-2">Stayll</div>
              <p className="text-sm text-blue-200/65 mb-3">
                © 2025 Stayll Inc. All rights reserved.
              </p>
              <p className="text-xs text-blue-200/50 max-w-md">
                AI-powered lease and tenant intelligence platform that helps professionals understand their lease portfolio instantly.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="flex gap-4 text-sm">
                <a
                  className="text-blue-200/65 transition hover:text-blue-500"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-blue-200/65 transition hover:text-blue-500"
                  href="/terms"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-6 border-t border-gray-700/30">
            <p className="text-xs text-blue-200/50">
              Built by founders who know real estate.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
