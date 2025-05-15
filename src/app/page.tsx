import { ComplaintForm } from '@/components/complaint-form';
import { ComplaintCentralLogo } from '@/components/icons/logo';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-6 shadow-md bg-card">
        <div className="container mx-auto flex items-center justify-center sm:justify-start px-4">
          <div className="flex items-center gap-3 text-3xl font-bold text-primary">
            <ComplaintCentralLogo className="h-10 w-10" />
            <span>Complaint Central</span>
          </div>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-foreground mb-2">
              Lodge Your Complaint
            </h1>
            <p className="text-center text-muted-foreground">
              We are here to help. Please provide the details of your issue.
            </p>
          </div>
          <ComplaintForm />
        </div>
      </main>

      <footer className="py-6 text-center bg-card border-t">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Complaint Central. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
