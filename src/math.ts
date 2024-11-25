import { ValueError } from ".";

export const EPSILON = 0.001;

/**
 * Smoothly linearly interpolates from a to b using parameter t.
 * @param a - initial position.
 * @param b - final position.
 * @param t - interpolation parameter.
 * @returns linearly interpolated value between a and b using t.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

/**
 * Checks if a number is within a certain threshold of another.
 * @param a - source number.
 * @param b - compared number.
 * @param epsilon - threshold parameter. Should be small.
 * @returns whether or not a falls within epsilon of b.
 */
export function epsilonEquals(
  a: number,
  b: number,
  epsilon = EPSILON,
): boolean {
  return Math.abs(a - b) <= epsilon;
}

/**
 * Clamps a value with a minimum.
 * @param value - the value to be clamped.
 * @param min - the minimum possible value of value.
 * @returns the clamped value which is guranteed to be greater than the min.
 */
export function clampMin(value: number, min: number): number {
  return Math.max(value, min);
}
/**
 * Clamps a value with a maximum.
 * @param value - the value to be clamped.
 * @param max - the maximum possible value of value.
 * @returns the clamped value which is guranteed to be less than the max.
 */
export function clampMax(value: number, max: number): number {
  return Math.min(value, max);
}
/**
 * Clamps a value within a range.
 * @param value - the value to be clamped.
 * @param min - the minimum possible value of value.
 * @param max - the maximum possible value of value.
 * @returns the clamped value which is guranteed to be between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) [min, max] = [max, min];
  return clampMax(clampMin(value, min), max);
}
/**
 * Maps a value lying on one range to another.
 * @param value - the value to be map.
 * @param rangeSrc - the range the value lies on.
 * @param rangeDst - the range to be transfered to.
 * @returns the new value mapped to the new range.
 *
 * @example mapRange(1, [0, 2], [-5, 5]) = 0
 */
export function mapRange(
  value: number,
  rangeSrc: [number, number],
  rangeDst: [number, number],
): number {
  return (
    ((value - rangeSrc[0]) / (rangeSrc[1] - rangeSrc[0])) *
      (rangeDst[1] - rangeDst[0]) +
    rangeDst[0]
  );
}

/**
 * Computes the unsigned modulus of a number.
 * @param a - left-hand side of %.
 * @param b - right-hand side of %.
 * @returns the unsigned modulus of a with b.
 *
 * @example mod(-10, 3) = 2
 */
export function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

/**
 * Clamps an angle in radians within 0 to 2π.
 * @param angle - angle in radians.
 * @returns the same angle clamped between 0 and 2π.
 */
export function clampAngleRads(angle: number): number {
  return mod(angle, 2 * Math.PI);
}
/**
 * Clamps an angle in degrees within 0° to 360°.
 * @param angle - angle in degrees.
 * @returns the same angle clamped between 0° and 360°.
 */
export function clampAngleDegs(angle: number): number {
  return mod(angle, 360);
}

/**
 * Gets the angle in radians necessary to transform src into dst.
 * @param src - the original source angle in radians.
 * @param dst - the angle to rotate to in radians.
 * @returns the angle in radians necessary to rotate src to dst after adding it. This includes wrapping.
 *
 * @example angleDiffRads(0.25 * Math.PI, 1.75 * Math.PI) = -0.5 * Math.PI
 * @example angleDiffRads(0, 0.5 * Math.PI) = 0.5 * Math.PI
 */
export function angleDiffRads(src: number, dst: number): number {
  src = clampAngleRads(src);
  dst = clampAngleRads(dst);
  const diff = clampAngleRads(dst - src);
  if (diff > Math.PI) return diff - 2 * Math.PI;
  return diff;
}
/**
 * Gets the angle in degrees necessary to transform src into dst.
 * @param src - the original source angle in degrees.
 * @param dst - the angle to rotate to in degrees.
 * @returns the angle in degrees necessary to rotate src to dst after adding it. This includes wrapping.
 *
 * @example angleDiffRads(10, 350) = -20
 * @example angleDiffRads(-10, -180) = -170
 */
