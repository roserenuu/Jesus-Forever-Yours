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
  snow: "#F8F6F3",
  white: "#FFFFFF",
  stone: "#9A9080",
  textM: "#6A6058",
};

const fontFamily = `'Georgia', 'Times New Roman', serif`;
const sansFont = `'Helvetica Neue', 'Arial', sans-serif`;

// Scene 1: Title reveal with warm linen background
const TitleScene = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 30 } });
  const titleY = spring({ frame, fps, from: 40, to: 0, config: { damping: 20 } });
  const lineWidth = spring({ frame: frame - 15, fps, from: 0, to: 120, config: { damping: 25 } });
  const subOpacity = spring({ frame: frame - 25, fps, from: 0, to: 1, config: { damping: 30 } });
  const subY = spring({ frame: frame - 25, fps, from: 20, to: 0, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.linen,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 88,
          fontWeight: 400,
          fontStyle: "italic",
          color: COLORS.black,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        {title}
      </div>
      <div
        style={{
          width: lineWidth,
          height: 1,
          background: COLORS.walnut,
          margin: "32px auto",
          opacity: titleOpacity,
        }}
      />
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 16,
          fontWeight: 300,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: COLORS.walnut,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Quote from the book
const QuoteScene = ({ quote }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 30 } });
  const y = spring({ frame, fps, from: 30, to: 0, config: { damping: 20 } });
  const quoteMarkOpacity = interpolate(frame, [0, 20], [0, 0.06], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.snow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 60,
          fontFamily,
          fontSize: 400,
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
          fontSize: 44,
          fontStyle: "italic",
          fontWeight: 300,
          color: COLORS.black,
          lineHeight: 1.55,
          textAlign: "center",
          opacity,
          transform: `translateY(${y}px)`,
          maxWidth: 800,
          position: "relative",
          zIndex: 1,
        }}
      >
        {"\u201C"}{quote}{"\u201D"}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Scripture
const ScriptureScene = ({ scripture, scriptureRef }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 30 } });
  const y = spring({ frame, fps, from: 30, to: 0, config: { damping: 20 } });
  const refOpacity = spring({ frame: frame - 20, fps, from: 0, to: 1, config: { damping: 30 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.linen,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 40,
          fontStyle: "italic",
          fontWeight: 300,
          color: COLORS.black,
          lineHeight: 1.55,
          textAlign: "center",
          opacity,
          transform: `translateY(${y}px)`,
          maxWidth: 780,
        }}
      >
        {"\u201C"}{scripture}{"\u201D"}
      </div>
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 14,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: COLORS.stone,
          marginTop: 32,
          opacity: refOpacity,
        }}
      >
        {scriptureRef}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Testimonial
const TestimonialScene = ({ reviewer, review }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 30 } });
  const y = spring({ frame, fps, from: 24, to: 0, config: { damping: 20 } });
  const starsOpacity = spring({ frame: frame - 10, fps, from: 0, to: 1, config: { damping: 30 } });
  const nameOpacity = spring({ frame: frame - 25, fps, from: 0, to: 1, config: { damping: 30 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 18,
          letterSpacing: 6,
          color: COLORS.walnut,
          marginBottom: 36,
          opacity: starsOpacity,
        }}
      >
        {"★★★★★"}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 40,
          fontStyle: "italic",
          fontWeight: 300,
          color: COLORS.black,
          lineHeight: 1.55,
          textAlign: "center",
          opacity,
          transform: `translateY(${y}px)`,
          maxWidth: 760,
        }}
      >
        {"\u201C"}{review}{"\u201D"}
      </div>
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 13,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: COLORS.stone,
          marginTop: 36,
          opacity: nameOpacity,
        }}
      >
        {reviewer}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA
const CTAScene = ({ title, price, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, from: 0, to: 1, config: { damping: 30 } });
  const titleY = spring({ frame, fps, from: 30, to: 0, config: { damping: 20 } });
  const btnOpacity = spring({ frame: frame - 20, fps, from: 0, to: 1, config: { damping: 30 } });
  const btnY = spring({ frame: frame - 20, fps, from: 20, to: 0, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.black,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 72,
          fontStyle: "italic",
          fontWeight: 400,
          color: COLORS.linen,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
          lineHeight: 1.1,
          marginBottom: 20,
        }}
      >
        {title}
      </div>
      <div
        style={{
          width: 60,
          height: 1,
          background: COLORS.walnut,
          margin: "16px auto 32px",
          opacity: titleOpacity,
        }}
      />
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 14,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: COLORS.walnut,
          marginBottom: 48,
          opacity: titleOpacity,
        }}
      >
        Hardcover {price}
      </div>
      <div
        style={{
          background: COLORS.linen,
          color: COLORS.black,
          fontFamily: sansFont,
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          padding: "18px 48px",
          opacity: btnOpacity,
          transform: `translateY(${btnY}px)`,
        }}
      >
        Start Your 24 Days
      </div>
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 12,
          letterSpacing: "0.15em",
          color: COLORS.stone,
          marginTop: 24,
          opacity: btnOpacity,
        }}
      >
        {cta}
      </div>
    </AbsoluteFill>
  );
};

export const BookPromo = ({
  title,
  subtitle,
  tagline,
  quote,
  scripture,
  scriptureRef,
  reviewer,
  review,
  price,
  cta,
}) => {
  return (
    <AbsoluteFill>
      {/* Scene 1: Title (0-5s) */}
      <Sequence from={0} durationInFrames={150}>
        <TitleScene title={title} subtitle={subtitle} />
      </Sequence>

      {/* Scene 2: Love letter quote (5-10s) */}
      <Sequence from={150} durationInFrames={150}>
        <QuoteScene quote={quote} />
      </Sequence>

      {/* Scene 3: Scripture (10-15s) */}
      <Sequence from={300} durationInFrames={150}>
        <ScriptureScene scripture={scripture} scriptureRef={scriptureRef} />
      </Sequence>

      {/* Scene 4: Testimonial (15-20s) */}
      <Sequence from={450} durationInFrames={150}>
        <TestimonialScene reviewer={reviewer} review={review} />
      </Sequence>

      {/* Scene 5: CTA (20-25s) */}
      <Sequence from={600} durationInFrames={150}>
        <CTAScene title={title} price={price} cta={cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
