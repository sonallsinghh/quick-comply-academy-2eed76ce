import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface CertificateProps {
  courseName: string;
  completionDate: string;
  score: number;
}

const Certificate: React.FC<CertificateProps> = ({ courseName, completionDate, score }) => {
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (certificateRef.current) {
      try {
        // Dynamically import html2canvas only when needed
        const html2canvas = (await import('html2canvas')).default;
        
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: true, // Enable logging for debugging
          useCORS: true, // Enable CORS for images
        });

        const link = document.createElement('a');
        link.download = `${courseName.replace(/\s+/g, '-')}-Certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error generating certificate:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={certificateRef}
        className="relative w-[800px] h-[600px] mx-auto bg-white p-8 rounded-lg shadow-lg border-8 border-double border-primary/20"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        }}
      >
        {/* Certificate Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-gray-800 mb-2">Certificate of Completion</h1>
          <div className="w-32 h-1 bg-primary/20 mx-auto"></div>
        </div>

        {/* Certificate Content */}
        <div className="text-center space-y-6">
          <p className="text-xl text-gray-600">This is to certify that</p>
          <p className="text-3xl font-serif text-gray-800 border-b-2 border-gray-300 pb-2 mx-auto w-2/3">
            {localStorage.getItem('userName') || 'Student Name'}
          </p>
          
          <p className="text-xl text-gray-600 mt-6">
            has successfully completed the course
          </p>
          
          <p className="text-2xl font-serif text-gray-800 font-bold">
            {courseName}
          </p>
          
          <p className="text-xl text-gray-600">
            with a score of
          </p>
          
          <p className="text-3xl font-serif text-gray-800 font-bold">
            {score}%
          </p>

          <div className="mt-12 flex justify-between items-end px-12">
            <div className="text-center">
              <div className="w-48 h-px bg-gray-400"></div>
              <p className="text-gray-600 mt-2">Course Instructor</p>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">{completionDate}</p>
              <div className="w-48 h-px bg-gray-400"></div>
              <p className="text-gray-600 mt-2">Date of Completion</p>
            </div>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm text-gray-500">Verify this certificate at: verify.complyquick.com</p>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          onClick={downloadCertificate}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Certificate
        </Button>
      </div>
    </div>
  );
};

export default Certificate; 