export function angleDiffDegs(src: number, dst: number): number {
  src = clampAngleDegs(src);
  dst = clampAngleDegs(dst);
  const diff = clampAngleDegs(dst - src);
  if (diff > 180) return diff - 360;
  return diff;
}

/**
 * Matrix representation. Supports any dimensionality but most functionality comes from 2D.
 */
export class Matrix {
  protected readonly dim: number[];
  protected readonly data: number[];

  /**
   * Construct a matrix.
   * @param dim - the dimensions of the matrix.
   * @param data - the data of the matrix. It is row-oriented and flat.
   */
  constructor(dim: number[], data?: number[]) {
    if (dim.length <= 0)
      throw new ValueError(`Dimensionality ${dim.length} is invalid`);
    this.dim = [...dim];
    let length = 1;
    for (const d of this.dim) {
      if (d <= 0) throw new ValueError(`Dimension ${d} is invalid`);
      if (d % 1 !== 0) throw new ValueError(`Dimension ${d} is not integer`);
      length *= d;
    }
    data = data ?? new Array(length).fill(0);
    if (data.length !== length)
      throw new ValueError(
        `Data length expected ${length}, got ${data.length}`,
      );
    this.data = [...data];
  }

  /**
   * Generates an identity matrix with a size.
   * @param size - the size of that matrix.
   * @returns the identity matrix for that size.
   */
  public static identity(size: number): Matrix {
    const data: number[] = [];
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) data.push(+(y === x));
    return new Matrix([size, size], data);
  }

  /**
   * Copies a matrix.
   * @returns a new matrix with the same data.
   */
  public copy(): Matrix {
    return new Matrix(this.dim, this.data);
  }

  /**
   * The shape or dimensions of the matrix.
   */
  public get shape(): number[] {
    return [...this.dim];
  }
  /**
   * Reshape a matrix from one dimension to another.
   * @param dim - the new dimensions to reshape to.
   * @returns a new reshaped matrix.
   */
  public reshape(dim: number[]): Matrix {
    return new Matrix(dim, this.data);
  }
  /**
   * Whether or not this matrix is 2D.
   */
  public get is2D(): boolean {
    return this.dim.length === 2;
  }
  /**
   * Whether or not this matrix is a 2D square.
   */
  public get isSquare(): boolean {
    return this.is2D && this.dim[0] === this.dim[1];
  }
  /**
   * Whether or not this matrix is a vector.
   */
  public get isVector(): boolean {
    return this.is2D && this.dim[1] === 1;
  }

  /**
   * Gets the flat index given the dimensioned indices.
   * @param indices - the indices.
   * @returns the flat index of the data value at those indices.
   */
  public getIndex(...indices: number[]): number {
    if (indices.length !== this.dim.length)
      throw new ValueError(
        `Indices length expected ${this.dim.length}, got ${indices.length}`,
      );
    let dataI = 0;
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      const axis = this.dim[i];
      if (index % 1 !== 0)
        throw new ValueError(`Index ${index} is not integer`);
      if (index < -axis)
        throw new RangeError(`Index ${index} is not on [${-axis}, 0)`);
      if (index >= axis)
        throw new RangeError(`Index ${index} is not on [0, ${axis})`);
      dataI *= axis;
      dataI += index + axis * +(index < 0);
    }
    return dataI;
  }
  /**
   * Gets the dimensioned indices given the flat index.
   * @param index - the flat index.
   * @returns the indices corresponding to that index.
   */
  public getIndices(index: number): number[] {
    if (index < 0 || index >= this.data.length)
      throw new RangeError(`Index ${index} is not on [0, ${this.data.length})`);
    if (index % 1 !== 0) throw new ValueError(`Index ${index} is not integer`);
    let length = this.data.length;
    let indices: number[] = [];
    for (const axis of this.dim) {
      length /= axis;
      indices.push(Math.floor(index / length));
      index %= length;
    }
    return indices;
  }

  /**
   * Gets a value at an index. It is row first, like how dimensions are counted.
   * @param indices - the index of that value.
   * @returns the value at that index.
   */
  public get(...indices: number[]): number {
    return this.data[this.getIndex(...indices)];
  }
  /**
   * Sets a value at an index. It is row first, like how dimensions are counted.
   * @param value - the new value.
   * @param indices - the index to change.
   */
  public set(value: number, ...indices: number[]): void {
    this.data[this.getIndex(...indices)] = value;
  }

  /**
   * Fills this matrix in place with a value.
   * @param value - the value to fill with.
   * @returns this same matrix.
   */
  public fill(value = 0): this {
    this.data.fill(value);
    return this;
  }
  /**
   * Fills a new matrix identical to this with a value.
   * @param value - the value to fill.
   * @returns a new matrix.
   */
  public toFilled(value = 0): Matrix {
    return this.copy().fill(value);
  }

  /**
   * Iterates through each value, row first.
   * @param callback - run for each value in the matrix.
   */
  public forEach(callback: (value: number, indices: number[]) => void): void {
    this.data.forEach((value, i) => callback(value, this.getIndices(i)));
  }

  /**
   * Checks whether this matrix includes a specific number.
   * @param value - the value to check for.
   * @returns whether or not this matrix includes that value.
   */
  public includes(value: number): boolean {
    return this.data.includes(value);
  }

  /**
   * Maps a callback to each value of this matrix, returning a new modified one.
   * @param callback - the mapping function.
   * @returns a new matrix with the function applied.
   */
  public map(callback: (value: number, indices: number[]) => number): Matrix {
    return new Matrix(
      this.dim,
      this.data.map((value, i) => callback(value, this.getIndices(i))),
    );
  }
  /**
   * Maps a callback to each value of this matrix in place.
   * @param callback - the mapping function.
   * @returns this same matrix, but modified.
   */
  public withMap(callback: (value: number, indices: number[]) => number): this {
    for (let i = 0; i < this.data.length; i++)
      this.data[i] = callback(this.data[i], this.getIndices(i));
    return this;
  }

  /**
   * Transposes this 2D matrix in place.
   * @returns this matrix.
   */
  public transpose(): this {
    if (!this.is2D)
      throw new TypeError(
        `Cannot transpose a non-2D matrix, got a ${this.dim.length}D matrix`,
      );
    const newData: number[] = [];
    for (let x = 0; x < this.dim[1]; x++)
      for (let y = 0; y < this.dim[0]; y++) newData.push(this.get(y, x));
    for (let i = 0; i < this.data.length; i++) this.data[i] = newData[i];
    return this;
  }
  /**
   * Creates the transposed version of this matrix.
   * @returns a new matrix that is this matrix, transposed.
   */
  public toTransposed(): Matrix {
    return this.copy().transpose();
  }

  /**
   * Gets a specific slice or range of this matrix.
   * @param ranges - the ranges of values per dimension. A single number means just that one index. Two numbers means everything between, excluding the last. Three numbers follows the same as two, but with a third step parameter.
   * @returns a new matrix which is a subsection of this matrix.
   */
  public slice(
    ...ranges: (number | [number, number] | [number, number, number])[]
  ) {
    ranges = [...ranges];
    if (ranges.length > this.dim.length)
      throw new ValueError(
        `Too many ranges, expected at most ${this.dim.length}, got ${ranges.length}`,
      );
    while (ranges.length < this.dim.length)
      ranges.push([0, this.dim[ranges.length]]);

    const newDim: number[] = [];
    const newData: number[] = [];

    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      const axis = this.dim[i];
      if (typeof range === "number") {
        if (range < 0 || range >= axis)
          throw new RangeError(`Range value ${range} is not on [0, ${axis})`);
        if (range % 1 !== 0)
          throw new ValueError(`Range value ${range} is not integer`);
        newDim.push(1);
        continue;
      }
      let start = range[0];
      if (start % 1 !== 0)
        throw new ValueError(`Range ${range}'s start ${start} is not integer`);
      if (start < -axis)
        throw new RangeError(
          `Range ${range}'s start ${start} is not on [-${axis}, 0)`,
        );
      if (start >= axis)
        throw new RangeError(
          `Range ${range}'s start ${start} is not on [0, ${axis})`,
        );
      start += axis * +(start < 0);

      let stop = range[1];
      if (stop % 1 !== 0)
        throw new ValueError(`Range ${range}'s stop ${stop} is not integer`);
      if (stop < -axis)
        throw new RangeError(
          `Range ${range}'s stop ${stop} is not on [-${axis}, 0]`,
        );
      if (stop > axis)
        throw new RangeError(
          `Range ${range}'s stop ${stop} is not on [0, ${axis}]`,
        );
      stop += axis * +(stop < 0);

      let step = range.length === 3 ? range[2] : stop > start ? 1 : -1;
      if (step % 1 !== 0)
        throw new ValueError(`Range ${range}'s step ${step} is not integer`);
      if (step === 0)
        throw new ValueError(
          `Range ${range} has step of 0, which will cause infinite looping`,
        );

      if (start < stop && step < 0)
        throw new ValueError(
          `Range ${range} expected ${start} -> ${stop}, but step ${step} was negative`,
        );
      if (stop < start && step > 0)
        throw new ValueError(
          `Range ${range} expected ${start} -> ${stop}, but step ${step} was positive`,
        );

      ranges[i] = [start, stop, step];
      newDim.push(Math.floor(Math.abs(start - stop) / step));
    }
    let indices: number[] = new Array(this.dim.length).fill(0);
    const dfs = (i: number) => {
      if (i >= ranges.length) return newData.push(this.get(...indices));
      const range = ranges[i] as number | [number, number, number];
      if (typeof range === "number") {
        indices[i] = range;
        dfs(i + 1);
        return;
      }
      const [start, stop, step] = range;
      if (start < stop) {
        for (let index = start; index < stop; index += step) {
          indices[i] = index;
          dfs(i + 1);
        }
      } else {
        for (let index = start; index > stop; index += step) {
          indices[i] = index;
          dfs(i + 1);
        }
      }
    };
    dfs(0);
    return new Matrix(newDim, newData);
  }

  /**
   * Adds one matrix to another.
   * @param mat - the matrix to add.
   * @returns a new matrix which is the sum of this and another.
   */
  public add(mat: Matrix): Matrix {
    if (this.dim.length !== mat.dim.length)
      throw new TypeError(
        `Cannot add two matrices with mismatching dimensionalities ${this.dim.length} and ${mat.dim.length}`,
      );
    for (let i = 0; i < this.dim.length; i++)
      if (this.dim[i] !== mat.dim[i])
        throw new TypeError(
          `Cannot add two matrices with mismatching dimensions ${this.dim[i]} and ${mat.dim[i]}`,
        );
    return new Matrix(
      this.dim,
      this.data.map((value, i) => value + mat.data[i]),
    );
  }
  /**
   * Adds one matrix to this one in place.
   * @param mat - the matrix to add.
   * @returns this matrix, modified.
   */
  public withAdd(mat: Matrix): this {
    if (this.dim.length !== mat.dim.length)
      throw new TypeError(
        `Cannot add two matrices with mismatching dimensionalities ${this.dim.length} and ${mat.dim.length}`,
      );
    for (let i = 0; i < this.dim.length; i++)
      if (this.dim[i] !== mat.dim[i])
        throw new TypeError(
          `Cannot add two matrices with mismatching dimensions ${this.dim[i]} and ${mat.dim[i]}`,
        );
    for (let i = 0; i < this.data.length; i++) this.data[i] += mat.data[i];
    return this;
  }
  /**
   * Subtracts one matrix from another.
   * @param mat - the matrix subtracted.
   * @returns a new matrix which is mat subtracted from this one.
   */
  public sub(mat: Matrix): Matrix {
    if (this.dim.length !== mat.dim.length)
      throw new TypeError(
        `Cannot subtract two matrices with mismatching dimensionalities ${this.dim.length} and ${mat.dim.length}`,
      );
    for (let i = 0; i < this.dim.length; i++)
      if (this.dim[i] !== mat.dim[i])
        throw new TypeError(
          `Cannot subtract two matrices with mismatching dimensions ${this.dim[i]} and ${mat.dim[i]}`,
        );
    return new Matrix(
      this.dim,
      this.data.map((value, i) => value - mat.data[i]),
    );
  }
  /**
   * Subtracts one matrix from this one in place.
   * @param mat - the matrix subtracted.
   * @returns this matrix, modified.
   */
  public withSub(mat: Matrix): this {
    if (this.dim.length !== mat.dim.length)
      throw new TypeError(
        `Cannot subtract two matrices with mismatching dimensionalities ${this.dim.length} and ${mat.dim.length}`,
      );
    for (let i = 0; i < this.dim.length; i++)
      if (this.dim[i] !== mat.dim[i])
        throw new TypeError(
          `Cannot subtract two matrices with mismatching dimensions ${this.dim[i]} and ${mat.dim[i]}`,
        );
    for (let i = 0; i < this.data.length; i++) this.data[i] -= mat.data[i];
    return this;
  }

  /**
   * Adds a scalar to this matrix.
   * @param a - the value added to each number of this matrix.
   * @returns a new matrix which contains that output.
   */
  public addScalar(a: number): Matrix {
    return this.map((value) => value + a);
  }
  /**
   * Adds a scalar to this matrix, in place.
   * @param a - the value added to each number of this matrix.
   * @returns this matrix, modified.
   */
  public withAddScalar(a: number): this {
    return this.withMap((value) => value + a);
  }

  /**
   * Subtracts a scalar from this matrix.
   * @param a - the value subtracted from each number of this matrix.
   * @returns a new matrix which contains that output.
   */
  public subScalar(a: number): Matrix {
    return this.map((value) => value - a);
  }
  /**
   * Subtracts a scalar from this matrix, in place.
   * @param a - the value subtracted from each number of this matrix.
   * @returns this matrix, modified.
   */
  public withSubScalar(a: number): this {
    return this.withMap((value) => value - a);
  }

  /**
   * Postmultiplies this matrix with another.
   * @param mat - the matrix to be postmultiplied.
   * @returns a new matrix with that output.
   */
  public postMul(mat: Matrix): Matrix {
    if (!this.is2D)
      throw new TypeError(
        `Cannot matrix multiply a non-2D matrix, got a ${this.dim.length}D matrix`,
      );
    if (!mat.is2D)
      throw new TypeError(
        `Cannot matrix multiply a non-2D matrix, got a ${mat.dim.length}D matrix`,
      );
    if (this.dim[1] !== mat.dim[0])
      throw new TypeError(
        `Cannot matrix multiply with a mismatching dimension: ${this.dim[1]} != ${mat.dim[0]}`,
      );
    const newDim = [this.dim[0], mat.dim[1]];
    const newData: number[] = [];
    for (let row = 0; row < newDim[0]; row++) {
      for (let col = 0; col < newDim[1]; col++) {
        let value = 0;
        for (let i = 0; i < this.dim[1]; i++)
          value += this.get(row, i) * mat.get(i, col);
        newData.push(value);
      }
    }
    return new Matrix(newDim, newData);
  }
  /**
   * Premultiplies this matrix with another.
   * @param mat - the matrix to be premultiplied.
   * @returns a new matrix with that output.
   */
  public preMul(mat: Matrix): Matrix {
    return mat.postMul(this);
  }

  /**
   * Multiplies a scalar value to this matrix.
   * @param a - the value that will be multiplied with each number of this matrix.
   * @returns a new matrix with that output.
   */
  public mulScalar(a: number): Matrix {
    return this.map((value) => value * a);
  }
  /**
   * Multiplies a scalar value to this matrix, in place.
   * @param a - the value that will be multiplied with each number of this matrix.
   * @returns this matrix, modified.
   */
  public withMulScalar(a: number): this {
    for (let i = 0; i < this.data.length; i++) this.data[i] *= a;
    return this;
  }

  /**
   * Finds the determinant of this 2D square matrix.
   * @returns the determinant.
   */
  public det(): number {
    if (!this.is2D)
      throw new TypeError(
        `Cannot find determinant of a non-2D matrix, got a ${this.dim.length}D matrix`,
      );
    if (!this.isSquare)
      throw new TypeError(
        `Cannot find determinant of a non-square matrix, got a ${this.dim[0]}x${this.dim[1]} matrix`,
      );
    const size = this.dim[0];
    if (size === 1) return this.data[0];
    if (size === 2)
      return this.data[0] * this.data[3] - this.data[1] * this.data[2];
    let sum = 0;
    for (let col = 0; col < size; col++) {
      let add = 1,
        sub = 1;
      for (let i = 0; i < size; i++) {
        add *= this.get(i, mod(col + i, size));
        sub *= this.get(i, mod(col - i, size));
      }
      sum += add - sub;
    }
    return sum;
  }
}

