// app/cgpa-prediction/page.tsx
import CGPAPredictor from '@/components/CGPAprediction/CGPApredictor';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CGPA Predictor | Student Depression Analysis',
  description: 'Predict your CGPA based on lifestyle and time management factors',
};

export default function CGPAPredictionPage() {
  return (
    <main className="pt-20"> {/* pt-20 to account for fixed header */}
      <div className="container mx-auto px-4 py-8">
        <CGPAPredictor />
      </div>
    </main>
  );
}