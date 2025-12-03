import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(createPageUrl("Home"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
          <p className="text-slate-600 mb-8">Last updated: December 3, 2025</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed">
                We collect information you provide directly to us, including your name, email address, 
                username, and any other information you choose to provide when creating an account or 
                participating in debates on DebateMe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">2. How We Use Your Information</h2>
              <p className="text-slate-600 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Create and manage your account</li>
                <li>Match you with other debaters</li>
                <li>Send you updates, newsletters, and promotional communications (with your consent)</li>
                <li>Respond to your comments, questions, and requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Information Sharing</h2>
              <p className="text-slate-600 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Data Security</h2>
              <p className="text-slate-600 leading-relaxed">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Your Rights</h2>
              <p className="text-slate-600 leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. 
                You can also opt out of receiving promotional communications by following the unsubscribe 
                instructions in those messages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and 
                hold certain information to improve your experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Changes to This Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes 
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@debateme.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}