import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <span className="font-mono text-xs uppercase px-2.5 py-1 bg-black text-[#D4AF37] font-bold">
        404 &bull; Page Not Found
      </span>
      <h1 className="text-4xl md:text-5xl font-serif">Page Does Not Exist</h1>
      <p className="text-sm text-gray-600 max-w-md">
        The route you are attempting to access is not available or has moved.
      </p>
      <div className="pt-2">
        <Link
          href="/home"
          className="px-6 py-2.5 bg-black text-white hover:bg-[#D4AF37] hover:text-black text-xs uppercase tracking-widest font-semibold transition-colors border border-black inline-block"
        >
          Return to /home
        </Link>
      </div>
    </div>
  );
}
