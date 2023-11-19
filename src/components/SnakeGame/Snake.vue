<script lang="ts">
export type Controller = Record<
  'up' | 'left' | 'down' | 'right' | 'clockwise' |'anticlockwise',
  () => void
>;
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const emit = defineEmits<{
  lose: [];
  controls: [Controller];
}>();

type Vector2 = [number, number];

const SNAKE_START_SIZE = 9;

const HEAD: Vector2 = [42, 21];

const nodes: [Vector2, ...Vector2[]] = [
  HEAD,
  ...Array.from({ length: SNAKE_START_SIZE - 1 })
    .map((_, i): Vector2 => [HEAD[0] - i - 1, HEAD[1]])
];

function takeSnapshot() {
  return [...nodes.map((node) => [...node])] as Vector2[];
}

let lastSnapshot = takeSnapshot();

const speed: Vector2 = [1, 0];

const snakePath = ref('');
const foodPos = ref(generateFoodPos());
const lost = ref(false);

watch(lost, (lost) => {
  if (lost) emit('lose');
});

function randRange(a: number, b: number) {
  return Math.floor(Math.random() * (b - a)) + a;
}

function generateFoodPos(): Vector2 {
  const nodesSet = new Set(lastSnapshot.map(([x, y]) => `${x}/${y}`));
  const mapPositions: Vector2[] = [];

  for (let i = 1; i < 50; ++i) {
    for (let j = 1; j < 50; ++j) {
      if (nodesSet.has(`${i}/${j}`)) continue;
      mapPositions.push([i, j]);
    }
  }

  const n = randRange(0, mapPositions.length);

  return mapPositions[n]!;
}

function buildSnakeBody() {
  let res = `M ${nodes[0][0]} ${nodes[0][1]}`;

  for (let i = 0; i < nodes.length - 1; ++i) {
    const node = nodes[i]!;
    const nextNode = nodes[i+1]!;
    const nextNodeSnap = lastSnapshot[i + 1]!;

    const [dx, dy] = [
      nextNode[0] - node[0],
      nextNode[1] - node[1],
    ] as Vector2;

    if (dx && dy) {
      const snapDx = nextNodeSnap[0] - node[0];

      if (Math.abs(snapDx) === 1) {
        res += ` c 0 ${dy}, 0 ${dy}, ${dx} ${dy}`;
      }
      else {
        res += ` c ${dx} 0, ${dx} 0, ${dx} ${dy}`;
      }
    }
    else {
      res += ` l ${dx} ${dy}`;
    }
  }

  return res;
}

const MAX_FPS = 30;