/**
 * Vector respresentation. Essentially a nx1 matrix.
 */
export class Vec<T extends 2 | 3 | 4> extends Matrix {
  /**
   * Constructs a vector of a given size and the data required.
   * @param size - the size, either 2, 3, or 4.
   * @param data - the data of the vector, in order.
   */
  constructor(size: T, data: number[]) {
    super([size, 1], data);
  }

  /**
   * Checks whether or not a matrix is a vector of a specific size.
   * @param size - the size, either 2, 3, or 4.
   * @param mat - the matrix to check.
   * @returns whether or not that matrix matches the specifications.
   */
  public static isVec(size: 2 | 3 | 4, mat: Matrix): boolean {
    return mat.isVector && mat.shape[0] === size;
  }
  /**
   * Casts a matrix to a vector of a specific size.
   * @param size - the size to cast to.
   * @param mat - the matrix to cast.
   * @returns a new vector representation of that matrix.
   */
  public static toVec<T extends 2 | 3 | 4>(size: T, mat: Matrix): Vec<T> {
    if (!mat.isVector)
      throw new ValueError(
        `Cannot convert matrix ${mat.shape.join("x")} to vector-${size}`,
      );
    const data: number[] = [];
    for (let i = 0; i < Math.min(size, mat.shape[0]); i++)
      data.push(mat.get(i, 0));
    while (data.length < size) data.push(0);
    return new Vec(size, data);
  }

