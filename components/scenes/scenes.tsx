import type { ComponentType } from "react";

import {
  Bank,
  FrameFronds,
  Forest,
  GroveLine,
  Hill,
  Mist,
  Palm,
  Reeds,
  Ridge,
  Ripples,
  SceneLayers,
  Stone,
  WATERLINE,
  type Tint,
} from "./kit";
import {
  Basket,
  Bunting,
  Canoe,
  FishingNet,
  Footbridge,
  House,
  Houseboat,
  Jetty,
  Lamp,
  Stall,
  Veranda,
  Waterfall,
} from "./kit-craft";
import { BirdFlock, Ducks, Egret, Figure, Smoke, WashingLine } from "./kit-life";

const base = WATERLINE;
const top = (height: number) => WATERLINE - height + 2;

const dawn: Tint = {
  far: "#b5c4c4",
  bank: "#7d9a86",
  lip: "#688677",
  leaf: "#5f8270",
  shade: "#4f7262",
  trunk: "#5f5a50",
  roof: "#a06a55",
  wall: "#e4dccb",
  glow: "#c8a24a",
};

const morning: Tint = {
  far: "#d9c9a0",
  bank: "#6f9450",
  lip: "#5a7c40",
  leaf: "#4b7b3c",
  shade: "#3a6530",
  trunk: "#6f5237",
  roof: "#b4492b",
  wall: "#f3e6c8",
  glow: "#c8a24a",
};

const midday: Tint = {
  far: "#8fc4ae",
  bank: "#4f8a44",
  lip: "#3f7238",
  leaf: "#3c6e30",
  shade: "#2d5a25",
  trunk: "#6f5237",
  roof: "#b4492b",
  wall: "#f3ede0",
  glow: "#c8a24a",
};

const golden: Tint = {
  far: "#d8a468",
  bank: "#6d7a3a",
  lip: "#58642d",
  leaf: "#4d5e2c",
  shade: "#3d4c22",
  trunk: "#5a4029",
  roof: "#a03f24",
  wall: "#f0d8a8",
  glow: "#c8a24a",
};

const nightfall: Tint = {
  far: "#1f5450",
  bank: "#123f3b",
  lip: "#0d3330",
  leaf: "#0c2f2d",
  shade: "#0a2725",
  trunk: "#0c2f2d",
  roof: "#0b2c2b",
  wall: "#1a4a46",
  glow: "#f3d98b",
};

function ShoreScene() {
  const tint = dawn;
  return (
    <SceneLayers
      name="shore"
      far={
        <>
          <Ridge points={[[260, 20], [520, 100], [760, 60], [1040, 150], [1280, 90], [1600, 130]]} fill="#c3cfce" />
          <GroveLine x={200} width={1400} base={base} height={92} fill={tint.far} />
        </>
      }
      mid={
        <>
          <Bank x={0} width={700} height={38} fill={tint.bank} lip={tint.lip} seed={3} />
          <Bank x={1160} width={440} height={64} fill={tint.bank} lip={tint.lip} seed={2} />
          <Palm x={1300} base={top(64)} height={250} lean={-34} tint={tint} sway="sway" />
          <Palm x={1420} base={top(64)} height={300} tint={tint} sway="sway" />
          <Palm x={1530} base={top(64)} height={220} lean={-22} tint={tint} />
          <Palm x={190} base={top(38)} height={160} tint={tint} />
          <Jetty x={1204} width={280} />
          <path className="cast-rope" d="M1206 598Q1176 632 1150 612" fill="none" stroke="#3f3226" strokeWidth="3" strokeLinecap="round" />
          <Egret x={930} base={base + 2} height={84} />
          <Canoe x={730} base={base - 2} width={120} />
          <Figure x={786} base={base - 8} scale={0.62} pose="reach" cloth="#e4dccb" />
        </>
      }
      fore={
        <>
          <Ripples color="#f3ede0" lines={[[140, 60, 120], [620, 110, 90], [1040, 44, 150], [1320, 150, 110]]} />
          <Reeds x={1500} color={tint.leaf} />
          <Reeds x={1570} color={tint.shade} />
        </>
      }
      frame={
        <>
          <FrameFronds side="right" fill={tint.shade} />
          <g className="cast-mist">
            <Mist x={420} y={606} width={1180} color="#f3ede0" />
          </g>
        </>
      }
    />
  );
}

