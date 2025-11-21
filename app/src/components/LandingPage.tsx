"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Sword,
  Shield,
  Coins,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
} from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const rotatingPhrases = ["Win Big", "Choose Wisely", "Claim Victory"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dark stone texture gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to bottom,
                #000000 0%,
                #0a0a0a 20%,
                #111111 40%,
                #0a0a0a 60%,
                #050505 80%,
                #000000 100%
              )
            `,
          }}
        />

        {/* Dark stone texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Subtle fire glow - top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(255,100,0,0.3), transparent 70%)',
            filter: 'blur(80px)'
          }}
        />

        {/* Dust particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-600/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Vignette effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="container mx-auto max-w-6xl text-center space-y-12">
            {/* Logo/Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Dungeon Skull Icon */}
              <motion.div
                className="inline-block"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="relative w-32 h-32 mx-auto mb-8">
                  {/* Dark glow */}
                  <div className="absolute inset-0 bg-red-900/20  blur-2xl"></div>

                  {/* Stone frame */}
                  <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black border-4 border-gray-700  p-6 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                    <motion.div
                      className="text-5xl filter drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      💀
                    </motion.div>

                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-600/50"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-600/50"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-600/50"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-600/50"></div>
                  </div>
                </div>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="text-gray-100 pixel-font" style={{ textShadow: "4px 4px 0px #000, 8px 8px 20px rgba(0, 0, 0, 0.8)" }}>
                  PIXEL DUNGEON
                </span>
                <br />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentPhraseIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block text-transparent bg-clip-text pixel-font"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #ff4500, #ff8c00, #ff4500)',
                      backgroundSize: '200% 200%',
                      textShadow: "2px 2px 4px rgba(255,69,0,0.5)"
                    }}
                  >
                    {rotatingPhrases[currentPhraseIndex]}
                  </motion.span>
                </AnimatePresence>
              </h1>

              <motion.p
                className="text-xl sm:text-2xl md:text-3xl text-gray-400 max-w-3xl mx-auto pixel-font leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Enter the darkness. Choose your fate. Survive or lose everything.
                <br />
                <span className="text-orange-500">On-chain. Unforgiving. Winner takes all.</span>
              </motion.p>
            </motion.div>

            {/* Launch Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                onClick={onEnter}
                className="group relative px-16 py-6 bg-gradient-to-b from-gray-800 to-black text-white pixel-font text-xl border-4 border-gray-700 hover:border-orange-600 shadow-[0_10px_40px_rgba(0,0,0,0.9)] overflow-hidden"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
                }}
              >
                {/* Fire glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-orange-600/20 to-red-900/20 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />

                {/* Flickering fire effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scaleX: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                <span className="relative z-10 flex items-center gap-4 font-bold tracking-wider uppercase">
                  <Sword className="w-6 h-6" />
                  ENTER THE DUNGEON
                  <Shield className="w-6 h-6" />
                </span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Target, label: "25 Doors", value: "Death Behind Each", color: "from-gray-700 to-gray-900" },
                { icon: Coins, label: "Real SOL", value: "Blood Money", color: "from-gray-800 to-black" },
                { icon: Trophy, label: "No Mercy", value: "Winner Takes All", color: "from-red-950 to-black" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Stone card */}
                  <div className="relative bg-gradient-to-br from-gray-900 to-black border-4 border-gray-700 group-hover:border-gray-600 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all" style={{
                    clipPath: 'polygon(0 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%)'
                  }}>
                    {/* Corner decorations */}
                    <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-orange-700/30"></div>
                    <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-orange-700/30"></div>
                    <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-orange-700/30"></div>
                    <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-orange-700/30"></div>

                    {/* Icon */}
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-black border-2 border-gray-700 flex items-center justify-center">
                        <stat.icon className="w-8 h-8 text-orange-600" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-100 pixel-font mb-2">{stat.label}</h3>
                    <p className="text-sm text-gray-500 pixel-font">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 pixel-font mb-4" style={{ textShadow: "4px 4px 0px #000" }}>
                THE RITUAL
              </h2>
              <p className="text-xl text-gray-500 pixel-font max-w-2xl mx-auto">
                Three steps to your doom. Simple rules. No escape.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "I",
                  icon: Target,
                  title: "Pick Your Door",
                  description: "25 doors. One hides your fate. Choose carefully or die trying.",
                },
                {
                  step: "II",
                  icon: Coins,
                  title: "Blood Offering",
                  description: "Deposit SOL. No refunds. No mercy. Your gold feeds the dungeon.",
                },
                {
                  step: "III",
                  icon: Trophy,
                  title: "Live or Die",
                  description: "Winners claim all. Losers leave with nothing but regret.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  {/* Dark glow */}
                  <motion.div
                    className="absolute -inset-2 bg-red-900/10 blur-xl opacity-0 group-hover:opacity-30"
                    transition={{ duration: 0.3 }}
                  />

                  {/* Stone card */}
                  <div
                    className="relative bg-gradient-to-br from-gray-900 via-black to-gray-950 p-10 border-4 border-gray-800 group-hover:border-gray-700 h-full shadow-[0_10px_40px_rgba(0,0,0,0.9)] overflow-hidden"
                    style={{
                      clipPath: 'polygon(0 8%, 8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%)'
                    }}
                  >
                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-orange-800/40"></div>
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-orange-800/40"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-orange-800/40"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-orange-800/40"></div>

                    {/* Roman numeral badge */}
                    <motion.div
                      className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-gray-800 to-black border-4 border-gray-700 flex items-center justify-center text-2xl font-bold pixel-font shadow-xl"
                      style={{
                        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                      }}
                    >
                      <span className="text-orange-600 drop-shadow-[0_0_8px_rgba(255,69,0,0.4)]">{feature.step}</span>
                    </motion.div>

                    <div className="flex flex-col items-center text-center space-y-5 mt-8 relative">
                      {/* Icon container with stone frame */}
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black border-2 border-gray-700 flex items-center justify-center shadow-xl">
                        <feature.icon className="w-10 h-10 text-orange-700" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-100 pixel-font">{feature.title}</h3>
                      <p className="text-gray-500 pixel-font leading-relaxed text-sm">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            className="container mx-auto max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative group">
              {/* Dark fire glow */}
              <motion.div
                className="absolute -inset-6 bg-gradient-to-r from-red-950/20 via-orange-950/20 to-red-950/20 blur-3xl opacity-20 group-hover:opacity-40"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Stone frame */}
              <div
                className="relative bg-gradient-to-br from-gray-900 via-black to-gray-950 p-16 border-4 border-gray-800 text-center space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden"
                style={{
                  clipPath: 'polygon(0 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%)'
                }}
              >
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-orange-800/40"></div>
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-orange-800/40"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-orange-800/40"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-orange-800/40"></div>

                {/* Skull icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="relative z-10"
                >
                  <div className="text-6xl filter drop-shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                    💀
                  </div>
                </motion.div>

                <div className="relative z-10 space-y-6">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-100 pixel-font" style={{ textShadow: "4px 4px 0px #000" }}>
                    Are You Brave Enough?
                  </h2>
                  <p className="text-xl text-gray-500 pixel-font max-w-2xl mx-auto leading-relaxed">
                    The dungeon awaits. Connect your wallet. Face your destiny.
                  </p>
                </div>

                <motion.button
                  onClick={onEnter}
                  className="relative z-10 px-16 py-7 bg-gradient-to-b from-gray-800 to-black text-white pixel-font text-xl border-4 border-gray-700 hover:border-orange-700 shadow-[0_20px_60px_rgba(0,0,0,0.9)] font-bold tracking-wide overflow-hidden group/btn"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
                  }}
                >
                  {/* Fire glow on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-orange-700/20 to-red-900/20 opacity-0 group-hover/btn:opacity-100"
                    transition={{ duration: 0.3 }}
                  />

                  {/* Flickering fire line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent"
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />

                  <span className="relative z-10 flex items-center gap-3 uppercase">
                    Face the Darkness
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t-4 border-gray-800/50 py-12 px-4 relative">
          {/* Stone texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-950 opacity-80"></div>

          <div className="container mx-auto max-w-6xl text-center relative z-10">
            <p className="text-gray-600 pixel-font mb-4">
              BUILT ON SOLANA • FORGED IN DARKNESS 💀
            </p>
            <p className="text-sm text-gray-700 pixel-font">
              Pixel Dungeon • Provably Fair • No Escape
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