  /**
   * Copies this vector into another.
   * @returns another vector, identical to this one.
   */
  public copy(): Vec<T> {
    return this.toVec(super.copy());
  }

  /**
   * The size of the vector, either 2, 3, or 4.
   */
  public get size(): T {
    return this.dim[0] as T;
  }

  /**
   * Checks whether or not a matrix is a vector of this vector's size.
   * @param mat - the matrix to check.
   * @returns whether or not that matrix matches the specifications.
   */
  public isVec(mat: Matrix): boolean {
    return Vec.isVec(this.size, mat);
  }
  /**
   * Casts a matrix to a vector of a this vector's size.
   * @param mat - the matrix to cast.
   * @returns a new vector representation of that matrix.
   */
  public toVec(mat: Matrix): Vec<T> {
    return Vec.toVec(this.size, mat);
  }

  /**
   * The magnitude of the vector, squared.
   */
  public get magSquared(): number {
    return this.data
      .map((value) => Math.pow(value, 2))
      .reduce((a, b) => a + b, 0);
  }
  /**
   * The magnitude of the vector.
   */
  public get mag(): number {
    return Math.sqrt(this.magSquared);
  }

  /**
   * The x coordinate of the vector. NaN if the x coordinate does not exist.
   */
  public get x(): number {
    if (this.size < 1) return NaN;
    return this.data[0];
  }
  public set x(value: number) {
    if (this.size < 1) return;
    this.data[0] = value;
  }

