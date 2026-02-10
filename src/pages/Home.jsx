import React, { useState } from "react";
import { Gem, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeArticle, setActiveArticle] = useState(null);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background with moving particles */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        <div className="absolute inset-0 opacity-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.5 + 0.2,
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main wrapper */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center border-4 border-white rounded-full bg-white/10 backdrop-blur-sm">
              <Gem className="w-12 h-12" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">Dimension</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed">
              A morbi blandit ante natoque aliquet ut Commodo cep cubilia<br />
              cep quam augue vel Feugiat Aliquam egestas.
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ul className="flex flex-wrap gap-4 justify-center">
              {["intro", "work", "about", "contact"].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <button
                    onClick={() => setActiveArticle(item)}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all hover:scale-105"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </motion.header>

        {/* Article Modal Overlay */}
        <AnimatePresence>
          {activeArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setActiveArticle(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900/95 backdrop-blur-lg border border-white/20 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
              >
                {/* Close button */}
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>

              <div className="p-8 md:p-12">
                {activeArticle === "intro" && (
                  <article>
                    <h2 className="text-4xl font-bold mb-6 border-b border-white/20 pb-4">Intro</h2>
                    <img
                      src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop"
                      alt="Intro"
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Aenean ornare velit lacus, ac varius enim ullamcorper eu. Proin aliquam facilisis ante interdum congue. 
                      Integer mollis, nisl amet convallis, porttitor magna ullamcorper, amet egestas mauris. Ut magna finibus 
                      nisi nec lacinia. Nam maximus erat id euismod egestas. By the way, check out my awesome work.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis dapibus rutrum facilisis. Class aptent 
                      taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam tristique libero 
                      eu nibh porttitor fermentum. Nullam venenatis erat id vehicula viverra.
                    </p>
                  </article>
                )}

                {activeArticle === "work" && (
                  <article>
                    <h2 className="text-4xl font-bold mb-6 border-b border-white/20 pb-4">Work</h2>
                    <img
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop"
                      alt="Work"
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Adipiscing magna sed dolor elit. Praesent eleifend dignissim arcu, at eleifend sapien imperdiet ac. 
                      Aliquam erat volutpat. Praesent urna nisi, fringila lorem et vehicula lacinia quam. Integer sollicitudin 
                      mauris nec lorem luctus ultrices.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Nullam et orci eu lorem consequat tincidunt vivamus et sagittis libero. Mauris aliquet magna magna sed 
                      nunc rhoncus pharetra. Pellentesque condimentum sem. In efficitur ligula tate urna. Maecenas laoreet 
                      massa vel lacinia pellentesque lorem ipsum dolor.
                    </p>
                  </article>
                )}

                {activeArticle === "about" && (
                  <article>
                    <h2 className="text-4xl font-bold mb-6 border-b border-white/20 pb-4">About</h2>
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop"
                      alt="About"
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                    <p className="text-gray-300 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur et adipiscing elit. Praesent eleifend dignissim arcu, at 
                      eleifend sapien imperdiet ac. Aliquam erat volutpat. Praesent urna nisi, fringila lorem et vehicula 
                      lacinia quam. Integer sollicitudin mauris nec lorem luctus ultrices. Aliquam libero et malesuada fames 
                      ac ante ipsum primis in faucibus.
                    </p>
                  </article>
                )}

                {activeArticle === "contact" && (
                  <article>
                    <h2 className="text-4xl font-bold mb-6 border-b border-white/20 pb-4">Contact</h2>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name
                          </label>
                          <Input
                            id="name"
                            type="text"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          rows={4}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button className="bg-white/20 hover:bg-white/30 border border-white/20">
                          Send Message
                        </Button>
                        <Button variant="outline" type="reset" className="border-white/20 text-white hover:bg-white/10">
                          Reset
                        </Button>
                      </div>
                    </form>
                  </article>
                )}
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 right-0 py-6 text-center text-sm text-gray-400">
          <p>&copy; Untitled.</p>
        </footer>
      </div>
    </div>
  );
}