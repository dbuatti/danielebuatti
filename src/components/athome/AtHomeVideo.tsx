"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import { HERO_VIDEO, type AtHomeVideoConfig } from "@/components/athome/content";

const embedUrl = (video: AtHomeVideoConfig): string => {
  if (video.provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (video.provider === "vimeo") {
    return `https://player.vimeo.com/video/${video.id}?autoplay=1&title=0&byline=0`;
  }
  return "";
};

const AtHomeVideo: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const video = HERO_VIDEO;
  const configured = video.provider === "file" ? !!video.file : !!video.id;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#0B0B0B] shadow-lifted">
        {playing && video.provider === "file" && (
          <video
            className="absolute inset-0 h-full w-full bg-black"
            src={video.file}
            poster={video.poster}
            controls
            autoPlay
            playsInline
            preload="none"
            title={video.title}
          />
        )}

        {playing && video.provider !== "file" && (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl(video)}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}

        {!playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            disabled={!configured}
            aria-label={configured ? `Play video: ${video.title}` : "Video coming soon"}
            className="group absolute inset-0 flex h-full w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A208] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F3EA]"
          >
            <img
              src={video.poster}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover brightness-90 transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/55 via-[#0B0B0B]/10 to-transparent" aria-hidden="true" />
            {configured ? (
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#D4A208] text-[#0B0B0B] shadow-[0_10px_30px_-8px_rgba(11,11,11,0.6)] transition-transform duration-300 ease-out-expo group-active:scale-95 md:h-20 md:w-20">
                <Play className="ml-0.5 h-7 w-7 md:h-8 md:w-8" fill="currentColor" strokeWidth={0} aria-hidden="true" />
              </span>
            ) : (
              <span className="relative rounded-full bg-[#0B0B0B]/70 px-5 py-3 text-sm font-medium text-[#F7F3EA]">
                Video coming soon
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AtHomeVideo;