function BoatmanScene() {
  const tint = dawn;
  return (
    <SceneLayers
      name="boatman"
      far={
        <>
          <Ridge points={[[0, 40], [300, 130], [620, 80], [980, 140], [1600, 40]]} fill={tint.far} />
          <Mist y={560} color="#f3ede0" />
        </>
      }
      mid={
        <>
          <GroveLine x={880} width={720} base={top(30)} height={110} fill={tint.far} seed={5} />
          <Bank x={960} width={640} height={32} fill={tint.bank} lip={tint.lip} seed={7} />
          <Bank x={0} width={930} height={74} fill={tint.bank} lip={tint.lip} seed={4} />
          <Palm x={84} base={top(74)} height={320} lean={36} tint={tint} sway="sway" />
          <Veranda x={150} base={top(74)} tint={tint} />
          <Palm x={590} base={top(74)} height={300} lean={-24} tint={tint} sway="sway" />
          <WashingLine x={620} y={top(74) - 62} width={170} colors={["#b4492b", "#f3ede0", "#c8a24a", "#f3ede0"]} />
          <Palm x={840} base={top(74)} height={240} tint={tint} />
          <BirdFlock birds={[[720, 200], [770, 170], [680, 150]]} color="#4f5a55" />
        </>
      }
      fore={
        <>
          <Ripples color="#f3ede0" lines={[[300, 70, 100], [840, 130, 140], [1240, 60, 120]]} />
          <Ducks x={120} y={110} count={10} />
          <Reeds x={40} color={tint.leaf} />
          <Reeds x={880} color={tint.shade} />
        </>
      }
      frame={<FrameFronds side="left" fill={tint.shade} />}
    />
  );
}

function SourceScene() {
  return (
    <SceneLayers
      name="source"
      far={
        <>
          <Ridge points={[[0, 180], [240, 310], [520, 240], [800, 400], [1040, 300], [1300, 380], [1600, 220]]} fill="#dcbba5" />
          <Ridge points={[[0, 90], [300, 200], [620, 150], [940, 260], [1260, 190], [1600, 120]]} fill="#cfa98f" />
          <Mist x={100} y={420} width={1400} color="#fbe6c8" />
        </>
      }
      mid={
        <>
          <Ridge points={[[560, 20], [760, 140], [940, 230], [1080, 330], [1200, 400], [1330, 340], [1470, 270], [1600, 200]]} fill="#8fa070" />
          <Forest x={760} width={840} base={500} size={30} fill="#7b9462" seed={2} />
          <Forest x={700} width={900} base={566} size={36} fill="#67864f" seed={4} />
          <path d="M1136 330Q1140 268 1206 268Q1272 268 1276 330L1300 612H1112Z" fill="#6d7f58" />
          <Waterfall x={1178} top={288} bottom={612} width={58} />
          <Bank x={620} width={980} height={26} fill="#5a7c40" lip="#4b6a36" seed={6} />
          <Palm x={1420} base={top(26)} height={190} tint={morning} sway="sway" />
          <Palm x={1040} base={top(26)} height={150} lean={-16} tint={morning} />
          <BirdFlock birds={[[900, 150], [960, 112], [1010, 164]]} color="#6f5237" />
        </>
      }
      fore={
        <>
          <Stone x={1110} y={40} width={58} fill="#b8a78e" />
          <Stone x={1250} y={96} width={84} fill="#a8967d" />
          <Stone x={1400} y={46} width={50} fill="#b8a78e" />
          <Stone x={1520} y={150} width={70} fill="#a8967d" />
          <Stone x={760} y={190} width={46} fill="#b8a78e" />
          <Ripples color="#fbe6c8" lines={[[220, 90, 110], [660, 150, 120], [1120, 200, 130]]} />
        </>
      }
      frame={
        <Mist x={640} y={520} width={960} color="#fbe6c8" />
      }
    />
  );
}

