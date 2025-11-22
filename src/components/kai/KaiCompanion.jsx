import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import KaiBubble from './KaiBubble';
import KaiChat from './KaiChat';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const KaiCompanion = ({ course }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    // Fixed container logic: bottom-0 right-0 with padding creates the anchor point.
    // Flex-col-reverse ensures items stack upwards from the bottom.
    <div className="fixed bottom-0 right-0 p-4 sm:p-6 z-[1000] flex flex-col-reverse items-end pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <KaiChat
              key="chat"
              onClose={() => setIsOpen(false)}
              course={course}
              user={user}
            />
          ) : (
            <KaiBubble
              key="bubble"
              onClick={() => setIsOpen(true)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KaiCompanion;