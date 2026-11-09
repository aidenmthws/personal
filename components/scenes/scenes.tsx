import type { ComponentType } from "react";

import {
  Bank,
  Basket,
  Bird,
  FishingNet,
  Footbridge,
  Hill,
  House,
  Houseboat,
  Jetty,
  Lamp,
  Mist,
  Palm,
  Reeds,
  Ripples,
  SceneLayers,
  Stall,
  Stone,
  Veranda,
  WATERLINE,
  type Tint,
} from "./kit";

const base = WATERLINE;
const top = (height: number) => WATERLINE - height + 2;

const dawn: Tint = {
  far: "#b5c4c4",
  bank: "#7d9a86",
  leaf: "#5f8270",
  trunk: "#5f5a50",
  roof: "#a06a55",
  wall: "#e4dccb",
  glow: "#c8a24a",
};

const morning: Tint = {
  far: "#d9c9a0",
  bank: "#6f9450",
  leaf: "#4b7b3c",
  trunk: "#6f5237",
  roof: "#b4492b",
  wall: "#f3e6c8",
  glow: "#c8a24a",
};

const midday: Tint = {
  far: "#8fc4ae",
  bank: "#4f8a44",
  leaf: "#3c6e30",
  trunk: "#6f5237",
  roof: "#b4492b",
  wall: "#f3ede0",
  glow: "#c8a24a",
};

const golden: Tint = {
  far: "#d8a468",
  bank: "#6d7a3a",
  leaf: "#4d5e2c",
  trunk: "#5a4029",
  roof: "#a03f24",
  wall: "#f0d8a8",
  glow: "#c8a24a",
};

const nightfall: Tint = {
  far: "#1f5450",
  bank: "#123f3b",
  leaf: "#0c2f2d",
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
          <Hill x={380} width={760} height={90} fill={tint.far} />
          <Hill x={980} width={620} height={120} fill={tint.far} />
          <Mist y={560} color="#f3ede0" />
        </>
      }
      mid={
        <>
          <Bank x={60} width={520} height={46} fill={tint.bank} />
          <Bank x={1040} width={520} height={60} fill={tint.bank} />
          <Palm x={240} base={top(46)} height={190} tint={tint} />
          <Palm x={1180} base={top(60)} height={230} lean={-30} tint={tint} />
          <Palm x={1400} base={top(60)} height={190} tint={tint} />
          <Jetty x={840} width={230} />
        </>
      }
      fore={
        <>
          <Ripples color="#f3ede0" lines={[[140, 60, 120], [620, 110, 90], [1040, 44, 150], [1320, 150, 110]]} />
          <Reeds x={1480} color={tint.leaf} />
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
      far={<Hill x={220} width={1200} height={100} fill={tint.far} />}
      mid={
        <>
          <Bank x={760} width={800} height={70} fill={tint.bank} />
          <Bank x={40} width={480} height={40} fill={tint.bank} />
          <Veranda x={960} base={top(70)} tint={tint} />
          <Palm x={860} base={top(70)} height={260} lean={-24} tint={tint} />
          <Palm x={1400} base={top(70)} height={230} tint={tint} />
          <Palm x={250} base={top(40)} height={170} tint={tint} />
        </>
      }
      fore={
        <>
          <Ripples color="#f3ede0" lines={[[300, 70, 100], [840, 130, 140], [1240, 60, 120]]} />
          <Reeds x={800} color={tint.leaf} />
        </>
      }
    />
  );
}

function SourceScene() {
  return (
    <SceneLayers
      name="source"
      far={
        <>
          <Hill x={0} width={720} height={250} fill="#d9b7a0" />
          <Hill x={540} width={760} height={330} fill="#cfa98f" />
          <Hill x={1020} width={580} height={280} fill="#d9b7a0" />
          <Mist y={380} color="#fbe6c8" />
        </>
      }
      mid={
        <>
          <Hill x={40} width={640} height={130} fill="#8fa070" />
          <Hill x={820} width={740} height={170} fill="#7b9462" />
          <Palm x={1120} base={top(120)} height={150} tint={morning} />
          <Bird x={1040} y={160} color="#6f5237" />
          <Bird x={1100} y={124} color="#6f5237" />
          <Mist y={540} color="#fbe6c8" />
        </>
      }
      fore={
        <>
          <Stone x={880} y={60} width={46} fill="#b8a78e" />
          <Stone x={1040} y={120} width={62} fill="#a8967d" />
          <Stone x={1230} y={70} width={40} fill="#b8a78e" />
          <Stone x={1390} y={150} width={54} fill="#a8967d" />
          <Ripples color="#fbe6c8" lines={[[220, 90, 110], [660, 150, 120], [1120, 200, 130]]} />
        </>
      }
    />
  );
}

