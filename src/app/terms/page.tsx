import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              Please read these terms and conditions carefully before using our services.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By accessing and using this website, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Use License</h2>
              <p className="text-gray-600 mb-6">
                Permission is granted to temporarily download one copy of the materials on RK Enterprises Hub&apos;s 
                website for personal, non-commercial transitory viewing only.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Disclaimer</h2>
              <p className="text-gray-600 mb-6">
                The materials on RK Enterprises Hub&apos;s website are provided on an &apos;as is&apos; basis. 
                RK Enterprises Hub makes no warranties, expressed or implied, and hereby disclaims 
                and negates all other warranties.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitations</h2>
              <p className="text-gray-600 mb-6">
                In no event shall RK Enterprises Hub or its suppliers be liable for any damages 
                (including, without limitation, damages for loss of data or profit, or due to business interruption) 
                arising out of the use or inability to use the materials on RK Enterprises Hub&apos;s website.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Revisions</h2>
              <p className="text-gray-600 mb-6">
                RK Enterprises Hub may revise these terms of service at any time without notice. 
                By using this website, you are agreeing to be bound by the then current version 
                of these terms of service.
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about these Terms of Service, please contact us at 
                <a href="mailto:Info@rkenterpriseshub.com" className="text-amber-600 hover:underline">
                  Info@rkenterpriseshub.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
