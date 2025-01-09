import GenerateApi from "./_components/GenerateApi";

export default function Settings() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 p-4">
      <h2 className="font-semibold text-3xl text-center">
        Generate Your API Key
      </h2>
      <GenerateApi />
    </div>
  );
}
