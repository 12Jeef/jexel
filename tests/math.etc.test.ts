import {
  Vec,
  getRotationMatrix,
  getRotationMatrixAxes,
  getTransformMatrix,
} from "../src/math";

test("Rotation matrix correct", () => {
  const vec1 = new Vec(3, [1, 0, 0]);
  const R = getRotationMatrix(new Vec(3, [1, 1, 0]).unit(), 180);
  const vec2 = Vec.toVec(3, R.postMul(vec1));
  expect(vec2.x).toBeCloseTo(0);
  expect(vec2.y).toBeCloseTo(1);
  expect(vec2.z).toBeCloseTo(0);
});

test("Multiple rotation matrices correct", () => {
  const vec1 = new Vec(3, [1, 0, 0]);
  const R = getRotationMatrixAxes(0, 90, 90);
  // TODO: finish this
});
