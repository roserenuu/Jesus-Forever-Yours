import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";

const COLORS = {
  black: "#141210",
  linen: "#F1EDE6",
  walnut: "#7C6A54",
  walnutLight: "#A89278",
  snow: "#F8F6F3",
  white: "#FFFFFF",
  stone: "#9A9080",
  textM: "#6A6058",
};

const fontFamily = `'Georgia', 'Times New Roman', serif`;
const sansFont = `'Helvetica Neue', 'Arial', sans-serif`;

// Scene 1: Day number + title
const DayIntro = ({ dayNumber, letterTitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dayOpacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 30 } });
  const dayY = spring({ frame, fps, from: 30, to: 0, config: { damping: 18 } });
  const lineWidth = spring({ frame: frame - 12, fps, from: 0, to: 80, config: { damping: 25 } });
  const titleOpacity = spring({ frame: frame - 20, fps, from: 0, to: 1, config: { damping: 30 } });
  const titleY = spring({ frame: frame - 20, fps, from: 24, to: 0, config: { damping: 18 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.linen,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 14,
          fontWeight: 300,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: COLORS.walnut,
          opacity: dayOpacity,
          transform: `translateY(${dayY}px)`,
          marginBottom: 28,
        }}
      >
        Day {dayNumber}
      </div>
      <div
        style={{
          width: lineWidth,
          height: 1,
          background: COLORS.walnut,
          marginBottom: 28,
          opacity: dayOpacity,
        }}
      />
      <div
        style={{
          fontFamily,
          fontSize: 56,
          fontWeight: 400,
          fontStyle: "italic",
          color: COLORS.black,
          textAlign: "center",
          lineHeight: 1.15,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {letterTitle}
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Love letter quote
const LetterQuote = ({ quote }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 30 } });
  const y = spring({ frame, fps, from: 30, to: 0, config: { damping: 18 } });
  const quoteMarkOpacity = interpolate(frame, [0, 25], [0, 0.05], { extrapolateRight: "clamp" });
  const salutationOpacity = spring({ frame: frame - 5, fps, from: 0, to: 1, config: { damping: 30 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.snow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 56px",
      }}
    >
      {/* Giant quote mark watermark */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 40,
          fontFamily,
          fontSize: 500,
          color: COLORS.walnut,
          opacity: quoteMarkOpacity,
          lineHeight: 1,
        }}
      >
        {"\u201C"}
      </div>

      <div
        style={{
          fontFamily,
          fontSize: 16,
          fontStyle: "italic",
          color: COLORS.walnut,
          letterSpacing: "0.1em",
          marginBottom: 32,
          opacity: salutationOpacity,
        }}
      >
        My Child,
      </div>

      <div
        style={{
          fontFamily,
          fontSize: 36,
          fontStyle: "italic",
          fontWeight: 300,
          color: COLORS.black,
          lineHeight: 1.6,
          textAlign: "center",
          opacity,
          transform: `translateY(${y}px)`,
          maxWidth: 900,
          position: "relative",
          zIndex: 1,
        }}
      >
        {quote}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Scripture + signature
const ScriptureAndSign = ({ scripture, scriptureRef, signature }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 30 } });
  const y = spring({ frame, fps, from: 24, to: 0, config: { damping: 18 } });
  const refOpacity = spring({ frame: frame - 15, fps, from: 0, to: 1, config: { damping: 30 } });
  const sigOpacity = spring({ frame: frame - 30, fps, from: 0, to: 1, config: { damping: 30 } });
  const sigY = spring({ frame: frame - 30, fps, from: 16, to: 0, config: { damping: 18 } });
  const brandOpacity = spring({ frame: frame - 45, fps, from: 0, to: 1, config: { damping: 30 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.linen,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 56px",
      }}
    >
      {/* Scripture */}
      <div
        style={{
          fontFamily,
          fontSize: 32,
          fontStyle: "italic",
          fontWeight: 300,
          color: COLORS.black,
          lineHeight: 1.55,
          textAlign: "center",
          opacity,
          transform: `translateY(${y}px)`,
          maxWidth: 850,
          marginBottom: 24,
        }}
      >
        {"\u201C"}{scripture}{"\u201D"}
      </div>

      {/* Reference */}
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 13,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: COLORS.stone,
          marginBottom: 80,
          opacity: refOpacity,
        }}
      >
        {scriptureRef}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 50,
          height: 1,
          background: COLORS.walnut,
          marginBottom: 28,
          opacity: sigOpacity,
        }}
      />

      {/* Signature */}
      <div
        style={{
          fontFamily,
          fontSize: 26,
          fontStyle: "italic",
          color: COLORS.walnut,
          opacity: sigOpacity,
          transform: `translateY(${sigY}px)`,
          marginBottom: 60,
        }}
      >
        {signature}
      </div>

      {/* Brand */}
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 11,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: COLORS.stone,
          opacity: brandOpacity,
        }}
      >
        jesusforeveryours.com
      </div>
    </AbsoluteFill>
  );
};

export const ScriptureClip = ({
  dayNumber,
  letterTitle,
  quote,
  scripture,
  scriptureRef,
  signature,
}) => {
  return (
    <AbsoluteFill>
      {/* Scene 1: Day intro (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <DayIntro dayNumber={dayNumber} letterTitle={letterTitle} />
      </Sequence>

      {/* Scene 2: Love letter quote (3-6s) */}
      <Sequence from={90} durationInFrames={90}>
        <LetterQuote quote={quote} />
      </Sequence>

      {/* Scene 3: Scripture + signature (6-9s) */}
      <Sequence from={180} durationInFrames={90}>
        <ScriptureAndSign
          scripture={scripture}
          scriptureRef={scriptureRef}
          signature={signature}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
