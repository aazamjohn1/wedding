"use client";
import AnimatedBackground from "@/components/animated-background";
import CelebrationAnimation from "@/components/celebration-animation";
import CountdownTimer from "@/components/countdown-timer";
import LocationSection from "@/components/location-section";
import Navigation from "@/components/navigation";
import PersonalizedHeader from "@/components/personalized-header";
import { Button } from "@/components/ui/button";
import WishesSection from "@/components/wishes-section";
import type { User, WeddingInfo } from "@/lib/types";
import { LogIn, Share2, Volume2, VolumeX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [guestName, setGuestName] = useState<string>("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Create a ref to hold the audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get("user");
    const guest = urlParams.get("guest");

    if (userParam) {
      try {
        const googleUser = JSON.parse(userParam);
        setUser(googleUser);
        localStorage.setItem("wedding-user", JSON.stringify(googleUser));
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error("Failed to parse user from URL:", error);
      }
    }

    if (guest) {
      setGuestName(guest);
    }

    const storedUser = localStorage.getItem("wedding-user");
    if (storedUser && !userParam) {
      setUser(JSON.parse(storedUser));
    }

    fetchWeddingInfo();
    fetchWeddingMedia();

    // Cleanup function to stop audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const fetchWeddingInfo = async () => {
    try {
      const response = await fetch("/api/wedding-info");
      const data = await response.json();

      if (!data.weddingInfo) {
        const defaultInfo = {
          brideName: "Madinaxon",
          groomName: "Ravshanbek",
          weddingDate: "2025-12-21",
          venue: "Brend Hall",
          address: "Tashkent, Yunusabad District, Gathering of citizens of Bobodehkan Mahallah",
          time: "16:00",
          description: "Bizning nikoh to'yimizda ishtirok etishingizni chin dildan xoxlaymiz.",
        };

        await fetch("/api/wedding-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(defaultInfo),
        });

        setWeddingInfo(defaultInfo);
      } else {
        setWeddingInfo(data.weddingInfo);
      }
    } catch (error) {
      console.error("To'y ma'lumotlari yuklanmadi:", error);
    }
  };

  const fetchWeddingMedia = async () => {
    try {
      const response = await fetch("/api/wedding-info/media");
      const data = await response.json();

      const edSheeranPerfectUrl = "/assets/bg-sound.mp3";
      const audioUrl = data.audioUrl || edSheeranPerfectUrl;

      // Initialize audio only if it doesn't exist
      if (!audioRef.current) {
        const newAudio = new Audio(audioUrl);
        newAudio.loop = true;
        newAudio.volume = 0.3;
        audioRef.current = newAudio; // Store the audio reference

        // Play audio only if the user has already interacted with the page
        if (isPlaying) {
          newAudio.play().catch((error) => {
            console.log("Audio autoplay prevented:", error);
          });
        }
      } else {
        // If audio is already initialized, update the source
        audioRef.current.src = audioUrl;
        if (isPlaying) {
          audioRef.current.play().catch((error) => {
            console.log("Audio autoplay prevented:", error);
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch wedding media:", error);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log("Audio autoplay prevented:", error);
        });
      }
    }
  };

  const handleCountdownComplete = () => {
    setShowCelebration(true);
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-8">
            <PersonalizedHeader weddingInfo={weddingInfo} guestName={guestName} />
            {weddingInfo && (
              <div className="max-w-3xl mx-auto px-4">
                <CountdownTimer weddingDate={weddingInfo.weddingDate} onComplete={handleCountdownComplete} />
              </div>
            )}
          </div>
        );
      case "wishes":
        return <WishesSection user={user} onSignupRequired={handleLoginClick} />;
      case "location":
        return <LocationSection weddingInfo={weddingInfo} />;
      default:
        return (
          <div className="space-y-8">
            <PersonalizedHeader weddingInfo={weddingInfo} guestName={guestName} />
            {weddingInfo && (
              <div className="max-w-3xl mx-auto px-4">
                <CountdownTimer weddingDate={weddingInfo.weddingDate} onComplete={handleCountdownComplete} />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      {showCelebration && <CelebrationAnimation />}
      {/* Top Controls */}
      <div className="fixed top-6 left-6 z-50 flex gap-2">
        <Button
          onClick={() => router.push("/share")}
          className="romantic-nav-glass rounded-full p-3 shadow-2xl text-emerald-500 hover:bg-emerald-100 border-0"
        >
          <Share2 className="w-5 h-5" />
        </Button>
        <Button
          onClick={toggleAudio}
          className="romantic-nav-glass rounded-full p-3 shadow-2xl text-emerald-500 hover:bg-emerald-100 border-0"
          variant="ghost"
        >
          {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>
      {!user && (
        <div className="fixed top-6 right-6 z-50">
          <Button
            onClick={handleLoginClick}
            className="romantic-glow-button text-white px-6 py-3 rounded-full shadow-2xl font-semibold"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Kirish
          </Button>
        </div>
      )}
      {/* User welcome badge */}
      {user && activeSection !== "home" && (
        <div className="fixed right-1 transform -translate-x-1/1 z-30 mr-3">
          <div className="romantic-glass-effect rounded-2xl px-6 py-3 shadow-xl">
            <p className="text-sm text-gray-600 font-cormorant">
              Xush kelibsiz, <span className="font-semibold romantic-glow-text font-playfair">{user.name}</span>
            </p>
          </div>
        </div>
      )}
      <div className="relative z-10">{renderActiveSection()}</div>
    </div>
  );
}