  /**
   * The y coordinate of the vector. NaN if the y coordinate does not exist.
   */
  public get y(): number {
    if (this.size < 2) return NaN;
    return this.data[1];
  }
  public set y(value: number) {
    if (this.size < 2) return;
    this.data[1] = value;
  }

  /**
   * The z coordinate of the vector. NaN if the z coordinate does not exist.
   */
  public get z(): number {
    if (this.size < 3) return NaN;
    return this.data[2];
  }
  public set z(value: number) {
    if (this.size < 3) return;
    this.data[2] = value;
  }

  /**
   * The w coordinate of the vector. NaN if the w coordinate does not exist.
   */
  public get w(): number {
    if (this.size < 4) return NaN;
    return this.data[3];
  }
  public set w(value: number) {
    if (this.size < 4) return;
    this.data[3] = value;
  }

  /**
   * The x and y coordinates of the vector.
   */
  public get xy(): [number, number] {
    return [this.x, this.y];
  }
  /**
   * The x, y, and z coordinates of the vector.
   */
  public get xyz(): [number, number, number] {
    return [this.x, this.y, this.z];
  }
  /**
   * The x, y, z, and w coordinates of the vector.
   */
  public get xyzw(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }
  /**
   * The w, x, y, and z coordinates of the vector.
   */
  public get wxyz(): [number, number, number, number] {
    return [this.w, this.x, this.y, this.z];
  }

