import { ValueError } from "../src";
import { Matrix } from "../src/math";

test("Checks invalid matrix dimensions", () => {
  expect(() => {
    new Matrix([], []);
  }).toThrow(ValueError);
});

test("Checks invalid matrix data", () => {
  expect(() => {
    new Matrix([2, 3], [0, 1, 2, 3]);
  }).toThrow(ValueError);
});

test("Reads matrix correctly", () => {
  const mat1 = new Matrix([2, 3], Array.from(new Array(2 * 3).keys()));
  for (let row = 0; row < 2; row++)
    for (let col = 0; col < 3; col++)
      expect(mat1.get(row, col)).toBe(row * 3 + col);

  const mat2 = new Matrix([2, 3, 4], Array.from(new Array(2 * 3 * 4).keys()));
  for (let x = 0; x < 2; x++)
    for (let y = 0; y < 3; y++)
      for (let z = 0; z < 4; z++)
        expect(mat2.get(x, y, z)).toBe(x * 3 * 4 + y * 4 + z);

  expect(() => mat1.get(100)).toThrow(ValueError);
});

test("Writes matrix correctly", () => {
  const mat = new Matrix([2, 3], Array.from(new Array(2 * 3).keys()));
  mat.set(10, 1, 1);
  expect(mat.get(1, 1)).toBe(10);
});

test("Creates identity matrix correctly", () => {
  const mat = Matrix.identity(5);
  expect(mat.shape[0]).toBe(5);
  expect(mat.shape[1]).toBe(5);
  for (let x = 0; x < 5; x++)
    for (let y = 0; y < 5; y++) expect(mat.get(x, y)).toBe(+(x === y));
});

test("Copies matrix correctly", () => {
  const mat = new Matrix([3, 4], Array.from(new Array(3 * 4).keys()));
  const newMat = mat.copy();
  expect(newMat.shape.length).toBe(2);
  expect(newMat.shape[0]).toBe(3);
  expect(newMat.shape[1]).toBe(4);
  for (let x = 0; x < 3; x++)
    for (let y = 0; y < 4; y++) expect(newMat.get(x, y)).toBe(x * 4 + y);
});

test("Reshapes matrix correctly", () => {
  const mat1 = new Matrix([2, 3], Array.from(new Array(2 * 3).keys()));
  const mat2 = mat1.reshape([3, 2]);
  expect(mat2.shape.length).toBe(2);
  expect(mat2.shape[0]).toBe(3);
  expect(mat2.shape[1]).toBe(2);
  for (let x = 0; x < 3; x++)
    for (let y = 0; y < 2; y++) expect(mat2.get(x, y)).toBe(x * 2 + y);
});

test("Matrix properties accurate", () => {
  const mat = new Matrix([5, 7, 9]);
  expect(mat.is2D).toBe(false);
  expect(mat.isSquare).toBe(false);
  expect(mat.isVector).toBe(false);

  const mat2D = new Matrix([4, 3]);
  expect(mat2D.is2D).toBe(true);
  expect(mat2D.isSquare).toBe(false);
  expect(mat2D.isVector).toBe(false);

  const matSquare = new Matrix([100, 100]);
  expect(matSquare.is2D).toBe(true);
  expect(matSquare.isSquare).toBe(true);
  expect(matSquare.isVector).toBe(false);

  const matVector = new Matrix([6, 1]);
  expect(matVector.is2D).toBe(true);
  expect(matVector.isSquare).toBe(false);
  expect(matVector.isVector).toBe(true);
});

test("Matrix fills correctly", () => {
  const mat = new Matrix([5, 4]);
  mat.fill(2);
  const newMat = mat.toFilled(-11);
  expect(mat.shape.length).toBe(newMat.shape.length);
  for (let x = 0; x < 5; x++)
    for (let y = 0; y < 4; y++) {
      expect(mat.get(x, y)).toBe(2);
      expect(newMat.get(x, y)).toBe(-11);
    }
});

test("Matrix loops correctly", () => {
  const mat = new Matrix([2, 10], Array.from(new Array(2 * 10).keys()));
  let i = 0;
  mat.forEach((value) => {
    expect(value).toBe(i);
    i++;
  });
});

test("Matrix includes correctly", () => {
  const mat = new Matrix([4, 2], [0, 0, 1, 0, 1, 0, 2, 0]);
  expect(mat.includes(1)).toBe(true);
});

test("Matrix maps correctly", () => {
  const mat1 = new Matrix([3, 10], Array.from(new Array(3 * 10).keys()));
  const mat2 = mat1.map((value, [x, y]) => value * x);
  mat1.withMap((value, [x, y]) => value * y);
  for (let x = 0; x < 3; x++)
    for (let y = 0; y < 10; y++) {
      expect(mat1.get(x, y)).toBe((x * 10 + y) * y);
      expect(mat2.get(x, y)).toBe((x * 10 + y) * x);
    }
});

test("Matrix transposes correctly", () => {
  const mat1 = new Matrix([3, 3], Array.from(new Array(3 * 3).keys()));
  const mat2 = mat1.toTransposed();
  mat1.transpose();
  for (let x = 0; x < 3; x++)
    for (let y = 0; y < 3; y++) {
      expect(mat1.get(x, y)).toBe(y * 3 + x);
      expect(mat2.get(x, y)).toBe(y * 3 + x);
    }
  mat2.transpose();
  for (let x = 0; x < 3; x++)
    for (let y = 0; y < 3; y++) expect(mat2.get(x, y)).toBe(x * 3 + y);
});