function CanalScene() {
  const tint = morning;
  return (
    <SceneLayers
      name="canal"
      far={
        <>
          <Palm x={520} base={base} height={250} tint={{ ...tint, leaf: "#a8b878", trunk: "#a8b878" }} />
          <Palm x={1050} base={base} height={280} lean={-30} tint={{ ...tint, leaf: "#a8b878", trunk: "#a8b878" }} />
        </>
      }
      mid={
        <>
          <Bank x={0} width={760} height={90} fill={tint.bank} />
          <Bank x={800} width={800} height={110} fill={tint.bank} />
          <House x={200} base={top(90)} width={130} tint={tint} />
          <House x={460} base={top(90)} width={110} tint={tint} />
          <House x={920} base={top(110)} width={150} tint={tint} />
          <House x={1200} base={top(110)} width={130} tint={tint} />
          <Palm x={120} base={top(90)} height={280} tint={tint} />
          <Palm x={850} base={top(110)} height={300} lean={-26} tint={tint} />
          <Palm x={1120} base={top(110)} height={320} tint={tint} />
          <Palm x={1420} base={top(110)} height={290} lean={-30} tint={tint} />
        </>
      }
      fore={
        <>
          <Ripples color="#fbf2d4" lines={[[180, 70, 110], [760, 120, 140], [1260, 56, 120]]} />
          <Reeds x={1500} color={tint.leaf} />
          <Reeds x={90} color={tint.leaf} />
        </>
      }
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
        </>
      }
      mid={
        <>
          <Bank x={760} width={840} height={44} fill={tint.bank} />
          <Bank x={80} width={440} height={36} fill={tint.bank} />
          <FishingNet x={860} base={top(44)} />
          <FishingNet x={1180} base={top(44)} />
          <Palm x={1500} base={top(44)} height={210} lean={-24} tint={tint} />
          <Palm x={240} base={top(36)} height={170} tint={tint} />
          <Bird x={700} y={200} color="#14221f" />
          <Bird x={770} y={160} color="#14221f" />
        </>
      }
      fore={<Ripples color="#d6efe2" lines={[[120, 60, 150], [640, 120, 130], [1100, 50, 170], [1340, 170, 120]]} />}
    />
  );
}

function LakeScene() {
  const tint = midday;
  return (
    <SceneLayers
      name="lake"
      far={<Hill x={280} width={1320} height={44} fill={tint.far} />}
      mid={
        <>
          <Bank x={1180} width={420} height={30} fill={tint.bank} />
          <Palm x={1400} base={top(30)} height={170} tint={tint} />
          <Houseboat x={770} base={base + 2} width={180} />
          <Houseboat x={1210} base={base + 2} width={340} />
        </>
      }
      fore={
        <>
          <Ripples color="#d6efe2" lines={[[80, 150, 150], [560, 40, 130], [1120, 180, 150]]} />
          <g stroke="#14221f" strokeWidth="2">
            <rect x="1220" y="126" width="360" height="16" fill="#6f5237" />
            <rect x="1260" y="142" width="30" height="18" fill="#6f5237" />
            <rect x="1510" y="142" width="30" height="18" fill="#6f5237" />
          </g>
          <Basket x={1260} base={126} size={46} />
          <Basket x={1330} base={126} size={38} />
          <Basket x={1490} base={126} size={42} />
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
      far={<Hill x={560} width={1040} height={110} fill={tint.far} />}
      mid={
        <>
          <Bank x={0} width={600} height={60} fill={tint.bank} />
          <Bank x={700} width={330} height={84} fill={tint.bank} />
          <Bank x={1330} width={270} height={84} fill={tint.bank} />
          <Footbridge x={960} width={440} base={top(70)} />
          <Palm x={840} base={top(84)} height={240} lean={-20} tint={tint} />
          <Palm x={1480} base={top(84)} height={260} lean={-28} tint={tint} />
          <Palm x={220} base={top(60)} height={200} tint={tint} />
        </>
      }
      fore={
        <>
          <Ripples color="#f6d79a" lines={[[260, 90, 120], [900, 60, 110], [1170, 130, 130]]} />
          <Reeds x={760} color={tint.leaf} />
          <Reeds x={1560} color={tint.leaf} />
        </>
      }
    />
  );
}

function MarketScene() {
  const tint = golden;
  const spice = ["#b4492b", "#c8a24a", "#4b7b3c", "#6f5237"];
  return (
    <SceneLayers
      name="market"
      far={
        <>
          <Hill x={200} width={1400} height={80} fill={tint.far} />
        </>
      }
      mid={
        <>
          <Bank x={660} width={940} height={60} fill={tint.bank} />
          <Bank x={40} width={440} height={36} fill={tint.bank} />
          <Stall x={740} base={top(60)} awning="#b4492b" jars={spice} />
          <Stall x={930} base={top(60)} awning="#f0d8a8" jars={[...spice].reverse()} />
          <Stall x={1120} base={top(60)} awning="#4b7b3c" jars={spice} />
          <Stall x={1310} base={top(60)} awning="#c8a24a" jars={[...spice].reverse()} />
          <Palm x={240} base={top(36)} height={170} tint={tint} />
        </>
      }
      fore={
        <>
          <Ripples color="#f6d79a" lines={[[160, 80, 130], [720, 50, 140], [1220, 110, 150]]} />
          <Reeds x={620} color={tint.leaf} />
        </>
      }
    />
  );
}

function HarborScene() {
  const tint = nightfall;
  return (
    <SceneLayers
      name="harbor"
      far={
        <>
          <Hill x={0} width={800} height={70} fill={tint.far} />
          <Hill x={700} width={900} height={100} fill={tint.far} />
        </>
      }
      mid={
        <>
          <Bank x={640} width={960} height={64} fill={tint.bank} />
          <Bank x={0} width={520} height={44} fill={tint.bank} />
          <House x={800} base={top(64)} width={150} tint={tint} lit="lit" />
          <House x={1020} base={top(64)} width={130} tint={tint} lit="lit" />
          <House x={1250} base={top(64)} width={160} tint={tint} lit="lit" />
          <Palm x={1460} base={top(64)} height={240} lean={-26} tint={tint} />
          <Palm x={200} base={top(44)} height={190} tint={tint} />
          {[720, 980, 1190, 1430].map((x) => (
            <Lamp key={x} x={x} base={top(64)} lit="lit" />
          ))}
          <Jetty x={640} width={210} />
        </>
      }
      fore={
        <Ripples
          color="#f3d98b"
          lines={[[700, 40, 70], [960, 70, 80], [1180, 40, 70], [1420, 80, 80], [300, 120, 110]]}
        />
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
