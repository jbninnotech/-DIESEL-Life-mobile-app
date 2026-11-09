import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

type Props = {
  onDone?: () => void;
};

const GREEN = "#2fa05f";
const BLUE = "#1f5fb0";

// Truck artwork is drawn in a 520 x 190 box and scaled to the screen.
const VB_W = 520;
const VB_H = 190;
const WHEEL_R = 24;
const WHEEL_CY = 148;
const WHEELS_X = [92, 142, 424];

// Repeating scenery positions across one screen width (0 to 1).
const TREES = [0.04, 0.2, 0.38, 0.55, 0.72, 0.88];
const CLOUDS = [0.1, 0.45, 0.8];

const TAU = Math.PI * 2;

/* ---------- helpers: periodic paths so scrolling loops seamlessly ---------- */

function ridgePath(
  w: number,
  h: number,
  base: number,
  comps: [number, number, number][]
) {
  const n = Math.ceil(w / 6);
  let d = `M0 ${h}`;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * w;
    let y = base;
    for (const [a, f, p] of comps) y += a * Math.sin((TAU * f * x) / w + p);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} L${w} ${h} Z`;
}

function wavePath(
  w: number,
  h: number,
  base: number,
  amp: number,
  cycles: number,
  phase: number
) {
  return ridgePath(w, h, base, [[amp, cycles, phase]]);
}

/* ---------- scrolling band: two copies side by side, translated by -w ---------- */

function ScrollBand({
  x,
  top,
  w,
  h,
  d,
  color,
  opacity = 1,
  stroke,
}: {
  x: Animated.Value;
  top: number;
  w: number;
  h: number;
  d: string;
  color: string;
  opacity?: number;
  stroke?: string;
}) {
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        top,
        width: w * 2,
        height: h,
        flexDirection: "row",
        transform: [{ translateX: x }],
      }}
    >
      {[0, 1].map((i) => (
        <Svg key={i} width={w} height={h}>
          <Path
            d={d}
            fill={color}
            opacity={opacity}
            stroke={stroke}
            strokeWidth={stroke ? 2.5 : 0}
          />
        </Svg>
      ))}
    </Animated.View>
  );
}

/* ---------- wheel ---------- */

function Wheel({ size }: { size: number }) {
  const lugs = Array.from({ length: 8 }).map((_, i) => {
    const a = (i / 8) * TAU;
    return { x: 24 + Math.cos(a) * 6.5, y: 24 + Math.sin(a) * 6.5 };
  });
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx={24} cy={24} r={24} fill="#14161a" />
      {/* tread nubs, visible while spinning */}
      <Circle
        cx={24}
        cy={24}
        r={22.3}
        fill="none"
        stroke="#050608"
        strokeWidth={3}
        strokeDasharray="3.2 3.2"
      />
      <Circle cx={24} cy={24} r={19} fill="#1d2026" />
      <Circle cx={24} cy={24} r={13.5} fill="#c4cad4" />
      <Circle cx={24} cy={24} r={10.5} fill="#98a0ac" />
      <Circle cx={24} cy={24} r={8.2} fill="#dde2e9" />
      {lugs.map((l, i) => (
        <Circle key={i} cx={l.x} cy={l.y} r={1.3} fill="#5e6672" />
      ))}
      <Circle cx={24} cy={24} r={3} fill="#3d434d" />
    </Svg>
  );
}

/* ---------- truck body (matches the reference photo) ---------- */

function TruckBody({ width }: { width: number }) {
  const height = (width * VB_H) / VB_W;
  const posts = Array.from({ length: 11 }).map((_, i) => 44 + i * 28);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
      <Defs>
        <LinearGradient id="tank" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="0.35" stopColor="#eff2f5" />
          <Stop offset="0.75" stopColor="#c8ced7" />
          <Stop offset="1" stopColor="#98a1ae" />
        </LinearGradient>
        <LinearGradient id="cab" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#dde2e8" />
        </LinearGradient>
        <LinearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#7b9bb3" />
          <Stop offset="1" stopColor="#2d475c" />
        </LinearGradient>
        <ClipPath id="tankClip">
          <Rect x={6} y={30} width={344} height={92} rx={46} />
        </ClipPath>
      </Defs>

      {/* chassis frame + yellow stripe */}
      <Rect x={10} y={120} width={470} height={14} rx={3} fill="#2a2d36" />
      <Rect x={96} y={128} width={240} height={3} fill="#f2c230" />

      {/* equipment under the tank: pump box, pipe, valves */}
      <Rect x={150} y={122} width={110} height={16} rx={2} fill="#333844" />
      <Rect x={158} y={116} width={92} height={5} rx={2} fill="#b9bec8" />
      <Circle cx={176} cy={118} r={4} fill="#d62828" />
      <Circle cx={232} cy={118} r={4} fill="#d62828" />

      {/* catwalk railing on top of the tank */}
      <Line x1={44} y1={14} x2={324} y2={14} stroke="#8b929d" strokeWidth={2} />
      <Line x1={44} y1={22} x2={324} y2={22} stroke="#8b929d" strokeWidth={1.6} />
      {posts.map((px) => (
        <Line
          key={px}
          x1={px}
          y1={14}
          x2={px}
          y2={32}
          stroke="#8b929d"
          strokeWidth={1.6}
        />
      ))}

      {/* tank */}
      <Rect
        x={6}
        y={30}
        width={344}
        height={92}
        rx={46}
        fill="url(#tank)"
        stroke="#c3c9d1"
        strokeWidth={1}
      />
      <G clipPath="url(#tankClip)">
        {/* soft highlight + underside shade for a metallic look */}
        <Rect x={6} y={38} width={344} height={9} fill="#ffffff" opacity={0.75} />
        <Rect x={6} y={102} width={344} height={20} fill="#6f7886" opacity={0.22} />
        {/* panel seams */}
        <Line x1={96} y1={30} x2={96} y2={122} stroke="#cdd2da" strokeWidth={1.2} />
        <Line x1={250} y1={30} x2={250} y2={122} stroke="#cdd2da" strokeWidth={1.2} />
        {/* swoosh at the front of the tank */}
        <Path
          d="M280 30 C322 40 346 80 334 128 L380 128 L380 30 Z"
          fill="#35b877"
        />
        <Path
          d="M296 30 C332 44 350 80 342 128 L380 128 L380 30 Z"
          fill="#ffffff"
          opacity={0.92}
        />
        <Path
          d="M304 30 C336 46 352 82 346 128 L380 128 L380 30 Z"
          fill="#1f6fb5"
        />
        <Path
          d="M328 30 C346 50 352 84 350 128 L380 128 L380 30 Z"
          fill="#eef1f4"
        />
      </G>

      {/* tank hatch */}
      <Rect x={120} y={25} width={30} height={7} rx={2} fill="#9aa3b0" />

      {/* LOGO: two texts meeting at one point, so no gap is possible */}
      <SvgText
        x={178}
        y={84}
        fontSize={36}
        fontWeight="800"
        letterSpacing={-0.5}
        textAnchor="end"
        fill={GREEN}
      >
        Diesel
      </SvgText>
      <SvgText
        x={177}
        y={84}
        fontSize={36}
        fontWeight="800"
        letterSpacing={-0.5}
        textAnchor="start"
        fill={BLUE}
      >
        ify
      </SvgText>
      <SvgText
        x={74}
        y={101}
        fontSize={10.5}
        fontWeight="700"
        fontStyle="italic"
        fill="#3b4150"
      >
        On-Site Diesel Delivery.
      </SvgText>

      {/* hazard placard at the rear */}
      <Rect x={16} y={64} width={26} height={36} fill="#ffffff" stroke="#8a9099" strokeWidth={1} />
      <Rect x={19} y={68} width={20} height={6} fill="#2b2f38" />
      <Path d="M29 77 L36 85 L29 93 L22 85 Z" fill="#d62828" />
      <Rect x={8} y={110} width={6} height={10} rx={1} fill="#d62828" />

      {/* CAB */}
      <Path
        d="M356 42 L452 42 Q472 42 477 62 L488 112 L490 140 L356 140 Z"
        fill="url(#cab)"
        stroke="#cfd5dc"
        strokeWidth={1.5}
      />
      <Rect x={356} y={37} width={98} height={7} rx={3} fill="#eceff3" stroke="#cfd5dc" />
      {/* door + window */}
      <Path
        d="M364 50 L424 50 L424 132 L364 132 Z"
        fill="none"
        stroke="#d3d8de"
        strokeWidth={1.2}
      />
      <Rect x={368} y={55} width={50} height={40} rx={4} fill="url(#glass)" />
      <Path d="M374 58 L388 58 L378 92 L374 92 Z" fill="#ffffff" opacity={0.16} />
      <Rect x={404} y={102} width={12} height={3} rx={1.5} fill="#9aa3b0" />
      {/* windshield */}
      <Path
        d="M428 55 L452 55 Q464 55 467 67 L474 96 L428 96 Z"
        fill="url(#glass)"
      />
      <Path d="M434 59 L446 59 L439 94 L434 94 Z" fill="#ffffff" opacity={0.16} />
      {/* small logo on the door */}
      <SvgText
        x={405}
        y={119}
        fontSize={11}
        fontWeight="800"
        textAnchor="end"
        fill={GREEN}
      >
        Diesel
      </SvgText>
      <SvgText
        x={404}
        y={119}
        fontSize={11}
        fontWeight="800"
        textAnchor="start"
        fill={BLUE}
      >
        ify
      </SvgText>
      {/* mirror */}
      <Rect x={350} y={58} width={7} height={26} rx={2} fill="#20232a" />
      <Rect x={356} y={64} width={6} height={3} fill="#20232a" />
      {/* grill, headlight, bumper, number plate */}
      <Rect x={466} y={100} width={24} height={34} rx={3} fill="#15171c" />
      {[106, 112, 118, 124, 130].map((gy) => (
        <Line key={gy} x1={468} y1={gy} x2={488} y2={gy} stroke="#3a3e48" strokeWidth={1.4} />
      ))}
      <Circle cx={478} cy={114} r={4.5} fill="none" stroke="#aeb4c0" strokeWidth={1.4} />
      <Rect x={481} y={90} width={9} height={8} rx={2} fill="#fff4c8" stroke="#cfd5dc" />
      <Rect x={452} y={132} width={40} height={11} rx={3} fill="#1f2229" />
      <Rect x={466} y={134} width={16} height={7} rx={1} fill="#f6b81e" />
      <Rect x={360} y={134} width={62} height={6} rx={2} fill="#2a2d36" />

      {/* wheel arches */}
      {WHEELS_X.map((cx) => (
        <G key={cx}>
          <Path
            d={`M${cx - 31} ${WHEEL_CY + 6} L${cx - 31} ${WHEEL_CY} A31 31 0 0 1 ${cx + 31} ${WHEEL_CY} L${cx + 31} ${WHEEL_CY + 6} Z`}
            fill="#14161b"
          />
          <Path
            d={`M${cx - 31} ${WHEEL_CY} A31 31 0 0 1 ${cx + 31} ${WHEEL_CY}`}
            fill="none"
            stroke="#3a3f4a"
            strokeWidth={2.5}
          />
        </G>
      ))}
    </Svg>
  );
}

export default function SplashAnimation({ onDone }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();

  const truckW = Math.min(W * 0.98, 460);
  const scale = truckW / VB_W;
  const truckH = VB_H * scale;
  const wheelSize = WHEEL_R * 2 * scale;

  const roadTop = H * 0.6;
  const ROAD_H = Math.max(120, H - roadTop - 60);
  const DASH = 40;
  const GAP = 30;
  const PERIOD = DASH + GAP;
  const dashCount = Math.ceil(W / PERIOD) + 2;

  // truck wheels sit on the road, a little below the road's top edge
  const truckTop = roadTop + 40 - (WHEEL_CY + WHEEL_R) * scale;

  const roadX = useRef(new Animated.Value(0)).current;
  const nearX = useRef(new Animated.Value(0)).current;
  const midX = useRef(new Animated.Value(0)).current;
  const farX = useRef(new Animated.Value(0)).current;
  const cloudsX = useRef(new Animated.Value(0)).current;
  const waveGX = useRef(new Animated.Value(0)).current;
  const waveLX = useRef(new Animated.Value(0)).current;
  const waveBX = useRef(new Animated.Value(0)).current;
  const wheelSpin = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const truckX = useRef(new Animated.Value(-truckW - 20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(14)).current;

  // Rolling tree lines (periodic, so they loop seamlessly)
  const farD = useMemo(
    () =>
      ridgePath(W, 120, 52, [
        [10, 2, 0.6],
        [6, 5, 1.7],
        [4, 11, 0.3],
        [2.5, 23, 2.1],
      ]),
    [W]
  );
  const midD = useMemo(
    () =>
      ridgePath(W, 110, 56, [
        [9, 3, 1.2],
        [6, 7, 0.4],
        [5, 15, 2.6],
        [3, 29, 0.9],
      ]),
    [W]
  );
  const waveGD = useMemo(() => wavePath(W, 100, 36, 11, 1, 0.6), [W]);
  const waveLD = useMemo(() => wavePath(W, 100, 52, 9, 1, 2.4), [W]);
  const waveBD = useMemo(() => wavePath(W, 100, 68, 8, 1, 4.1), [W]);

  useEffect(() => {
    const finish = () => {
      if (onDone) return onDone();
      router.replace("/(auth)/login");
    };

    const scroll = (v: Animated.Value, to: number, duration: number) =>
      Animated.loop(
        Animated.timing(v, {
          toValue: to,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

    // Endless motion: road, parallax scenery, waves, wheels and body bounce.
    const loops = [
      scroll(roadX, -PERIOD, 380),
      scroll(nearX, -W, 2800),
      scroll(midX, -W, 7000),
      scroll(farX, -W, 16000),
      scroll(cloudsX, -W, 40000),
      scroll(waveGX, -W, 9000),
      scroll(waveLX, -W, 7000),
      scroll(waveBX, -W, 5500),
      scroll(wheelSpin, 1, 420),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounce, {
            toValue: -1.5,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(bounce, {
            toValue: 0,
            duration: 160,
            useNativeDriver: true,
          }),
        ])
      ),
    ];
    loops.forEach((l) => l.start());

    // The story: title fades in, truck drives in, cruises mid-screen, then leaves.
    const story = Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(truckX, {
          toValue: (W - truckW) / 2,
          duration: 1900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1100),
      Animated.timing(truckX, {
        toValue: W + 30,
        duration: 1200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    story.start(({ finished }) => {
      loops.forEach((l) => l.stop());
      if (finished) finish();
    });

    return () => {
      story.stop();
      loops.forEach((l) => l.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spin = wheelSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Sky with soft sun glow */}
      <Svg
        width={W}
        height={roadTop + 10}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#6fb0e3" />
            <Stop offset="1" stopColor="#d3edf7" />
          </LinearGradient>
          <RadialGradient id="sun" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#ffffff" stopOpacity={0.85} />
            <Stop offset="1" stopColor="#ffffff" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={W} height={roadTop + 10} fill="url(#sky)" />
        <Circle cx={W * 0.8} cy={H * 0.2} r={130} fill="url(#sun)" />
      </Svg>

      {/* Clouds */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.row,
          { top: H * 0.14, width: W * 2, transform: [{ translateX: cloudsX }] },
        ]}
      >
        {[0, 1].flatMap((rep) =>
          CLOUDS.map((c, i) => (
            <MaterialCommunityIcons
              key={`${rep}-${i}`}
              name="cloud"
              size={i === 1 ? 74 : 56}
              color="#ffffff"
              style={{
                position: "absolute",
                left: rep * W + c * W,
                top: i * 24,
                opacity: 0.85,
              }}
            />
          ))
        )}
      </Animated.View>

      {/* Far + mid tree lines (parallax) */}
      <ScrollBand x={farX} top={roadTop - 112} w={W} h={120} d={farD} color="#86b79a" opacity={0.9} />
      <ScrollBand x={midX} top={roadTop - 100} w={W} h={110} d={midD} color="#4f9a62" />

      {/* Near trees */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.row,
          {
            top: roadTop - 66,
            width: W * 2,
            height: 70,
            transform: [{ translateX: nearX }],
          },
        ]}
      >
        {[0, 1].flatMap((rep) =>
          TREES.map((t, i) => (
            <MaterialCommunityIcons
              key={`${rep}-${i}`}
              name={i % 2 === 0 ? "pine-tree" : "tree"}
              size={i % 2 === 0 ? 66 : 56}
              color={i % 2 === 0 ? "#2f9e63" : "#43b36f"}
              style={{
                position: "absolute",
                left: rep * W + t * W,
                bottom: 0,
              }}
            />
          ))
        )}
      </Animated.View>

      {/* Grass */}
      <View style={[styles.grass, { top: roadTop - 8, bottom: 0 }]} />

      {/* Road */}
      <View style={[styles.road, { top: roadTop, height: ROAD_H }]}>
        <Svg width={W} height={ROAD_H} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="asphalt" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#5d626c" />
              <Stop offset="1" stopColor="#363a43" />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={ROAD_H} fill="url(#asphalt)" />
          <Rect x={0} y={4} width={W} height={3} fill="#e9edf1" opacity={0.85} />
        </Svg>
        <Animated.View
          style={[
            styles.dashRow,
            {
              top: ROAD_H * 0.62,
              width: dashCount * PERIOD,
              transform: [{ translateX: roadX }],
            },
          ]}
        >
          {Array.from({ length: dashCount }).map((_, i) => (
            <View
              key={i}
              style={{
                width: DASH,
                height: 5,
                borderRadius: 3,
                backgroundColor: "#f4f6f8",
                marginRight: GAP,
              }}
            />
          ))}
        </Animated.View>
      </View>

      {/* Truck */}
      <Animated.View
        style={[
          styles.truck,
          {
            top: truckTop,
            width: truckW,
            height: truckH,
            transform: [{ translateX: truckX }],
          },
        ]}
      >
        {/* ground shadow */}
        <View
          style={{
            position: "absolute",
            left: 16 * scale,
            width: 450 * scale,
            top: (WHEEL_CY + WHEEL_R - 6) * scale,
            height: 12 * scale,
            borderRadius: 40,
            backgroundColor: "rgba(0,0,0,0.28)",
          }}
        />
        <Animated.View style={{ transform: [{ translateY: bounce }] }}>
          <TruckBody width={truckW} />
        </Animated.View>
        {WHEELS_X.map((cx) => (
          <Animated.View
            key={cx}
            style={{
              position: "absolute",
              left: cx * scale - wheelSize / 2,
              top: WHEEL_CY * scale - wheelSize / 2,
              transform: [{ rotate: spin }],
            }}
          >
            <Wheel size={wheelSize} />
          </Animated.View>
        ))}
      </Animated.View>

      {/* Bottom wave (green, light blue, deep blue) like the reference photo */}
      <ScrollBand x={waveGX} top={H - 100} w={W} h={100} d={waveGD} color="#35b877" />
      <ScrollBand x={waveLX} top={H - 100} w={W} h={100} d={waveLD} color="#1f86d6" stroke="#ffffff" />
      <ScrollBand x={waveBX} top={H - 100} w={W} h={100} d={waveBD} color="#0b4a9c" />

      {/* Title */}
      <Animated.View
        style={[
          styles.titleWrap,
          {
            top: insets.top + 48,
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
          },
        ]}
      >
        <Text style={styles.name}>
          <Text style={{ color: GREEN }}>Diesel</Text>
          <Text style={{ color: BLUE }}>ify</Text>
        </Text>
        <Text style={styles.tagline}>On-Site Diesel Delivery</Text>
        <Text style={styles.unit}>A UNIT OF CNS ADVISORS</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#7fd18b", overflow: "hidden" },
  row: { position: "absolute", left: 0 },
  titleWrap: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  name: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "600",
    color: "#14405f",
    marginTop: 2,
  },
  unit: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#14405f",
    opacity: 0.7,
    marginTop: 6,
  },
  grass: { position: "absolute", left: 0, right: 0, backgroundColor: "#7fd18b" },
  road: {
    position: "absolute",
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  dashRow: { position: "absolute", left: 0, flexDirection: "row", alignItems: "center" },
  truck: { position: "absolute", left: 0 },
});