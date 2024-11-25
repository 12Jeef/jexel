import * as math from "../src/math";

test("Lerps numbers correctly", () => {
  expect(math.lerp(2, 8, 0.25)).toBeCloseTo(3.5);
  expect(math.lerp(-5, 5, 0.5)).toBeCloseTo(0);
});

test("Epsilon compares numbers correctly", () => {
  expect(math.epsilonEquals(1.5, 1.4, 0.2)).toBe(true);
  expect(math.epsilonEquals(1.5, 1.2, 0.2)).toBe(false);
});

test("Clamps minimum correctly", () => {
  expect(math.clampMin(12, 10)).toBe(12);
  expect(math.clampMin(7.5, 10)).toBe(10);
});

test("Clamps maximum correctly", () => {
  expect(math.clampMax(12, 10)).toBe(10);
  expect(math.clampMax(7.5, 10)).toBe(7.5);
});

test("Clamps correctly", () => {
  expect(math.clamp(12, 5, 10)).toBe(10);
  expect(math.clamp(7.5, 5, 10)).toBe(7.5);
  expect(math.clamp(-100, 5, 10)).toBe(5);
});

test("Maps ranges correctly", () => {
  expect(math.mapRange(1, [0, 2], [-5, 5])).toBeCloseTo(0);
  expect(math.mapRange(0, [-5, 10], [6, 0])).toBeCloseTo(4);
});

test("Unsigned modulus correctly", () => {
  expect(math.mod(10, 3)).toBe(1);
  expect(math.mod(-10, 3)).toBe(2);
});

test("Clamps angles in radians correctly", () => {
  expect(math.clampAngleRads(3)).toBeCloseTo(3);
  expect(math.clampAngleRads(-3)).toBeCloseTo(2 * Math.PI - 3);
});

test("Clamps angles in degrees correctly", () => {
  expect(math.clampAngleDegs(120)).toBe(120);
  expect(math.clampAngleDegs(-90)).toBe(360 - 90);
});

test("Angle difference in radians calculated correctly", () => {
  expect(math.angleDiffRads(0.25 * Math.PI, 1.75 * Math.PI)).toBeCloseTo(
    -0.5 * Math.PI,
  );
  expect(math.angleDiffRads(0, 0.5 * Math.PI)).toBeCloseTo(0.5 * Math.PI);
});

test("Angle difference in degrees calculated correctly", () => {
  expect(math.angleDiffDegs(10, 350)).toBe(-20);
  expect(math.angleDiffDegs(-10, -180)).toBe(-170);
});
