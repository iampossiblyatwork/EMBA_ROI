export function Header() {
  return (
    <header className="bg-spartan-green text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1 ring-2 ring-spartan-kelly">
          <img
            src="/spartan.png"
            alt="Michigan State Spartan logo"
            className="h-full w-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight sm:text-xl">
            Michigan State Executive MBA
          </h1>
          <p className="text-xs font-medium text-spartan-cream/80 sm:text-sm">
            Return on Investment Calculator
          </p>
        </div>
      </div>
    </header>
  );
}