onMounted(() => {
  let fps = 15;
  let prevTime = performance.now();

  const keyQueue: Vector2[] = [];

  const movement = (key: Vector2) => () => {
    keyQueue.push(key);
  };

  const controller: Controller = {
    up: movement([0, -1]),
    left: movement([-1, 0]),
    down: movement([0, +1]),
    right: movement([+1, 0]),
    clockwise() {
      if (speed[0] === +1) this.down();
      else if (speed[0] === -1) this.up()
      else if (speed[1] === +1) this.left();
      else if (speed[1] === -1) this.right();
    },
    anticlockwise() {
      if (speed[0] === +1) this.up();
      else if (speed[0] === -1) this.down()
      else if (speed[1] === +1) this.right();
      else if (speed[1] === -1) this.left();
    }
  };

  emit('controls', controller);

  const keyMap: Record<string, () => void> = {
    'w': controller.up,
    'arrowup': controller.up,
    'a': controller.left,
    'arrowleft': controller.left,
    's': controller.down,
    'arrowdown': controller.down,
    'd': controller.right,
    'arrowright': controller.right,
  };

  document.addEventListener('keydown', (e) => {
    const move = keyMap[e.key.toLowerCase()];

    if (!move) return;

    move();
  });

  let isGrowing = false;

  let frame: number;

  function lose() {
    lost.value = true;
    cancelAnimationFrame(frame);
  }

  function animate(time: number) {
    frame = requestAnimationFrame(animate);

    snakePath.value = buildSnakeBody();

    const dt = time - prevTime;
    prevTime = time;

    const fakeHead = [nodes[0][0] + speed[0], nodes[0][1] + speed[1]] as const;

    const head = nodes[0];

    const v = speed[0] || speed[1];
    const pos = speed[0] ? head[0] : head[1];

    const snapped = snap(v, pos + v * dt * fps / 1000) - snap(v, pos) === v;

    for (let ii = nodes.length - 1 - Number(isGrowing); ii >= 0; --ii) {
      const curr = nodes[ii]!;
      const prev = lastSnapshot[ii - 1] ?? fakeHead;

      const currentSpeed = [
        (prev[0] - curr[0]) / (Math.abs(prev[0] - curr[0]) || 1),
        (prev[1] - curr[1]) / (Math.abs(prev[1] - curr[1]) || 1),
      ] as const;

      for (const dir of [0, 1] as const) {
        if (!currentSpeed[dir]) continue;

        const v = currentSpeed[dir];

        if (snapped) {
          nodes[ii]![dir] = snap(v, nodes[ii]![dir] + v);
          continue;
        }

        const prevK = nodes[ii]![dir]!;

        const newK = prevK + v * dt * fps / 1000;
        const snappedK = snap(v, newK);

        if (snappedK - snap(v, prevK) === v) {
          nodes[ii]![dir] = snappedK;
        }
        else {
          nodes[ii]![dir] = newK;
        }
      }
    }

    // If the head didn't snap, we are in a transition frame
    if (!snapped) return;

    const [x, y] = nodes[0];

    if (x <= 0 || x >= 50 || y <= 0 || y >= 50) {
      lose();
    }

    for (let i = 1; i < nodes.length; ++i) {
      const [nx, ny] = nodes[i]!;
      if (x === nx && y === ny) {
        lose();
      }
    }

    lastSnapshot = takeSnapshot();

    if (isGrowing) {
      isGrowing = false;
      foodPos.value = generateFoodPos();

      if ((nodes.length - SNAKE_START_SIZE) % 3 === 0) {
        fps = Math.min(fps + 1, MAX_FPS);
      }
    }

    let nextSpeed: Vector2 | undefined;

    do {
      nextSpeed = keyQueue.shift();
    } while (
      nextSpeed &&
      Math.abs(nextSpeed[0]) === Math.abs(speed[0]) &&
      Math.abs(nextSpeed[1]) === Math.abs(speed[1])
    );

    if (nextSpeed) {
      speed[0] = nextSpeed[0];
      speed[1] = nextSpeed[1];
    }

    const [vx, vy] = speed;
    const [foodX, foodY] = foodPos.value;

    if (x + vx === foodX && y + vy === foodY) {
      const lastNode = nodes[nodes.length - 1]!;
      nodes.push([...lastNode]);
      isGrowing = true;
    }
  }

  frame = requestAnimationFrame(animate);

  onBeforeUnmount(() => cancelAnimationFrame(frame));
});

function snap(v: number, position: number) {
  return v > 0 ? Math.floor(position) : Math.ceil(position);
}
</script>

<template>
  <g class="interactive">
    <path
      class="food"
      :d="`M ${foodPos[0]} ${foodPos[1]} l0 0`"
    />
    <path
      d="M 0 0 l 50 0 l 0 50 l -50 0 l 0 -50"
      :class="{ lost }"
    />
    <path
      class="snake"
      :class="{ lost }"
      :d="snakePath"
    />
  </g>
</template>

<style scoped lang="scss">
.interactive {
  stroke-width: 0.8;
}

.snake {
  stroke-linecap: round;

  &.lost {
    @apply stroke-red-400;
    animation: lost .3s ease infinite alternate;
  }
}

.food {
  @apply stroke-orange-600 dark:stroke-yellow-300;
}

@keyframes lost {
  to {
    opacity: .5;
  }
}
</style>
