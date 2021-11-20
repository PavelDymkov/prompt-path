export class DoubleDetector {
    isDouble = false;

    private timer!: ReturnType<typeof setTimeout>;

    constructor(public readonly ms: number) {}

    tap(): void {
        clearTimeout(this.timer);

        this.isDouble = true;

        setTimeout(() => {
            this.isDouble = false;
        }, this.ms);
    }
}
