export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {/* Pulsing NC logo */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-accent font-heading font-bold text-2xl mx-auto mb-4 animate-pulse">
          NC
        </div>
        <p className="text-gray-500 text-sm font-medium">Chargement...</p>
      </div>
    </div>
  );
}
