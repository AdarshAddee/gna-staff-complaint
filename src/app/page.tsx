import { ComplaintForm } from '@/components/complaint-form';
import { ComplaintCentralLogo } from '@/components/icons/logo';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 md:py-6 shadow-md bg-card">
        <div className="container mx-auto flex items-center justify-center sm:justify-start px-4">
          <div className="flex items-center gap-2 md:gap-3 text-2xl md:text-3xl font-bold text-primary">
            <ComplaintCentralLogo className="h-8 w-8 md:h-10 md:w-10" />
            <span>GNA University</span>
          </div>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-center text-foreground mb-1 md:mb-2">
              GNA IT Support Team
            </h1>
            <p className="text-center text-sm md:text-base text-muted-foreground">
              We are here to help. Please provide the details of your issue.
            </p>
          </div>
          <ComplaintForm />
        </div>
      </main>

      <footer className="py-6 text-center bg-card border-t">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GNA University. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
