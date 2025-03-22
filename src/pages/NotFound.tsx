import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 flex items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="text-9xl font-display font-bold text-primary/20 mb-6"
            variants={itemVariants}
          >
            404
          </motion.div>
          <motion.h1 
            className="text-3xl font-display font-bold mb-4"
            variants={itemVariants}
          >
            Page Not Found
          </motion.h1>
          <motion.p 
            className="text-muted-foreground mb-8"
            variants={itemVariants}
          >
            Lost in the blockchain abyss!
            Try a search party!!
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button asChild size="lg" className="mr-4">
              <Link to="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/marketplace">Explore Marketplace</Link>
            </Button>
          </motion.div>
          <motion.p 
            className="mt-8 text-xs text-muted-foreground"
            variants={itemVariants}
          >
            Press <kbd className="px-2 py-1 bg-muted rounded-md">ESC</kbd> to return home
          </motion.p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
