'use client';

import { motion } from 'motion/react';
import { LeadershipCard } from './LeadershipCard';
import { LeadershipMember } from '@/types';
import { staggerContainer, fadeInUp } from '@/lib/motion';

interface LeadershipGridProps {
  members: LeadershipMember[];
}

export function LeadershipGrid({ members }: LeadershipGridProps) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {members.map((member) => (
        <motion.div
          key={member.id}
          className="w-full max-w-[400px] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          variants={fadeInUp}
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          whileHover={{ y: -4, scale: 1.02, transition: { type: 'spring', stiffness: 300 } }}
        >
          <LeadershipCard member={member} />
        </motion.div>
      ))}
    </motion.div>
  );
}
