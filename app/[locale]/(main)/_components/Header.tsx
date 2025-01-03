import LanguageSwitcher from "@/components/sharing/LanguageSwitcher";

export default function Header() {
  return (
    <header className="shadow-md bg-card h-20">
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-center flex-wrap gap-5">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