  /**
   * Gets an axis/coordinate value given its index in order of x, y, z, w.
   * @param i - the index of the coordinate.
   * @returns the coordinate value.
   */
  public getAxis(i: number) {
    if (i < 0 || i >= this.size)
      throw new RangeError(`Index ${i} is not on [0, ${this.size})`);
    if (i % 1 !== 0) throw new ValueError(`Index ${i} is not integer`);
    return this.data[i];
  }

  /**
   * Transforms this vector to a unit vector, in place.
   * @returns this modified vector.
   */
  public unit(): this {
    if (this.magSquared > 0) this.withMulScalar(1 / this.mag);
    return this;
  }
  /**
   * Transforms this vector to a unit vector.
   * @returns a new vector.
   */
  public toUnit(): Vec<T> {
    return this.toVec(this).unit();
  }

  /**
   * Calculate the dot product between this vector and another.
   * @param mat - the matrix/vector to compute the dot product.
   * @returns the dot product.
   */
  public dot(mat: Matrix): number {
    const vec = this.toVec(mat);
    let sum = 0;
    for (let i = 0; i < this.size; i++) sum += this.getAxis(i) * vec.getAxis(i);
    return sum;
  }

  /**
   * Projects a vector onto this vector.
   * @param mat - the vector to project onto this.
   * @returns a new vector.
   */
  public project(mat: Matrix): Vec<T> {
    const vec = this.toVec(mat);
    return this.toVec(this.mulScalar(this.dot(vec) / this.magSquared));
  }
  /**
   * Projects a vector onto this vector, in place.
   * @param mat - the vector to project onto this.
   * @returns this vector, modified.
   */
  public withProject(mat: Matrix): this {
    const vec = this.toVec(mat);
    return this.withMulScalar(this.dot(vec) / this.magSquared);
  }

