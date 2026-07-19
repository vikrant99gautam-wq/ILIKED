export default function AdminSettingsPage() {
  return (
    <div>
      <div className="flex justify-between items-end mb-8 border-b-[4px] border-black pb-4">
        <h1 className="font-cartoon text-5xl text-black">STORE SETTINGS</h1>
      </div>

      <div className="bg-white border-[4px] border-black shadow-[6px_6px_0_#111] p-8 flex flex-col items-center justify-center text-center h-[50vh]">
        <h2 className="font-cartoon text-4xl text-black mb-4">WORK IN PROGRESS</h2>
        <p className="font-bold text-lg text-gray-700 max-w-md">
          Store settings, branding options, and billing information will be available here soon.
        </p>
      </div>
    </div>
  );
}
