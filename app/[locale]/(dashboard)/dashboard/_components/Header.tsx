import UserButton from "@/components/sharing/UserButton";
import MenuBar from "./MenuBar";

export default function Header() {
  return (
    <header className="shadow-md bg-card h-20">
      <div className="md:w-11/12 mx-auto h-full px-5 py-3 flex items-center justify-center flex-wrap gap-5">
        <MenuBar className="flex gap-5" />
        <UserButton className="ms-auto" />
      </div>
    </header>
  );
}
