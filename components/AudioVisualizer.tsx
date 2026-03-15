"use client";

import { useRef, useEffect, useCallback } from "react";

export type VisualizerState = "idle" | "thinking" | "listening" | "talking";

interface AudioVisualizerProps {
	state: VisualizerState;
	/** When TTS is playing, pass the same Audio element so we can analyze it. */
	audioElement?: HTMLAudioElement | null;
	/** When listening (mic), pass the MediaStream so we can analyze it. */
	mediaStream?: MediaStream | null;
	className?: string;
	size?: number;
}

const BAR_COUNT = 32;
const SMOOTHING = 0.75;

/**
 * Modern circular bar visualizer (OpenAI-style). Reacts to:
 * - audioElement: TTS playback
 * - mediaStream: microphone while listening
 * - idle/thinking: gentle synthetic animation
 */
export function AudioVisualizer({
	state,
	audioElement,
	mediaStream,
	className = "",
	size = 160,
}: AudioVisualizerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const sourceRef = useRef<MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null>(null);
	const animationRef = useRef<number>(0);
	const syntheticPhaseRef = useRef(0);

	const width = size;
	const height = size;
	const centerX = width / 2;
	const centerY = height / 2;
	const radius = Math.min(width, height) * 0.38;
	const barWidth = 3;
	const barGap = 2;
	const barMaxHeight = 14;

	// Connect audio element to analyser when playing (talking)
	useEffect(() => {
		if (state !== "talking" || !audioElement) return;
		const ctx = new AudioContext();
		audioContextRef.current = ctx;
		const source = ctx.createMediaElementSource(audioElement);
		sourceRef.current = source;
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 256;
		analyser.smoothingTimeConstant = SMOOTHING;
		analyser.minDecibels = -60;
		analyser.maxDecibels = -10;
		source.connect(analyser);
		analyser.connect(ctx.destination);
		analyserRef.current = analyser;
		return () => {
			try {
				source?.disconnect();
				analyser?.disconnect();
				ctx.close();
			} catch {}
			analyserRef.current = null;
			sourceRef.current = null;
			audioContextRef.current = null;
		};
	}, [state, audioElement]);

	// Connect mic stream to analyser when listening
	useEffect(() => {
		if (state !== "listening" || !mediaStream) return;
		const ctx = new AudioContext();
		audioContextRef.current = ctx;
		const source = ctx.createMediaStreamSource(mediaStream);
		sourceRef.current = source;
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 256;
		analyser.smoothingTimeConstant = SMOOTHING;
		analyser.minDecibels = -60;
		analyser.maxDecibels = -10;
		source.connect(analyser);
		analyserRef.current = analyser;
		return () => {
			try {
				source?.disconnect();
				analyser?.disconnect();
				ctx.close();
			} catch {}
			analyserRef.current = null;
			sourceRef.current = null;
			audioContextRef.current = null;
		};
	}, [state, mediaStream]);

	// Set canvas size once (high DPR for sharpness)
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		const ctx = canvas.getContext("2d");
		if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}, [width, height]);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const analyser = analyserRef.current;
		const bufferLength = analyser?.frequencyBinCount ?? BAR_COUNT;
		const dataArray = new Uint8Array(bufferLength);
		let hasRealData = false;
		if (analyser) {
			analyser.getByteFrequencyData(dataArray);
			hasRealData = state === "listening" || state === "talking";
		}

		// Clear with subtle dark fill
		ctx.fillStyle = "rgba(0,0,0,0.4)";
		ctx.fillRect(0, 0, width, height);

		// Draw circular bars
		for (let i = 0; i < BAR_COUNT; i++) {
			const angle = (i / BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);

			let value: number;
			if (hasRealData && analyser) {
				const binIndex = Math.floor((i / BAR_COUNT) * bufferLength);
				value = dataArray[binIndex] / 255;
			} else {
				// Idle or thinking: gentle wave
				syntheticPhaseRef.current += 0.02;
				const wave = Math.sin(syntheticPhaseRef.current + (i * Math.PI) / BAR_COUNT) * 0.5 + 0.5;
				value = state === "thinking" ? wave * 0.6 + 0.2 : wave * 0.25 + 0.1;
			}

			const barHeight = Math.max(2, value * barMaxHeight);
			const x1 = centerX + cos * (radius - barWidth / 2);
			const y1 = centerY + sin * (radius - barWidth / 2);
			const x2 = centerX + cos * (radius + barHeight);
			const y2 = centerY + sin * (radius + barHeight);

			// Gradient bar (emerald/teal)
			const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
			gradient.addColorStop(0, "rgba(52, 211, 153, 0.5)");
			gradient.addColorStop(0.5, "rgba(16, 185, 129, 0.9)");
			gradient.addColorStop(1, "rgba(5, 150, 105, 0.6)");
			ctx.strokeStyle = gradient;
			ctx.lineWidth = barWidth;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(
				centerX + cos * (radius + barHeight),
				centerY + sin * (radius + barHeight)
			);
			ctx.stroke();
		}

		// Soft center glow when active
		if (state === "talking" || state === "listening") {
			const g = ctx.createRadialGradient(
				centerX, centerY, 0,
				centerX, centerY, radius + barMaxHeight
			);
			g.addColorStop(0, "rgba(16, 185, 129, 0.15)");
			g.addColorStop(0.6, "rgba(16, 185, 129, 0.04)");
			g.addColorStop(1, "transparent");
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, width, height);
		}
	}, [state, width, height, centerX, centerY, radius, barMaxHeight]);

	// Animation loop
	useEffect(() => {
		let running = true;
		const loop = () => {
			if (!running) return;
			draw();
			animationRef.current = requestAnimationFrame(loop);
		};
		animationRef.current = requestAnimationFrame(loop);
		return () => {
			running = false;
			cancelAnimationFrame(animationRef.current);
		};
	}, [draw]);

	return (
		<div
			className={`relative flex items-center justify-center rounded-full ${className}`}
			style={{ width: size, height: size }}
			aria-live="polite"
			aria-label={
				state === "talking"
					? "AI speaking"
					: state === "listening"
						? "Listening"
						: state === "thinking"
							? "Thinking"
							: "Ready"
			}
		>
			<canvas
				ref={canvasRef}
				className="rounded-full bg-zinc-900/80 border border-zinc-800/80 shadow-xl"
				width={width}
				height={height}
				style={{ width, height }}
			/>
		</div>
	);
}