test("Matrix slicing correctly", () => {
  // prettier-ignore
  const mat = new Matrix([2, 3, 4], [
    0, 1, 2, 3,
    4, 5, 6, 7,
    8, 9, 10, 11,

    12, 13, 14, 15,
    16, 17, 18, 19,
    20, 21, 22, 23,
  ]);
  const newMat = mat.slice(1, [0, 2]);
  expect(newMat.shape.length).toBe(3);
  expect(newMat.shape[0]).toBe(1);
  expect(newMat.shape[1]).toBe(2);
  expect(newMat.shape[2]).toBe(4);
  for (let x = 0; x < 1; x++)
    for (let y = 0; y < 2; y++)
      for (let z = 0; z < 4; z++)
        expect(newMat.get(x, y, z)).toBe(
          [
            [
              [12, 13, 14, 15],
              [16, 17, 18, 19],
            ],
          ][x][y][z],
        );
});

test("Matrix adds correctly", () => {
  const mat1 = new Matrix([5, 2], Array.from(new Array(5 * 2).keys()));
  const mat2 = mat1.copy();
  const mat = mat1.add(mat2);
  mat1.withAdd(mat);
  for (let x = 0; x < 5; x++)
    for (let y = 0; y < 2; y++) {
      expect(mat1.get(x, y)).toBe((x * 2 + y) * 3);
      expect(mat.get(x, y)).toBe((x * 2 + y) * 2);
    }
});

test("Matrix adds scalars correctly", () => {
  const mat1 = new Matrix([5, 2], Array.from(new Array(5 * 2).keys()));
  const mat2 = mat1.addScalar(2);
  mat1.withAddScalar(5);
  for (let x = 0; x < 5; x++)
    for (let y = 0; y < 2; y++) {
      expect(mat1.get(x, y)).toBe(x * 2 + y + 5);
      expect(mat2.get(x, y)).toBe(x * 2 + y + 2);
    }
});

test("Matrix subtracts correctly", () => {
  const mat1 = new Matrix([5, 2], Array.from(new Array(5 * 2).keys()));
  const mat2 = mat1.copy();
  const mat = mat1.sub(mat2);
  mat1.withSub(mat);
  for (let x = 0; x < 5; x++)
    for (let y = 0; y < 2; y++) {
      expect(mat1.get(x, y)).toBe(x * 2 + y);
      expect(mat.get(x, y)).toBe(0);
    }
});

test("Matrix subtracts scalars correctly", () => {
  const mat1 = new Matrix([5, 2], Array.from(new Array(5 * 2).keys()));
  const mat2 = mat1.subScalar(2);
  mat1.withSubScalar(5);
  for (let x = 0; x < 5; x++)
    for (let y = 0; y < 2; y++) {
      expect(mat1.get(x, y)).toBe(x * 2 + y - 5);
      expect(mat2.get(x, y)).toBe(x * 2 + y - 2);
    }
});

test("Matrix multiplies correctly", () => {
  /*
  [ 5 2 ][ 9 1 0 5 3 ]   [ 61 19 4 33 27 ]
  [ 1 4 ][ 8 7 2 4 6 ] = [ 41 29 8 21 27 ]
  [ 3 0 ]                [ 27  3 0 15  9 ]
   */
  const mat1 = new Matrix([3, 2], [5, 2, 1, 4, 3, 0]);
  const mat2 = new Matrix([2, 5], [9, 1, 0, 5, 3, 8, 7, 2, 4, 6]);
  const mat = mat1.postMul(mat2);
  expect(mat.shape.length).toBe(2);
  expect(mat.shape[0]).toBe(3);
  expect(mat.shape[1]).toBe(5);
  for (let x = 0; x < 3; x++)
    for (let y = 0; y < 5; y++)
      expect(mat.get(x, y)).toBe(
        [
          [61, 19, 4, 33, 27],
          [41, 29, 8, 21, 27],
          [27, 3, 0, 15, 9],
        ][x][y],
      );
});

test("Matrix multiplies scalars correctly", () => {
  const mat1 = new Matrix([3, 2], Array.from(new Array(3 * 2).keys()));
  const mat2 = mat1.mulScalar(2);
  mat1.withMulScalar(-5);
  for (let x = 0; x < 3; x++)
    for (let y = 0; y < 2; y++) {
      expect(mat1.get(x, y)).toBe((x * 2 + y) * -5);
      expect(mat2.get(x, y)).toBe((x * 2 + y) * 2);
    }
});

test("Matrix determinant calculated correctly", () => {
  const mat1 = new Matrix([1, 1], [12]);
  expect(mat1.det()).toBe(12);
  const mat2 = new Matrix([2, 2], [5, 2, 3, 9]);
  expect(mat2.det()).toBe(39);
  const mat3 = new Matrix(
    [4, 4],
    [1, 1, 1, 1, 1, 2, 4, 8, 1, -2, 4, -8, 1, 3, 9, 27],
  );
  expect(mat3.det()).toBe(120);
});
