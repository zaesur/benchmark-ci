import { trendDetection } from "./trenddetection";

describe("trendDetection", () => {
    test("should return the correct answer (0) when the array contains values equal to the current", () => {
        const n = 13;
        for (let i = 1; i < 3; i++) {
            expect(trendDetection(n, new Array(i).fill(n))).toBeCloseTo(0);
        }
    });

    test("should return the correct answer for arrays of length 1", () => {
        expect(trendDetection(110, [100])).toBeCloseTo(10);
    });

    test("should return the correct answer for arrays of length > 1", () => {
        expect(trendDetection(110, [105, 95])).toBeCloseTo(10);
    });

    test("should return the correct answer when the current is an improvement", () => {
        expect(trendDetection(90, [95, 100, 105])).toBeCloseTo(-10);
    });
});