  /**
   * Gets the angle of a 2D vector with respect to the +x axis.
   * @returns the angle in degrees, or NaN if not a 2D vector.
   */
  public getAngle(): number {
    if (this.size !== 2) return NaN;
    return clampAngleDegs((Math.atan2(this.y, this.x) / Math.PI) * 180);
  }

  /**
   * Rotates a 2D vector around the origin.
   * @param angle - the angle to rotate counterclockwise, in degrees.
   * @returns this vector, unmodified if not a 2D vector.
   */
  public rotate(angle: number): this {
    if (this.size !== 2) return this;
    const x = this.x;
    const angleX = angle;
    const y = this.y;
    const angleY = angle + 90;
    const xX = x * Math.cos((angleX * Math.PI) / 180);
    const xY = x * Math.sin((angleX * Math.PI) / 180);
    const yX = y * Math.cos((angleY * Math.PI) / 180);
    const yY = y * Math.sin((angleY * Math.PI) / 180);
    this.x = xX + yX;
    this.y = xY + yY;
    return this;
  }
  /**
   * Rotates a 2D vector around the origin.
   * @param angle - the angle to rotate counterclockwise, in degrees.
   * @returns a new vector, unmodified if not a 2D vector.
   */
  public toRotate(angle: number): Vec<T> {
    return this.toVec(this).rotate(angle);
  }

