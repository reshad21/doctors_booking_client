/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videos: { videoFile: string; title?: string }[];
}

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const extractVideoId = (url: string) => {
  let videoId = "";
  if (url.includes("youtu.be")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  } else if (url.includes("embed/")) {
    videoId = url.split("embed/")[1].split("?")[0];
  }
  return videoId;
};

export default function VideoPlayer({ videos }: VideoPlayerProps) {
  const [shuffledVideos, setShuffledVideos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isYTReady, setIsYTReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);

  // Shuffle videos on mount
  useEffect(() => {
    if (videos.length > 0) {
      setShuffledVideos(shuffleArray(videos));
      setCurrentIndex(0);
    }
  }, [videos]);

  // Load YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsYTReady(true);
      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      setIsYTReady(true);
      console.log("YouTube API ready");
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }

    return () => {
      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Initialize player
  useEffect(() => {
    if (!isYTReady || !shuffledVideos.length || playerRef.current) return;

    const currentVideo = shuffledVideos[currentIndex];
    const videoId = extractVideoId(currentVideo.videoFile);

    if (!videoId) {
      console.error("Invalid video URL:", currentVideo.videoFile);
      setCurrentIndex((prev) => (prev + 1) % shuffledVideos.length);
      return;
    }

    console.log("Initializing player with video:", videoId);

    try {
      playerRef.current = new window.YT.Player("yt-player", {
        height: "100%",
        width: "100%",
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 0,
          controls: 1, // YouTube native controls
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3, // Hide annotations
          fs: 0, // Hide fullscreen button (optional)
        },
        events: {
          // onReady: (event: any) => {
          //   console.log("Player ready");
          //   setIsPlayerReady(true);
          //   event.target.playVideo();
          // },
          onReady: (event: any) => {
            console.log("Player ready");
            setIsPlayerReady(true);
            event.target.mute(); // make sure muted
            event.target.playVideo(); // trigger autoplay
          },
          onStateChange: (event: any) => {
            console.log("Player state changed:", event.data);

            if (event.data === window.YT.PlayerState.ENDED) {
              console.log("Video ended, moving to next");
              // Loop back to start when reaching the end
              setCurrentIndex((prev) => (prev + 1) % shuffledVideos.length);
            }
          },
          onError: (event: any) => {
            console.error("Player error:", event.data);
            setCurrentIndex((prev) => (prev + 1) % shuffledVideos.length);
          },
        },
      });
    } catch (error) {
      console.error("Error initializing YouTube player:", error);
    }
  }, [isYTReady, shuffledVideos, currentIndex]);

  // Update video when currentIndex changes
  useEffect(() => {
    if (!playerRef.current || !shuffledVideos.length || !isPlayerReady) return;

    const currentVideo = shuffledVideos[currentIndex];
    const videoId = extractVideoId(currentVideo.videoFile);

    if (!videoId) {
      console.error("Invalid video URL:", currentVideo.videoFile);
      setCurrentIndex((prev) => (prev + 1) % shuffledVideos.length);
      return;
    }

    console.log("Loading new video:", videoId);

    try {
      playerRef.current.loadVideoById({
        videoId: videoId,
        suggestedQuality: "default",
      });
    } catch (error) {
      console.error("Error loading video:", error);
      setCurrentIndex((prev) => (prev + 1) % shuffledVideos.length);
    }
  }, [currentIndex, shuffledVideos, isPlayerReady]);

  // Show loading state
  if (!isYTReady) {
    return (
      <div className="flex items-center justify-center h-full text-white text-lg">
        Loading YouTube player...
      </div>
    );
  }

  if (!shuffledVideos.length) {
    return (
      <div className="flex items-center justify-center h-full text-white text-lg">
        No active videos available
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {!isPlayerReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
          Loading video...
        </div>
      )}
      <div id="yt-player" className="w-full h-full"></div>
    </div>
  );
}
