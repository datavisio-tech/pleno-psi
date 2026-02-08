import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-zinc-900 dark:to-black">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <Button variant="outline" size="lg">
          Em breve...
        </Button>
      </main>
    </div>
  );
}
