import * as React from "react";
import RootDiv from "react-div-100vh";
import { Box } from "@chakra-ui/react";
import { Stage, Layer, Arc } from "react-konva";
import { useElementSize, useInterval } from "usehooks-ts";
import interpolate from "color-interpolate";
import useSound from "use-sound";

const majorSound = require("./sounds/major.mp3");
const minorSound = require("./sounds/minor.wav");

interface IArc {
  color: string;
  radius: number;
}

const targetMinutes = 45;
const div = 5;
const numArcs = targetMinutes / div;
const arcWidth = 15;
const arcSpacing = 5;
const arcOffset = arcWidth + arcSpacing;
const maxTime = div * 60;

let colormap = interpolate([
  "#9F7AEA",
  "#4299E1",
  "#38B2AC",
  "#48BB78",
  "#ECC94B",
  "#ED8936",
  "#F56565",
  "#F56565"
]);

function generateArcs(): IArc[] {
  const arcs = [];
  for (let i = 0; i < numArcs; i++) {
    const color = colormap(i / numArcs);
    const radius = arcOffset + i * arcOffset;
    arcs.push({ color, radius });
  }
  return arcs.reverse();
}

export default function App() {
  const [playMinor] = useSound(minorSound);
  const [playMajor] = useSound(majorSound);
  const [remaining, setRemaining] = React.useState<number>(maxTime);
  const [delay, setDelay] = React.useState<number | null>(50);
  const [ctrRef, { width, height }] = useElementSize();
  const [arcs, setArcs] = React.useState<IArc[]>(generateArcs());

  const frac = remaining / maxTime;
  const deg = 360 * frac;

  useInterval(() => {
    if (arcs.length === 0) {
      setDelay(null);
      playMajor();
      return;
    }
    if (frac <= 0) {
      setRemaining(maxTime);
      setArcs(arcs.splice(0, arcs.length - 1));
      playMinor();
      return;
    }
    setRemaining((r) => r - 1);
  }, delay);

  return (
    <RootDiv>
      <Box ref={ctrRef} h="100%" w="100vw">
        <Stage width={width} height={height}>
          <Layer>
            {arcs.map((arc, i) => (
              <React.Fragment key={i}>
                <Arc
                  fill="#2D3748"
                  x={width / 2}
                  y={height / 2}
                  angle={360}
                  innerRadius={arc.radius}
                  outerRadius={arc.radius + arcSpacing}
                />
                <Arc
                  fill={arc.color}
                  x={width / 2}
                  y={height / 2}
                  angle={i === arcs.length - 1 ? deg : 360}
                  rotationDeg={90 - deg / 2}
                  innerRadius={0}
                  outerRadius={arc.radius}
                />
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </Box>
    </RootDiv>
  );
}
