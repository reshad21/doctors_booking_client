/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
  }
  return videoId;
};

export default function VideoPlayer({ videos }: VideoPlayerProps) {
  const [shuffledVideos, setShuffledVideos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isYTReady, setIsYTReady] = useState(false);
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

    window.onYouTubeIframeAPIReady = () => setIsYTReady(true);

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
  }, []);

  // Initialize player
  useEffect(() => {
    if (!isYTReady || !shuffledVideos.length || playerRef.current) return;

    const currentVideo = shuffledVideos[currentIndex];
    const videoId = extractVideoId(currentVideo.videoFile);
    if (!videoId) return;

    playerRef.current = new window.YT.Player("yt-player", {
      height: "100%",
      width: "100%",
      videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 2,
        showinfo: 0,
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event: any) => event.target.playVideo(),
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            setCurrentIndex((prev) =>
              prev + 1 < shuffledVideos.length ? prev + 1 : 0
            );
          }
        },
        onError: () => {
          setCurrentIndex((prev) =>
            prev + 1 < shuffledVideos.length ? prev + 1 : 0
          );
        },
      },
    });

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isYTReady, shuffledVideos, currentIndex]);

  // Update video when currentIndex changes
  useEffect(() => {
    if (!playerRef.current || !shuffledVideos.length) return;
    const videoId = extractVideoId(shuffledVideos[currentIndex].videoFile);
    if (!videoId) return;

    playerRef.current.loadVideoById({ videoId, suggestedQuality: "default" });
  }, [currentIndex, shuffledVideos]);

  if (!shuffledVideos.length) {
    return (
      <div className="flex items-center justify-center h-full text-white text-lg">
        No active videos available
      </div>
    );
  }

  return <div id="yt-player" className="w-full h-full"></div>;
}