function CanalScene() {
  const tint = morning;
  const pale = { ...tint, leaf: "#a8b878", shade: "#98aa6a", trunk: "#a8b878" };
  return (
    <SceneLayers
      name="canal"
      far={
        <>
          <Palm x={260} base={base} height={320} tint={pale} />
          <Palm x={640} base={base} height={350} lean={-30} tint={pale} />
          <Palm x={980} base={base} height={300} tint={pale} />
          <GroveLine x={0} width={1600} base={base} height={120} fill="#b6c28a" seed={3} />
        </>
      }
      mid={
        <>
          <Bank x={1040} width={560} height={112} fill={tint.bank} lip={tint.lip} seed={8} />
          <House x={1180} base={top(112)} width={150} tint={tint} />
          <Palm x={1120} base={top(112)} height={320} lean={-20} tint={tint} />
          <Bank x={0} width={1010} height={100} fill={tint.bank} lip={tint.lip} seed={9} />
          <Palm x={70} base={top(100)} height={340} lean={26} tint={tint} sway="sway" />
          <House x={130} base={top(100)} width={170} tint={tint} />
          <Smoke x={200} y={top(100) - 170} />
          <Palm x={340} base={top(100)} height={300} lean={-22} tint={tint} sway="sway" />
          <House x={390} base={top(100)} width={140} tint={tint} />
          <WashingLine x={566} y={top(100) - 62} width={130} colors={["#f3ede0", "#1f7a74", "#f3ede0"]} />
          <House x={730} base={top(100)} width={150} tint={tint} />
          <Palm x={900} base={top(100)} height={330} lean={-30} tint={tint} sway="sway" />
          <g fill="#a8967d" stroke="#14221f" strokeWidth="2">
            <rect x="524" y={top(32)} width="84" height="14" />
            <rect x="514" y={top(18)} width="104" height="20" />
          </g>
          <Figure x={566} base={top(32)} scale={0.9} cloth="#b4492b" shirt="#f3ede0" wrap="#14221f" />
          <BirdFlock birds={[[520, 110], [580, 84], [640, 124]]} color="#6f5237" />
        </>
      }
      fore={
        <>
          <Ripples color="#fbf2d4" lines={[[180, 70, 110], [760, 120, 140], [1260, 56, 120]]} />
          <Canoe x={60} base={60} width={170} />
          <Reeds x={30} color={tint.leaf} />
          <Reeds x={930} color={tint.shade} />
        </>
      }
      frame={<FrameFronds side="left" fill={tint.shade} />}
    />
  );
}

function WaterScene() {
  const tint = midday;
  return (
    <SceneLayers
      name="water"
      far={
        <>
          <Hill x={0} width={700} height={50} fill={tint.far} />
          <Hill x={620} width={980} height={70} fill={tint.far} />
          <GroveLine x={0} width={1600} base={base} height={70} fill="#79b39b" seed={6} />
        </>
      }
      mid={
        <>
          <Bank x={0} width={560} height={30} fill={tint.bank} lip={tint.lip} seed={2} />
          <Palm x={200} base={top(30)} height={170} tint={tint} />
          <Bank x={1160} width={440} height={50} fill={tint.bank} lip={tint.lip} seed={5} />
          <FishingNet x={1520} base={top(50)} scale={0.72} />
          <Palm x={1570} base={top(50)} height={250} lean={-36} tint={tint} sway="sway" />
          <FishingNet x={1270} base={top(50)} />
          <Figure x={1340} base={top(44)} pose="reach" cloth="#f3ede0" wrap="#b4492b" />
          <Figure x={1390} base={top(44)} scale={0.95} cloth="#1f7a74" wrap="#f3ede0" />
          <g data-catch>
            <g className="catch-fish" fill="#c7d6d2" stroke="#14221f" strokeWidth="1.5">
              <path d="M1450 562q14 -12 30 0l8 -7v14l-8 -7q-16 12 -30 0Z" />
              <path d="M1458 548q12 -10 26 0l7 -6v12l-7 -6q-14 10 -26 0Z" />
            </g>
            <Basket x={1446} base={top(46)} size={46} />
          </g>
          <BirdFlock birds={[[720, 200], [770, 150], [830, 214], [660, 142]]} color="#14221f" />
        </>
      }
      fore={
        <>
          <Ripples color="#d6efe2" lines={[[120, 60, 150], [640, 120, 130], [1100, 50, 170], [1340, 170, 120]]} />
          <Canoe x={1040} base={150} width={150} />
        </>
      }
      frame={<FrameFronds side="right" fill={tint.shade} />}
    />
  );
}

