import { IConsumables, IValetudoConsumablesApi } from "@/api";
import { MockApi } from "@/api/mock";

export class MockConsumablesApi implements IValetudoConsumablesApi {
    private parent: MockApi;

    constructor(parent: MockApi) {
      this.parent = parent;
    }

    public Get(): Promise<IConsumables> {
        return new Promise((res, rej) => {
            setTimeout(() => res({
                consumables: {
                    main_brush_work_time: 23854,
                    side_brush_work_time: 23854,
                    filter_work_time: 23854,
                    sensor_dirty_time: 21752,
                },
                summary: [
                        21752,
                        422265000,
                        36,
                        [1537424717,
                            1536430488,
                            1536323669,
                            1536286394,
                            1536286267,
                            1536284590,
                            1536270261,
                            1536270104,
                            1535280336,
                            1535277836,
                            1535128069,
                            1535127651,
                            1535123254,
                            1535122381,
                            1535117813,
                            1535051422,
                            1535022502,
                            1534958235,
                            1534958037,
                        1534957235]]}),
                        this.parent.fakeDelay);
        });
    }
    public async Reset(consumable: string): Promise<boolean> {
        return true;
    }
}
