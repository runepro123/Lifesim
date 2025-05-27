import type { Character } from "@shared/schema";

interface LifeEventsProps {
  character: Character;
}

export default function LifeEvents({ character }: LifeEventsProps) {
  const recentEvents = (character.lifeEvents || []).slice(-3).reverse();

  return (
    <div className="max-w-md mx-auto px-4 pb-4">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Life Events</h2>
        <div className="space-y-3">
          {recentEvents.length > 0 ? (
            recentEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-700">{event}</p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500 italic">No recent life events. Age up to see what happens next!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