function LakeScene() {
  const tint = midday;
  return (
    <SceneLayers
      name="lake"
      far={
        <>
          <Hill x={0} width={1600} height={44} fill={tint.far} />
          <GroveLine x={0} width={1600} base={base} height={64} fill="#79b39b" seed={9} />
        </>
      }
      mid={
        <>
          <Bank x={1180} width={420} height={30} fill={tint.bank} lip={tint.lip} seed={3} />
          <Palm x={1400} base={top(30)} height={190} tint={tint} />
          <Houseboat x={1090} base={base + 2} width={210} />
          <Houseboat x={50} base={base + 4} width={480} />
          <Figure x={500} base={base - 44} scale={0.9} cloth="#f3ede0" wrap="#b4492b" />
          <Egret x={620} base={base + 2} height={70} />
          <BirdFlock birds={[[640, 180], [700, 140], [760, 192]]} color="#14221f" />
        </>
      }
      fore={
        <>
          <Ripples color="#d6efe2" lines={[[80, 210, 150], [560, 40, 130], [1120, 180, 150]]} />
          <g stroke="#14221f" strokeWidth="2">
            <rect x="110" y="136" width="380" height="16" fill="#6f5237" />
            <rect x="150" y="152" width="30" height="18" fill="#6f5237" />
            <rect x="420" y="152" width="30" height="18" fill="#6f5237" />
          </g>
          <Basket x={150} base={136} size={50} />
          <Basket x={224} base={136} size={40} />
          <Basket x={380} base={136} size={46} />
          <Ducks x={640} y={200} count={7} />
        </>
      }
    />
  );
}

function ChannelsScene() {
  const tint = golden;
  return (
    <SceneLayers
      name="channels"
      far={
        <>
          <Hill x={300} width={1300} height={110} fill={tint.far} />
          <GroveLine x={200} width={1400} base={base} height={100} fill="#b7904f" seed={4} />
        </>
      }
      mid={
        <>
          <Bank x={0} width={660} height={56} fill={tint.bank} lip={tint.lip} seed={4} />
          <Palm x={210} base={top(56)} height={210} tint={tint} />
          <Bank x={1490} width={110} height={84} fill={tint.bank} lip={tint.lip} seed={2} />
          <Palm x={1560} base={top(84)} height={300} lean={-34} tint={tint} sway="sway" />
          <Footbridge x={1240} width={330} base={top(64)} />
          <Bank x={990} width={330} height={92} fill={tint.bank} seed={7} />
          <Palm x={1090} base={top(92)} height={290} lean={20} tint={tint} sway="sway" />
          <Palm x={1210} base={top(92)} height={250} lean={-26} tint={tint} />
          <Figure x={1420} base={top(64) - 88} scale={0.9} cloth="#f0d8a8" wrap="#a03f24" />
          <BirdFlock birds={[[820, 180], [880, 140]]} color="#5a4029" />
        </>
      }
      fore={
        <>
          <Stone x={1146} y={214} width={30} fill="#8c7a5e" />
          <Stone x={1098} y={190} width={18} fill="#a08d70" />
          <Ripples color="#f6d79a" lines={[[260, 90, 120], [760, 60, 110], [1350, 120, 130]]} />
          <Reeds x={70} color={tint.leaf} />
        </>
      }
      frame={<FrameFronds side="right" fill={tint.shade} />}
    />
  );
}