  /**
   * Gets the cross product matrix to be premultiplied to correctly calculate.
   * @returns a matrix representing that operation.
   */
  public getCrossMat(): Matrix {
    const vec = Vec.toVec(3, this);
    const [x, y, z] = vec.xyz;
    return new Matrix([3, 3], [0, -z, y, z, 0, -x, -y, x, 0]);
  }
  /**
   * Compute the cross product between this and another vector.
   * @param mat - the vector on the right hand side of the cross product.
   * @returns a new vector representing that cross product output.
   */
  public cross(mat: Matrix): Vec<3> {
    const aMat = this.getCrossMat();
    const b = Vec.toVec(3, mat);
    return Vec.toVec(3, aMat.postMul(b));
  }
}

export function getRotationMatrix(axis: Vec<3>, angle: number): Matrix {
  angle *= Math.PI / 180;
  const crossMat = axis.getCrossMat();
  const crossMatSq = crossMat.postMul(crossMat);
  return Matrix.identity(3)
    .withAdd(crossMat.mulScalar(Math.sin(angle)))
    .withAdd(crossMatSq.mulScalar(1 - Math.cos(angle)));
}
export function getRotationMatrixAxes(
  rX: number,
  rY: number,
  rZ: number,
): Matrix {
  const Rx = getRotationMatrix(new Vec(3, [1, 0, 0]), rX);
  const Ry = getRotationMatrix(new Vec(3, [0, 1, 0]), rY);
  const Rz = getRotationMatrix(new Vec(3, [0, 0, 1]), rZ);
  return Rx.postMul(Ry).postMul(Rz);
}
export function getTransformMatrix(
  translate: Vec<3>,
  rotation: Matrix,
): Matrix {
  if (!rotation.is2D) throw new TypeError(`Rotation matrix is not 2D`);
  if (rotation.shape[0] !== 3 || rotation.shape[1] !== 3)
    throw new TypeError(
      `Rotation matrix dimensions ${rotation.shape.join("x")} is invalid`,
    );
  // prettier-ignore
  const mat = new Matrix(
    [4, 4],
    [
      0, 0, 0, translate.x,
      0, 0, 0, translate.y,
      0, 0, 0, translate.z,
      0, 0, 0, 1,
    ],
  );
  for (let x = 0; x < 3; x++)
    for (let y = 0; y < 3; y++) mat.set(rotation.get(x, y), x, y);
  return mat;
}
