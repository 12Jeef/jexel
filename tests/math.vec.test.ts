import { Matrix, Vec } from "../src/math";

test("Vector constructs correctly", () => {
  const vec = new Vec(3, [1, 2, 3]);
  expect(vec.isVector).toBeTruthy();
  expect(vec.shape[0]).toBe(3);
  expect(vec.size).toBe(3);
});

test("Vector checking correctly", () => {
  const vecLike = new Matrix([2, 1], [100, -200]);
  expect(Vec.isVec(2, vecLike)).toBeTruthy();
  expect(Vec.isVec(3, vecLike)).toBeFalsy();
  expect(Vec.isVec(4, vecLike)).toBeFalsy();

  const vec2 = new Vec(2, [0, 0]);
  expect(vec2.isVec(vecLike)).toBeTruthy();
  const vec3 = new Vec(3, [0, 0, 0]);
  expect(vec3.isVec(vecLike)).toBeFalsy();
});

test("Vector casting correctly", () => {
  const vecLike1 = new Matrix([2, 1], [100, -200]);
  const vecLike2 = new Matrix([2, 1], [50, -100]);

  const vec2 = Vec.toVec(2, vecLike1);
  expect(vec2.isVector).toBeTruthy();
  expect(vec2.size).toBe(2);
  expect(vec2.get(0, 0)).toBe(100);
  expect(vec2.get(1, 0)).toBe(-200);

  const vec3 = Vec.toVec(3, vecLike1);
  expect(vec3.isVector).toBeTruthy();
  expect(vec3.size).toBe(3);
  expect(vec3.get(0, 0)).toBe(100);
  expect(vec3.get(1, 0)).toBe(-200);
  expect(vec3.get(2, 0)).toBe(0);

  const vec4 = Vec.toVec(4, vecLike1);
  expect(vec4.isVector).toBeTruthy();
  expect(vec4.size).toBe(4);
  expect(vec4.get(0, 0)).toBe(100);
  expect(vec4.get(1, 0)).toBe(-200);
  expect(vec4.get(2, 0)).toBe(0);
  expect(vec4.get(3, 0)).toBe(0);

  const vec22 = vec2.toVec(vecLike2);
  expect(vec22.isVector).toBeTruthy();
  expect(vec22.size).toBe(2);
  expect(vec22.get(0, 0)).toBe(50);
  expect(vec22.get(1, 0)).toBe(-100);

  const vec32 = vec3.toVec(vecLike2);
  expect(vec32.isVector).toBeTruthy();
  expect(vec32.size).toBe(3);
  expect(vec32.get(0, 0)).toBe(50);
  expect(vec32.get(1, 0)).toBe(-100);
  expect(vec32.get(2, 0)).toBe(0);

  const vec42 = vec4.toVec(vecLike2);
  expect(vec42.isVector).toBeTruthy();
  expect(vec42.size).toBe(4);
  expect(vec42.get(0, 0)).toBe(50);
  expect(vec42.get(1, 0)).toBe(-100);
  expect(vec42.get(2, 0)).toBe(0);
  expect(vec42.get(3, 0)).toBe(0);
});

test("Vector magnitudes are correct", () => {
  const vec = new Vec(3, [3, 4, 5]);
  expect(vec.magSquared).toBe(50);
  expect(vec.mag).toBeCloseTo(Math.sqrt(50));
});

test("Vector attributes accessed correctly", () => {
  const vec2 = new Vec(2, [1, 2]);
  const vec3 = new Vec(3, [3, 4, 5]);
  const vec4 = new Vec(4, [6, 7, 8, 9]);
  expect(vec2.x).toBe(1);
  expect(vec2.y).toBe(2);
  expect(vec2.z).toBe(NaN);
  expect(vec2.w).toBe(NaN);
  expect(vec3.x).toBe(3);
  expect(vec3.y).toBe(4);
  expect(vec3.z).toBe(5);
  expect(vec3.w).toBe(NaN);
  expect(vec4.x).toBe(6);
  expect(vec4.y).toBe(7);
  expect(vec4.z).toBe(8);
  expect(vec4.w).toBe(9);
});

