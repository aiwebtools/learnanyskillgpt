# Project Architecture

- Runtime AI image generation goes through a Lovable Cloud function so the managed AI key never reaches the browser.- The AI teacher (chat, speech-to-text, text-to-speech) runs through one Lovable Cloud function, skill-teacher, so AI keys stay server-side.