function MarketScene() {
  const tint = golden;
  const spice = ["#b4492b", "#c8a24a", "#4b7b3c", "#6f5237"];
  const reversed = [...spice].reverse();
  const flags = ["#b4492b", "#c8a24a", "#f3ede0", "#4b7b3c"];
  return (
    <SceneLayers
      name="market"
      far={
        <>
          <Hill x={200} width={1400} height={80} fill={tint.far} />
          <GroveLine x={0} width={1600} base={base} height={90} fill="#b7904f" seed={8} />
        </>
      }
      mid={
        <>
          <Bank x={960} width={640} height={32} fill={tint.bank} lip={tint.lip} seed={5} />
          <Palm x={1460} base={top(32)} height={200} tint={tint} />
          <Bank x={0} width={950} height={70} fill={tint.bank} lip={tint.lip} seed={6} />
          <Palm x={40} base={top(70)} height={350} lean={30} tint={tint} sway="sway" />
          <Palm x={900} base={top(70)} height={330} lean={-30} tint={tint} sway="sway" />
          <Bunting from={[52, top(70) - 262]} to={[892, top(70) - 262]} colors={flags} />
          <Stall index={0} x={72} base={top(70)} awning="#b4492b" jars={spice} />
          <Stall index={1} x={280} base={top(70)} awning="#f0d8a8" jars={reversed} />
          <Stall index={2} x={488} base={top(70)} awning="#4b7b3c" jars={spice} />
          <Stall index={3} x={696} base={top(70)} awning="#c8a24a" jars={reversed} />
          <Figure x={268} base={top(58)} cloth="#f3ede0" wrap="#b4492b" />
          <Figure x={476} base={top(58)} scale={0.96} cloth="#1f7a74" shirt="#f0d8a8" wrap="#14221f" />
          <Figure x={684} base={top(58)} scale={1.02} cloth="#b4492b" shirt="#f3ede0" wrap="#f3ede0" />
        </>
      }
      fore={
        <>
          <Ripples color="#f6d79a" lines={[[160, 80, 130], [720, 50, 140], [1220, 110, 150]]} />
          <Canoe x={760} base={96} width={150} />
          <Reeds x={30} color={tint.leaf} />
        </>
      }
      frame={<FrameFronds side="left" fill={tint.shade} />}
    />
  );
}

function HarborScene() {
  const tint = nightfall;
  const lamps = [760, 1000, 1200, 1460];
  const lights = ["#f3d98b"];
  return (
    <SceneLayers
      name="harbor"
      far={
        <>
          <Hill x={0} width={800} height={70} fill={tint.far} />
          <Hill x={700} width={900} height={100} fill={tint.far} />
          <GroveLine x={0} width={1600} base={base} height={90} fill="#1a4a46" seed={7} />
        </>
      }
      mid={
        <>
          <Bank x={0} width={520} height={44} fill={tint.bank} lip={tint.lip} seed={8} />
          <Palm x={200} base={top(44)} height={190} tint={tint} />
          <Bank x={640} width={960} height={70} fill={tint.bank} lip={tint.lip} seed={3} />
          <House x={800} base={top(70)} width={150} tint={tint} lit="lit" />
          <House x={1030} base={top(70)} width={130} tint={tint} lit="lit" />
          <House x={1240} base={top(70)} width={170} tint={tint} lit="lit" />
          <Palm x={1500} base={top(70)} height={290} lean={-30} tint={tint} sway="sway" />
          <Bunting from={[760, top(70) - 136]} to={[1000, top(70) - 136]} sag={16} colors={lights} />
          <Bunting from={[1200, top(70) - 136]} to={[1460, top(70) - 136]} sag={16} colors={lights} />
          {lamps.map((x, order) => (
            <Lamp key={x} x={x} base={top(70)} lit="lit" order={order} />
          ))}
          <Jetty x={640} width={210} />
          <Figure x={716} base={top(26) - 12} cloth="#c9d6d0" shirt="#0c2f2d" wrap="#0c2f2d" />
          <Houseboat x={1380} base={base + 2} width={200} />
          <g stroke="#0a2725" strokeWidth="6" strokeLinecap="round">
            <path d="M560 630L568 400M594 630L584 448" />
          </g>
          <Canoe x={500} base={base} width={180} />
        </>
      }
      fore={
        <>
          <g className="arrive-lamp" stroke="#f3d98b" strokeLinecap="round" strokeWidth="4" opacity="0.55">
            {lamps.map((x) => (
              <path key={x} d={`M${x - 16} 14h32M${x - 24} 44h48M${x - 12} 78h24M${x - 18} 112h36`} />
            ))}
          </g>
          <Ripples color="#f3d98b" lines={[[300, 120, 110], [880, 190, 120]]} />
        </>
      }
    />
  );
}

export const scenes: Record<string, ComponentType> = {
  shore: ShoreScene,
  boatman: BoatmanScene,
  source: SourceScene,
  canal: CanalScene,
  water: WaterScene,
  lake: LakeScene,
  channels: ChannelsScene,
  market: MarketScene,
  harbor: HarborScene,
};