test("Vector multi-attributes accessed correctly", () => {
  const vec = new Vec(3, [23, 5, 12]);

  const xy = vec.xy;
  expect(xy.length).toBe(2);
  expect(xy[0]).toBe(23);
  expect(xy[1]).toBe(5);

  const xyz = vec.xyz;
  expect(xyz.length).toBe(3);
  expect(xyz[0]).toBe(23);
  expect(xyz[1]).toBe(5);
  expect(xyz[2]).toBe(12);

  const xyzw = vec.xyzw;
  expect(xyzw.length).toBe(4);
  expect(xyzw[0]).toBe(23);
  expect(xyzw[1]).toBe(5);
  expect(xyzw[2]).toBe(12);
  expect(xyzw[3]).toBe(NaN);

  const wxyz = vec.wxyz;
  expect(wxyz.length).toBe(4);
  expect(wxyz[0]).toBe(NaN);
  expect(wxyz[1]).toBe(23);
  expect(wxyz[2]).toBe(5);
  expect(wxyz[3]).toBe(12);
});

test("Vector axes correct", () => {
  const vec = new Vec(3, [23, 5, 12]);
  expect(vec.getAxis(0)).toBe(23);
  expect(vec.getAxis(1)).toBe(5);
  expect(vec.getAxis(2)).toBe(12);
  expect(() => vec.getAxis(3)).toThrow(RangeError);
});

test("Unit vectors are correct", () => {
  const vec1 = new Vec(2, [3, 4]);
  const vec2 = vec1.toUnit();
  vec1.unit();
  expect(vec1.x).toBeCloseTo(3 / 5);
  expect(vec1.y).toBeCloseTo(4 / 5);
  expect(vec2.x).toBeCloseTo(3 / 5);
  expect(vec2.y).toBeCloseTo(4 / 5);
});

test("Dot product calculated correctly", () => {
  const vec1 = new Vec(2, [5, 8]);
  const vec2 = new Vec(4, [-10, 7, 9, -12]);
  const dot1 = vec1.dot(vec2);
  const dot2 = vec2.dot(vec1);
  expect(dot1).toBe(6);
  expect(dot2).toBe(6);
});

test("Vector projection calculated correctly", () => {
  const vec1 = new Vec(2, [0, 5]);
  const vec2 = new Vec(2, [100, 5000]);
  const proj = vec1.project(vec2);
  vec1.withProject(vec2);
  expect(vec1.x).toBeCloseTo(0);
  expect(vec1.y).toBeCloseTo(5000);
  expect(proj.x).toBeCloseTo(0);
  expect(proj.y).toBeCloseTo(5000);
});

test("Vector angles calculated correctly", () => {
  expect(new Vec(2, [1, 0]).getAngle()).toBeCloseTo(0);
  expect(new Vec(2, [-1, 0]).getAngle()).toBeCloseTo(180);
  expect(new Vec(2, [0, 1]).getAngle()).toBeCloseTo(90);
  expect(new Vec(2, [0, -1]).getAngle()).toBeCloseTo(270);
  expect(new Vec(2, [1, 1]).getAngle()).toBeCloseTo(45);
  expect(new Vec(2, [-1, 1]).getAngle()).toBeCloseTo(135);
  expect(new Vec(2, [-1, -1]).getAngle()).toBeCloseTo(225);
  expect(new Vec(2, [1, -1]).getAngle()).toBeCloseTo(315);
});

test("Vector rotated correctly", () => {
  const vec1 = new Vec(2, [1, 0]);
  const vec2 = vec1.toRotate(135);
  vec1.rotate(270);
  expect(vec1.x).toBeCloseTo(0);
  expect(vec1.y).toBeCloseTo(-1);
  expect(vec2.x).toBeCloseTo(-1 / Math.SQRT2);
  expect(vec2.y).toBeCloseTo(1 / Math.SQRT2);
});

test("Vector cross product calculated correctly", () => {
  const vec1 = new Vec(3, [1, 3, 4]);
  const vec2 = new Vec(3, [2, 7, -5]);
  const vec = vec1.cross(vec2);
  expect(vec.x).toBe(-43);
  expect(vec.y).toBe(13);
  expect(vec.z).toBe(1);
});
