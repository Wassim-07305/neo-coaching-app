import { MessageSquare } from "lucide-react";

export default function DirigeantMessagesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-accent" />
        <h1 className="font-heading text-2xl font-bold text-dark">Messages</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          La messagerie sera bientot disponible.
        </p>
      </div>
    </div>
  );
}
