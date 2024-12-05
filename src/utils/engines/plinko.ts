import Matter from "matter-js";
import { BIN_PAYOUTS, type RowCount } from "../consts";
import { get } from "svelte/store";
import {
  balance,
  betAmount,
  betAmountOfBalls,
  profitHistory,
  rowCount,
  winRecords,
} from "../stores";
import { randomBetween } from "../number";
import { v4 as uuidv4 } from "uuid";

export type PlinkoEngine = ReturnType<typeof createPlinkoEngine>;

export const config = {
  width: 760,
  height: 570,
  padding: { x: 52, top: 36, bottom: 28 },
  categories: { pin: 0x0001, ball: 0x0002 },
  ball: {
    friction: 0.5,
    restitution: 0.8,
    frictionAirByRowCount: {
      8: 0.0395,
      9: 0.041,
      10: 0.038,
      11: 0.0355,
      12: 0.0414,
      13: 0.0437,
      14: 0.0401,
      15: 0.0418,
      16: 0.0364,
    } as Record<RowCount, number>,
  },
};

export const getBinsWidthPercentage = (rowCount: RowCount) => {
  const lastRowPins = rowCount + 2;
  const pinDistanceX =
    (config.width - config.padding.x * 2) / (lastRowPins - 1);
  const totalWidth = pinDistanceX * (lastRowPins - 1);
  return totalWidth / config.width;
};

export const createPlinkoEngine = (canvas: HTMLCanvasElement) => {
  const engine = Matter.Engine.create({ timing: { timeScale: 1 } });
  const render = Matter.Render.create({
    engine,
    canvas,
    options: {
      width: config.width,
      height: config.height,
      background: "#0f1728",
      wireframes: false,
    },
  });
  const runner = Matter.Runner.create();

  let pins: Matter.Body[] = [];
  let walls: Matter.Body[] = [];
  let lastRowXs: number[] = [];
  let currentRowCount = get(rowCount);

  const getPinRadius = () => (24 - currentRowCount) / 2;
  const getPinDistanceX = () => {
    const lastRowPins = 3 + currentRowCount - 1;
    return (canvas.width - config.padding.x * 2) / (lastRowPins - 1);
  };

  const setupBoard = (newRowCount: RowCount) => {
    [...pins, ...walls].forEach((obj) =>
      Matter.Composite.remove(engine.world, obj),
    );

    pins = [];
    walls = [];
    lastRowXs = [];
    currentRowCount = newRowCount;

    for (let row = 0; row < currentRowCount; row++) {
      const rowY =
        config.padding.top +
        ((canvas.height - config.padding.top - config.padding.bottom) /
          (currentRowCount - 1)) *
          row;

      const rowPaddingX =
        config.padding.x +
        ((currentRowCount - 1 - row) * getPinDistanceX()) / 2;

      for (let col = 0; col < 3 + row; col++) {
        const colX =
          rowPaddingX +
          ((canvas.width - rowPaddingX * 2) / (3 + row - 1)) * col;

        const pin = Matter.Bodies.circle(colX, rowY, getPinRadius(), {
          isStatic: true,
          collisionFilter: {
            category: config.categories.pin,
            mask: config.categories.ball,
          },
          render: { fillStyle: "#fff" },
        });
        pins.push(pin);

        if (row === currentRowCount - 1) lastRowXs.push(colX);
      }
    }

    const firstPinX = pins[0].position.x;
    const leftWallAngle = Math.atan2(
      firstPinX - lastRowXs[0],
      canvas.height - config.padding.top - config.padding.bottom,
    );
    const leftWallX =
      firstPinX - (firstPinX - lastRowXs[0]) / 2 - getPinDistanceX() / 4;

    const leftWall = Matter.Bodies.rectangle(
      leftWallX,
      canvas.height / 2,
      10,
      canvas.height,
      {
        isStatic: true,
        angle: leftWallAngle,
        render: { visible: false },
      },
    );
    const rightWall = Matter.Bodies.rectangle(
      canvas.width - leftWallX,
      canvas.height / 2,
      10,
      canvas.height,
      {
        isStatic: true,
        angle: -leftWallAngle,
        render: { visible: false },
      },
    );
    walls.push(leftWall, rightWall);

    const sensor = Matter.Bodies.rectangle(
      canvas.width / 2,
      canvas.height,
      canvas.width,
      10,
      { isSensor: true, isStatic: true, render: { visible: false } },
    );

    Matter.Composite.add(engine.world, [...pins, ...walls, sensor]);
    Matter.Events.on(engine, "collisionStart", ({ pairs }) => {
      pairs.forEach(({ bodyA, bodyB }) => {
        const ball = bodyA === sensor ? bodyB : bodyA === sensor ? bodyA : null;
        if (ball) handleBallExit(ball);
      });
    });
  };

  const handleBallExit = (ball: Matter.Body) => {
    const binIndex = lastRowXs.findLastIndex((x) => x < ball.position.x);
    if (binIndex !== -1 && binIndex < lastRowXs.length - 1) {
      const betAmt = get(betAmountOfBalls)[ball.id] ?? 0;
      const multiplier = BIN_PAYOUTS[currentRowCount][binIndex];
      const payout = betAmt * multiplier;

      winRecords.update((v) => [
        ...v,
        {
          id: uuidv4(),
          betAmount: betAmt,
          rowCount: currentRowCount,
          binIndex,
          payout: [multiplier, payout],
          profit: payout - betAmt,
        },
      ]);

      profitHistory.update((h) => [...h, h.at(-1)! + (payout - betAmt)]);
      balance.update((b) => b + payout);
    }

    Matter.Composite.remove(engine.world, ball);
    betAmountOfBalls.update((v) => {
      const { [ball.id]: _, ...rest } = v;
      return rest;
    });
  };

  setupBoard(currentRowCount);
  rowCount.subscribe(setupBoard);

  return {
    start: () => {
      Matter.Render.run(render);
      Matter.Runner.run(runner, engine);
    },
    stop: () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
    dropBall: () => {
      const offsetRangeX = getPinDistanceX() * 0.8;
      const ball = Matter.Bodies.circle(
        randomBetween(
          canvas.width / 2 - offsetRangeX,
          canvas.width / 2 + offsetRangeX,
        ),
        0,
        getPinRadius() * 2,
        {
          restitution: config.ball.restitution,
          friction: config.ball.friction,
          frictionAir: config.ball.frictionAirByRowCount[currentRowCount],
          collisionFilter: {
            category: config.categories.ball,
            mask: config.categories.pin,
          },
          render: { fillStyle: "#ff0000" },
        },
      );
      Matter.Composite.add(engine.world, ball);
      betAmountOfBalls.update((v) => ({ ...v, [ball.id]: get(betAmount) }));
      balance.update((b) => b - get(betAmount));
    },
    getBinsWidthPercentage: () =>
      (lastRowXs.at(-1)! - lastRowXs[0]) / config.width,
  };
};
